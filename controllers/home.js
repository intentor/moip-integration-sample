/* Home controller. */

var productsDao = require('../service/dao/products.js');

/**
 * Home page.
 * 
 * @param object request Request parameters.
 * @param object response Response parameters.
 */
exports.index = function(request, response) {
    productsDao.findAll(function(rows) {
        response.render('home/index', { products: rows} );
    });
};