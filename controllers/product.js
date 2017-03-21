/* Product controller. */

var productsDao = require('../service/dao/products.js');

/**
 * List all products in JSON format.
 * 
 * @param object request Request parameters.
 * @param object response Response parameters.
 */
exports.list = function(request, response) {
    productsDao.findAll(function(rows) {
        let json = JSON.stringify(rows);
        response.end(json);
    });
};
