"use strict";

var https = require('https');
var moipHelper = require('./moipHelper.js');

/**
 * Moip payment.
 * <p>
 * Work only with credit cards.
 */
class MoipPayment {
    /**
     * Create a new order.
     * 
     * @param {MoipOrder} order Order created.
     */
    constructor(order) {
        this.order = order;
        this.config = this.order.getConfig();
        this.creditCard = {};
    }

    /**
     * Set the credit card.
     * 
     * @param {object} creditCard Credit card details - { expirationMonth, expirationYear, number, cvc }.
     * @returns This object, for chaining.
     */
    setCreditCard(creditCard) {
        creditCard.holder = {};
        this.installments = 1;
        this.creditCard = creditCard;
        return this;
    }

    /**
     * Set total installments.
     * 
     * @param {int} installments Total installments.
     * @returns This object, for chaining.
     */
    setInstallments(installments) {
        this.installments = installments
        return this;
    }

    /**
     * Set the credit card holder.
     * 
     * @param {object} holder Holder details - { fullname, birthdate }. 
     * @returns This object, for chaining.
     */
    setHolder(holder) {
        this.creditCard.holder = holder;
        return this;
    }

    /**
     * Set the credit card holder document (always CPF).
     * 
     * @param {string} number Document number.
     * @returns This object, for chaining.
     */
    setDocument(number) {
        this.creditCard.holder.taxDocument = {
            type: 'CPF',
            document: number
        };
        return this;
    }

    /**
     * Set customer phone.
     * 
     * @param {object} phone Phone details - { countryCode, areaCode, number }. 
     * @returns This object, for chaining.
     */
    setPhone(phone) {
        this.creditCard.holder.phone = phone;
        return this;
    }

    /**
     * Perform the payment.
     * 
     * @returns Promise object.
     */
    execute() {
        var scope = this;
        return new Promise((resolve, reject) => {
            let options = {
                host: scope.config.url,
                path: '/v2/orders/' + scope.order.getId() + '/payments',
                method: 'POST',
                headers: {
                    'Authorization': moipHelper.createAuth(scope.config.token, scope.config.key),
                    'Content-Type': 'application/json'
                }
            };

            let requestData = scope.createRequest();
            console.log('payment.execute.post', options, requestData);

            let request = https.request(options, function(response) {
                let body = '';

                response.setEncoding('utf8');
                response.on('data', function(chunk) {
                    body += chunk;
                });
                response.on('end', function() {
                    let responseData = JSON.parse(body);
                    console.log('payment.response', responseData);

                    if (!responseData.errors  && !responseData.ERROR) {
                        

                        resolve(responseData);
                    } else if (responseData.ERROR) {
                        reject(responseData.ERROR);
                    } else {
                        reject('Error during payment. Please try again.');
                    }
                });
            });

            request.write(requestData);
            request.end();
        });
    }
    
    /**
     * Create the payment request.
     * 
     * @returns Request JSON object.
     */
    createRequest() {
        return JSON.stringify({
            installmentCount: this.installments,
            fundingInstrument: {
                method: 'CREDIT_CARD',
                creditCard: this.creditCard
            }
        });
    }
}

exports.MoipPayment = MoipPayment;