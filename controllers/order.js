/* Order controller. */

var config = require('../config.js');
var moipOrder = require('../lib/moip/moipOrder.js');
var moipPayment = require('../lib/moip/moipPayment.js');
var clientDao = require('../service/dao/clientDao.js');
var orderDao = require('../service/dao/orderDao.js');
var productDao = require('../service/dao/productDao.js');

/**
 * Get an order.
 * 
 * @param {object} request Request parameters.
 * @param {object} response Response parameters.
 */
exports.get = function(request, response) {
    console.log('get', request.body.orderId);

    setTimeout(function() {
        response.contentType('application/json');
        response.end('{ "orderId": 666, "sent": ' + request.body.orderId + ', "status": 1, "message": "" }');
    }, 2000);
};

/**
 * Place an order.
 * 
 * @param {object} request Request parameters.
 * @param {object} response Response parameters.
 */
exports.put = function(request, response) {
    console.log('put', request.body);

    createClient(request, response);
};

/**
 * Create the client.
 * 
 * @param {object} request Request parameters.
 * @param {object} response Response parameters.
 */
function createClient(request, response) {
    let data = request.body.data;

    clientDao.createOrUpdate({
        email: data[0].value,
        fullname: data[1].value,
        birthDate: data[2].value,
        document: data[3].value,
        phone: data[4].value,
    }, function(clientId) {
        console.log('createClient.clientId', clientId);
        createOrder(clientId, request, response);
    });
}

/**
 * Create the order.
 * 
 * @param {int} clientId Client ID.
 * @param {object} request Request parameters.
 * @param {object} response Response parameters.
 */
function createOrder(clientId, request, response) {
    // Because this is just a sample, accepts the order's data from the client.
    // On production environment, the data must be validated, e.g. by using the product's IDs
    // to load them from database and recalculating prices, discounts and interest.

    let cart = request.body.cart;
    let data = request.body.data;

    orderDao.create({
        clientId: clientId,
        installments: data[8].value,
        extras: cart.discounts + cart.interest,
        total: cart.total,
        discountCode: data[9].value,
        products: cart.products
    }, function(orderId) {
        sendOrder(orderId, clientId, request, response);
    });
}

/**
 * Send the order to the Moip server.
 * 
 * @param {int} orderId Internal order ID.
 * @param {int} clientId Client ID.
 * @param {object} request Request parameters.
 * @param {object} response Response parameters.
 */
function sendOrder(orderId, clientId, request, response) {
    let order = new moipOrder.MoipOrder(config.config.moip);
    let data = request.body.data;
    let products = request.body.cart.products;

    for (let index = 0; index < products.length; index++) {
        let product = products[index];

        order.addItem({
            product: product.name,
            quantity: product.quantity,
            detail: '-',
            price: product.price,
        });
    }

    order.setCustomer({
        ownId: clientId,
        fullname: data[1].value, 
        email: data[0].value,
    })
    .execute().then(details => {
        console.log('order.execute', details);
        sendPayment(orderId, order, request, response);
    })
    .catch(err => {
        console.log(err);
    });
}

/**
 * Send the order to the Moip server.
 * 
 * @param {int} orderId Internal order ID.
 * @param {object} order Order object.
 * @param {object} request Request parameters.
 * @param {object} response Response parameters.
 */
function sendPayment(orderId, order, request, response) {
    let payment = new moipPayment.MoipPayment(order);
    let data = request.body.data;
    let phone = data[4].value.split(' ');
    let expiration = data[7].value.split('/');

    payment.setInstallments(data[8].value)
        .setCreditCard({
            number: data[5].value,
            expirationMonth: expiration[0],
            expirationYear: expiration[1],
            cvc: data[6].value
        })
        .setHolder({
            fullname: data[1].value,
            birthdate: data[2].value
        })
        .setDocument(data[3].value)
        .setPhone({
            countryCode: phone[0],
            areaCode: phone[1],
            number:  phone[2].replace('-', ''),
        })
        .execute().then(details => {
            console.log('payment.execute', details);

            response.contentType('application/json');
            response.end('{ "orderId": ' + orderId + ' }');
        })
        .catch(err => {
            console.log(err);
        });
}