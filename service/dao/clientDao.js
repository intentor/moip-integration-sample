/** Clients Data Access Object. */

var db = require('../../lib/db.js');

/**
 * Create or update an user.
 * 
 * @param {object} user User data.
 * @param {function} callback Callback function.
 */
exports.createOrUpdate = function(user, callback) {
    console.log('createOrUpdate.user', user);

    exports.findByEmail(user.email, function(rows) {
    console.log('createOrUpdate.found', rows);
        
        if (rows.length > 0) {
            // Update.
            var userId = rows[0].id;
            var sql = 'UPDATE client ' +
                'SET fullname=$1, document=$2, birth_date=$3, phone=$4 ' +
                'WHERE id = $5';

            db.query(sql, [ 
                user.fullname,
                user.document,
                user.birthDate,
                user.phone,
                userId
            ], function(rows) {
                callback(userId);
            });
        } else {
            // Create.
            var sql = 'INSERT INTO client (email, fullname, document, birth_date, phone) ' +
                'VALUES ($1, $2, $3, $4, $5) RETURNING id';

            db.query(sql, [ 
                user.email,
                user.fullname,
                user.document,
                user.birthDate,
                user.phone
            ], function(rows) {
                callback(rows[0].id);
            });
        }
    });
}

/**
 * Find a client
 * 
 * @param {string} email User email.
 * @param {function} callback Callback function.
 */
exports.findByEmail = function(email, callback) {
    let sql = 'SELECT * FROM client WHERE email = $1';

    db.query(sql, [ email ], function(rows) {
        callback(rows);
    });
};