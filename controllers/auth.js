const crypto = require('crypto'); // Thư viện tạo các giá trị ngẫu nhiên.

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: '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'
        }
    })
);

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: message,
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: errors.array()[0].msg,
        });
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)          // Promise boolean (true or false).
                .then(doMatch => {                           // doMatch = true or false.
                    if (doMatch) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save((err) => {   // Do cần mất 1 thời gian để lưu dữ liệu session vào 
                            console.log(err);                // database nên chuyển hướng luôn sẽ có hiện tượng bị lag. 
                            res.redirect('/');               // Vì vậy để k xảy ra hiện tượng trên ta cần đảm bảo 
                        });                                  // dữ liệu đã lưu xong vào database thì mới chuyển hướng.
                    };
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
                .catch((err) => {
                    res.redirect('/login');
                    console.log(err);
                })
        })
        .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationErrors: [],
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    console.log(errors.array())

    if (!errors.isEmpty()) {
        return res.status(422).render(
            res.render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                },
                validationErrors: errors.array(),
            }));
    };
    bcrypt.hash(password, 12)
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
            return transporter.sendMail({
                from: 'ntd.mta93@gmail.com',
                to: email,
                subject: 'Sign up succeeded !',
                html: '<h1>You successfully signed up !</h1>'
            });
        })
        .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message,
    })
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex');
        const email = req.body.email;
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset')
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                transporter.sendMail({
                    from: 'ntd.mta93@gmail.com',
                    to: email,
                    subject: 'Password Reset',
                    html: `
                        <p>Your requested a password reset.</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password.</p>
                    `
                });
            })
            .catch((err) => console.log(err))
    })
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token,
            })
        })
        .catch((err) => console.log(err))
};

exports.postNewPassword = (req, res, next) => {
    const userId = req.body.userId;
    const newPassword = req.body.newPassword;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() }
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(() => {
            return res.redirect('/login');
        })
        .catch((err) => console.log(err))
}