/* Product controller. */

var productDao = require('../service/dao/productDao.js');

/**
 * List all products in JSON format.
 * 
 * @param {object} request Request parameters.
 * @param {object} response Response parameters.
 */
exports.list = function(request, response) {
    productDao.findAll(function(rows) {
        let json = JSON.stringify(rows);
        response.contentType('application/json');
        response.end(json);
    });
};
