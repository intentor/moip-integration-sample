/* Handles controller setup. */

var express = require('express');
var fs = require('fs');
var path = require('path');

module.exports = function(app, options) {
    let dir = path.join(__dirname, '..', 'controllers');

    fs.readdirSync(dir).forEach(function(name) {
        var file = path.join(dir, name);
        if (fs.statSync(file).isDirectory()) {
            return;
        }

        var obj = require(file);
        var method;
        var url;
        
        // Each controller has its actions mapped to routes using a convention based naming.
        // The name of method on each exports of the controller is used as routes names for the controller 
        // (except for index, which routes to the controller's name without an action).
        for (var key in obj) {
            console.log(key);
            switch (key) {
                case 'index':
                    method = 'get';
                    url = '/' + name.replace('.js', '');
                    break;
            }
            
            console.log(method + ':' + url);
            app[method](url, obj[key]);
        }
    });
};
