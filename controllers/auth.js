const bcrypt = require('bcryptjs');

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
            req.session.save((err) => {         // Do cần mất 1 thời gian để lưu dữ liệu session vào 
                console.log(err);               // database nên chuyển hướng luôn sẽ có hiện tượng bị lag. 
                res.redirect('/');              // Vì vậy để k xảy ra hiện tượng trên ta cần đảm bảo 
            });                                 // dữ liệu đã lưu xong vào database thì mới chuyển hướng.
        })
        .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    })
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] },
                    })
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
                });
        })
        .catch((err) => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
};