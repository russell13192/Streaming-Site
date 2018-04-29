const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var expressHbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
const publicPath = path.join(__dirname, '../public');
mongoose.connect('mongodb://localhost/murvie');
const db = mongoose.connection;
var app = express();

var routes = require('../routes/index');
var users = require('../routes/users');


app.set('view engine', 'hbs');
app.engine('hbs', expressHbs({ extname: 'hbs', defaultLayout: 'layout.hbs' }));
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


// app.get('/', (req, res) => {
//    res.render('login.hbs'); 
// });
app.use('/', routes);
app.use('/users', users);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});