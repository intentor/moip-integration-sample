"use strict";

var https = require('https');

/**
 * Moip order.
 */
class MoipOrder {
    /**
     * Create a new order.
     * 
     * @param {string} config Moip service settings - { token, urlOrder, urlPayment }.
     */
    constructor(config) {
        this.id = null;
        this.config = config;
        this.order = {
            items: [],
            customer: {}
        };
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
     * Create the order.
     * 
     * @returns Promise object.
     */
    execute() {
        var scope = this;
        return new Promise((resolve, reject) => {
            let options = {
                host: scope.config.url,
                port: '443',
                path: '/v2/orders',
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + new Buffer(scope.config.token + ':' + scope.config.key).toString('base64'),
                    'Content-Type': 'application/json'
                }
            };
            console.log('order.execute.post', options);

            let request = https.request(options, function(response) {
                response.setEncoding('utf8');
                response.on('data', function(chunk) {
                    console.log('order.response', chunk);
                    resolve(chunk);
                });
            });

            request.write(scope.createRequest());
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
        return JSON.stringify({
            ownId: 'cooking_store-12345',
            items: this.order.items,
            customer: this.order.customer
        });
    }
}

exports.MoipOrder = MoipOrder;