/* Order controller. */

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
        response.end('{ "orderId": 666, "sent": ' + request.body.orderId + ', "status": 1 "message": "" }');
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

    response.contentType('application/json');
    response.end('{ "orderId": 666 }');
};
