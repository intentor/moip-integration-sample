/* Client controller. */

var clientDao = require('../service/dao/clientDao.js');

/**
 * Get client data.
 * 
 * @param {object} request Request parameters.
 * @param {object} response Response parameters.
 */
exports.get = function(request, response) {
    clientDao.findByEmail(request.body.email, function(rows) {
        let json = JSON.stringify(rows);
        response.contentType('application/json');
        response.end(json);
    });
};
