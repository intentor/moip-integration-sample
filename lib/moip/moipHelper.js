"use strict";

/**
 * Parse a value to a format valid to the API.
 * 
 * @param {mixed} value Value to be parsed.
 */
exports.toApiNumber = function(value) {
    return parseFloat(value).toFixed(2).replace(/[,\.]/g, '')
};

/**
 * Parse a value to number from the API.
 * 
 * @param {mixed} value Value to be parsed.
 */
exports.fromApiNumber = function(value) {
    let valueAsString = value.toString();
    let length = valueAsString.length;
    return valueAsString.substring(0, length - 2) + '.' + valueAsString.substring(length - 2);
};

/**
 * Create basic authorization header value from Moip configurations.
 * 
 * @param {string} token Moip account token.
 * @param {string} key Moip account key.
 */
exports.createAuth = function(token, key) {
    // The auth code below is used for testing.
    // return 'Basic MDEwMTAxMDEwMTAxMDEwMTAxMDEwMTAxMDEwMTAxMDE6QUJBQkFCQUJBQkFCQUJBQkFCQUJBQkFCQUJBQkFCQUJBQkFCQUJBQg==';
    return 'Basic ' + new Buffer(token + ':' + key).toString('base64');
};