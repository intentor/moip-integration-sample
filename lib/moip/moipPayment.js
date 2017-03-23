"use strict";

var https = require('https');

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
                port: '443',
                path: '/v2/orders/' + scope.order.getId() + '/payments',
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + new Buffer(scope.config.token + ':' + scope.config.key).toString('base64'),
                    'Content-Type': 'application/json'
                }
            };
            console.log('payment.execute.post', options);

            let request = https.request(options, function(response) {
                response.setEncoding('utf8');
                response.on('data', function(chunk) {
                    console.log('payment.response', chunk);
                    resolve(chunk);
                });
            });

            request.write(scope.createRequest());
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