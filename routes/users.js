var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/register', function (req, res) {
    res.render('register');
});

router.get('/login', function (req, res) {
    res.render('login');
});

// Handler for when a new user registers
router.post('/register', function (req, res) {
    // Extracting variables from form
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    //console.log('Name: ' + name + '\n' + 'Email: ' + email + '\n' + 'Username: ' + username + '\n' + 'Password: ' + password );
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password

        });
        User.createUser(newUser, function(err, user) {
            if (err) {
                throw err;
            } else {
                console.log(user);
            }
        });

        req.flash('success_msg', 'You are registerd and can now login');

        res.redirect('/users/login');
    }
});

module.exports = router;