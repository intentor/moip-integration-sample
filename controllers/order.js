/* Order controller. */

/**
 * Get an order.
 * 
 * @param {object} request Request parameters.
 * @param {object} response Response parameters.
 */
exports.get = function(request, response) {
    response.contentType('application/json');
    response.end('{ "orderId": 666, "status": 1 }');
};

/**
 * Place an order.
 * 
 * @param {object} request Request parameters.
 * @param {object} response Response parameters.
 */
exports.put = function(request, response) {
    response.contentType('application/json');
    response.end('{ "orderId": 666 }');
};
