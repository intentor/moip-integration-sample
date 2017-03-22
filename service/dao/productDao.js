/** Products Data Access Object. */

var db = require('../../lib/db.js');

/**
 * Find all available products.
 * 
 * @param {function} callback Callback function.
 */
exports.findAll = function(callback) {
    let sql = 'SELECT * FROM product';

    db.query(sql, function(rows) {
        callback(rows);
    });
};