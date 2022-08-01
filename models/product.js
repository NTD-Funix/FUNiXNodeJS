const fs = require('fs');
const p = require('path');

const rootDir = require('../util/path');

module.exports = class Product {
    constructor(t, i, p ,d) {
        this.title = t;
        this.image = i;
        this.price = p;
        this.description = d;
    };

    save() {
        const path = p.join(rootDir, 'data', 'products.json');
        fs.readFile(path, (err, fileContent) => {
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(path, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    };

    static fetchAll() {
        const path = p.join(rootDir, 'data', 'products.json');
        fs.readFile(path, (err, fileContent) => {
            if(err) {
                return [];
            }
            return JSON.parse(fileContent);
        });
    };
};
