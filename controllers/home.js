/* Home controller. */

var productDao = require('../service/dao/product.js');

/**
 * Home page.
 * 
 * @param object request Request parameters.
 * @param object response Response parameters.
 */
exports.index = function(request, response) {
    productDao.findAll(function(rows) {
        response.render('home/index', { products: rows} );
    });
};
