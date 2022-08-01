const fs = require('fs');
const p = require('path');

const rootDir = require('../util/path');

const path = p.join(rootDir, 'data', 'products.json');

const getProductsFromFile = callback => { 
    fs.readFile(path, (err, fileContent) => {
        if(err) {
            callback([]);
        }
        callback(JSON.parse(fileContent));
    });
};
module.exports = class Product {
    constructor(t, i, p ,d) {
        this.title = t;
        this.image = i;
        this.price = p;
        this.description = d;
    };

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(path, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
        // fs.readFile(path, (err, fileContent) => {
        //     let products = [];
        //     if (!err) {
        //         products = JSON.parse(fileContent);
        //     }
        //     products.push(this);
        //     fs.writeFile(path, JSON.stringify(products), (err) => {
        //         console.log(err);
        //     });
        // });
    };

    static fetchAll(callback) {
        getProductsFromFile(callback);
    };
};
