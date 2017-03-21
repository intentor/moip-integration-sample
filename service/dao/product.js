/** Products Data Access Object. */

var db = require('../../lib/db.js');

/**
 * Find all available products.
 */
exports.findAll = function(callback) {
    let sql = 'SELECT * FROM products';

    db.query(sql, function(rows) {
        callback(rows);
    });
};