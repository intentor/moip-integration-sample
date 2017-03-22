/* App startup. */

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

// App settings.
app.set('port', (process.env.PORT || 8080));

// Express settings.
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Create controllers.
require('./lib/boot') (app, {});

// Default route.
app.get('/', function(request, response) {
    response.redirect("/home");
});

// Start the app.
app.listen(app.get('port'), function() {
    console.log('Mobi Integration Sample running on port', app.get('port'));
});