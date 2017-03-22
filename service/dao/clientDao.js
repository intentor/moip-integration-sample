/** Clients Data Access Object. */

var db = require('../../lib/db.js');

/**
 * Find a client
 * 
 * @param {string} email User email.
 * @param {function} callback Callback function.
 */
exports.findByEmail = function(email, callback) {
    let sql = 'SELECT * FROM client WHERE email = \'' + email + '\'';

    db.query(sql, function(rows) {
        callback(rows);
    });
};