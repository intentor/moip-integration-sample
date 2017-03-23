"use strict";

var https = require('https');
var moipHelper = require('./moipHelper.js');

/**
 * Moip order.
 */
class MoipOrder {
    /**
     * Create a new order.
     * 
     * @param {string} ownId Store's order ID.
     * @param {string} config Moip service settings - { token, urlOrder, urlPayment }.
     */
    constructor(ownId, config) {
        this.id = null;
        this.config = config;
        this.order = {
            ownId: ownId,
            items: [],
            customer: {}
        };
        this.amount = {
            total: 0.0,
            fees: 0.0,
            liquid: 0.0,
            discount: 0.0
        }
    }

    /**
     * Add an item to the order.
     * 
     * @param {object} item Order item - { product, quantity, detail, price }.
     * @returns This object, for chaining.
     */
    addItem(item) {
        this.order.items.push(item);
        return this;
    }

    /**
     * Set the customer related to the order.
     * 
     * @param {object} customer Customer details - { ownId, fullname, email }. 
     * @returns This object, for chaining.
     */
    setCustomer(customer) {
        this.order.customer = customer;
        return this;
    }

    /**
     * Set a discount value.
     * 
     * @param {number} value Discount value.
     */
    setDiscount(value) {
        this.order.amount = {
            subtotals: {
                discount: moipHelper.toApiNumber(value),
            }
        };
    }

    /**
     * Create the order.
     * 
     * @returns Promise object.
     */
    execute() {
        var scope = this;
        return new Promise((resolve, reject) => {
            let options = {
                host: scope.config.url,
                path: '/v2/orders',
                method: 'POST',
                headers: {
                    'Authorization': moipHelper.createAuth(scope.config.token, scope.config.key),
                    'Content-Type': 'application/json'
                }
            };

            let requestData = scope.createRequest();
            console.log('order.execute.post', options, requestData);

            let request = https.request(options, function(response) {
                let body = '';

                response.setEncoding('utf8');
                response.on('data', function(chunk) {
                    body += chunk;
                });
                response.on('end', function() {
                    let responseData = JSON.parse(body);
                    console.log('order.response', responseData);

                    if (!responseData.errors  && !responseData.ERROR) {
                        scope.id = responseData.id;
                        scope.amount.total = moipHelper.fromApiNumber(responseData.amount.total);
                        scope.amount.fees = moipHelper.fromApiNumber(responseData.amount.fees);
                        scope.amount.liquid = moipHelper.fromApiNumber(responseData.amount.liquid);
                        scope.amount.discount = moipHelper.fromApiNumber(responseData.amount.subtotals.discount);

                        resolve(scope.amount);
                    } else if (responseData.ERROR) {
                        reject(responseData.ERROR);
                    } else {
                        reject('Error during order creation. Please try again.');
                    }
                });
            });

            request.write(requestData);
            request.end();
        });
    }
    
    /**
     * Get order ID.
     * 
     * @return {string} Order ID.
     */
    getId() {
        return this.id;
    }
    
    /**
     * Get order store's ID.
     * 
     * @return {string} Order store's ID.
     */
    getOwnId() {
        return this.order.ownId;
    }
    
    /**
     * Get order amount values.
     * 
     * @return {object} Order amount values.
     */
    getAmount() {
        return this.amount;
    }
    
    /**
     * Get Moip service settings.
     * 
     * @return {object} Moip service settings.
     */
    getConfig() {
        return this.config;
    }

    /**
     * Create the order request.
     * 
     * @returns Request JSON object.
     */
    createRequest() {
        return JSON.stringify(this.order);
    }
}

exports.MoipOrder = MoipOrder;