const products = [];

module.exports = class Product {
    constructor(t, i, p ,d) {
        this.title = t;
        this.image = i;
        this.price = p;
        this.description = d;
    };

    save() {
        products.push(this);
    };

    static fetchAll() {
        return products;
    };
};
