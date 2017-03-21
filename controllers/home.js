/* Home controller. */
/** Home controller. */

var productsDao = require('../service/dao/products.js');

/**
 * home/index action.
 * 
 * @param object request Request parameters.
 * @param object response Response parameters.
 */
exports.index = function(request, response) {
    productsDao.findAll(function(rows) {
        response.render('home/index', { products: rows} );
    });
};