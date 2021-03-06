/* Database helper. */

var pg = require('pg');

/**
 * Perform a database query.
 * <p>
 * To use it locally, the connection string shoud be exported: export DATABASE_URL=postgres://...?ssl=true
 * 
 * @param {string} sql SQL query to be executed.
 * @param {array} params Positional parameters.
 * @param {function} callback Callback function.
 */
exports.query = function(sql, params, callback) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) {
            console.error(err);
        } else {
            client.query(sql, params, function(err, result) {
                done();
                
                if (err) {
                    console.error(err);
                } else {
                    callback(result.rows);
                }
            });
        }
    });
};
