const fs = require('fs');
const path = require('path');

// const p = path.join(require.main.filename, 'data', 'cart.json');

const rootDir = require('../util/path');
const p = path.join(rootDir, 'data', 'cart.json'); 

module.exports = class Cart {
    static addProduct (id, productPrice) {
        // Fetch the previous cart.
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if(!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => Find existing product.
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updateProduct;
            // Add new product/ increase quantity.
            if (existingProduct) {
                updateProduct = { ...existingProduct };
                updateProduct.qty = existingProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updateProduct;
            } else {
                updateProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updateProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        });
    };

    static deleteProduct (id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const card = JSON.parse(fileContent);
            const updatedCart = {...card};
            const product = updatedCart.products.find(product => product.id === id);
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(product => product.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    };

    static getCart (callback) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if(err) {
                callback(null)
            } else {
                callback(cart);
            }
        });
    }

};