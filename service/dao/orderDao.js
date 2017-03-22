/** Orders Data Access Object. */

var db = require('../../lib/db.js');

/**
 * Create an order.
 * 
 * @param {object} order Order data.
 * @param {function} callback Callback function.
 */
exports.create = function(order, callback) {
    console.log('create', order);

    var sql = 'INSERT INTO "order" (code, client_id, installments, extras, total, discount_code) ' +
        'VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';

    db.query(sql, [ 
        new Date().toISOString() + '-' + order.clientId,
        order.clientId,
        order.installments,
        order.extras,
        order.total,
        order.discountCode,
    ], function(rows) {
        var orderId = rows[0].id;
        
        // To simplify the sample, product relations (table order_product) won't be saved.

        callback(orderId);
    });
};