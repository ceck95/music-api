var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var cors = require('cors');

// var request = require("request");

// var options = { method: 'GET',
//   url: 'http://j.ginggong.com/jOut.ashx',
//   qs: 
//    { code: '7868d0b1-da9a-494c-80cd-5fcde436b0f2',
//      k: 'n',
//      h: 'nhaccuatui.com' },
//   headers: 
//    { 'postman-token': 'fb95d91d-2d50-f9ca-4fcd-4ceb39f78284',
//      'cache-control': 'no-cache',
//      'content-type': 'multipart/form-data; boundary=---011000010111000001101001' } };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hjs');
// app.set ('view engine', 'html'); 
app.set('layout', 'layout');
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');

app.use(cors());
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//cors nodejs
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

app.listen(2525);
module.exports = app;
