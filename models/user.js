const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;
class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;   // cart: {items: [{product1}, {product2}...]}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db
            .collection('users')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            })
    };

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updateCartItems = [...this.cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updateCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updateCartItems.push({ productId: product._id, quantity: newQuantity })
        }
        const updateCart = { items: updateCartItems };
        const db = getDb();
        return db
            .collection('users')
            .updateOne({ _id: this._id }, { $set: { cart: updateCart } });
    };

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(item => item.productId);
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(product => {
                    return {
                        ...product,
                        quantity: this.cart.items.find(item => {
                            return item.productId.toString() === product._id.toString();
                        }).quantity
                    };
                });
            })
            .catch(err => console.log(err));
    };

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => console.log(err))
    }
}
module.exports = User;
