const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').trim().split('=')[1] === 'true';
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        isAuthenticated: false,
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("62f4d3621cc36d9425adaf02")
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            res.redirect('/');
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
}