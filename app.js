const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
    console.log('In First Middleware - This allways run!');
    next();
});

app.use('/add-product', (req, res, next) => {
    console.log('In Second Middleware!');
    res.send('<p>The Add product page</p>');
});

app.use('/', (req, res, next) => {
    console.log('In Third Middleware!');
    res.send('<p>Hello from Express.js</p>')
})

app.listen(3000);