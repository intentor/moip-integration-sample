/* Order controller. */

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
    }, 5000);
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
    var data = request.body.data;

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

    var cart = request.body.cart;
    var data = request.body.data;

    orderDao.create({
        clientId: clientId,
        installments: data[8].value,
        extras: cart.discounts + cart.interest,
        total: cart.total,
        discountCode: data[9].value,
        products: cart.products
    }, function(orderId) {
        response.contentType('application/json');
        response.end('{ "orderId": ' + orderId + ' }');
    });
}