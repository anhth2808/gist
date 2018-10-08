var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('Express4');
var request = require("request");

var apiOptions = {
    server: "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://getting-mean-loc8r.herokuapp.com";
}


require('./app_api/models/db');

var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/index');
// var users = require('./app_server/routes/users');

var app = express();
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', routesApi);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



var io = require("socket.io")(server);
// app.set("socketio", io);

var _isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var _formatDistance = function (distance) {
    var numDistance, unit;
    if (distance && _isNumeric(distance)) {
        if (distance > 1) {
            numDistance = parseFloat(distance).toFixed(1);
            unit = 'km';
        } else {
            numDistance = parseInt(distance * 1000, 10);
            unit = 'm';
        }
        return numDistance + unit;
    } else {
        return "?";
    }
};
io.on("connection", function (socket) {
    console.log("Made socket connection", socket.id);
    socket.on("send:coords", function (dt) {
        console.log("dt:", dt);
        path = '/api/locations';
        requestOptions = {
            url: apiOptions.server + path,
            method: "GET",
            json: {},
            qs: {
                lng: dt.coords.lng,
                lat: dt.coords.lat,
                maxDistance: 1000
            }
        };
        request(
            requestOptions,
            function (err, response, body) {
                var i, data;
                data = body;
                if (response.statusCode === 200 && data.length) {
                    for (i = 0; i < data.length; i++) {
                        data[i].distance = _formatDistance(data[i].distance);
                    }
                }
                // render
                socket.emit("load:coords", data);
            }
        );
    });
});

