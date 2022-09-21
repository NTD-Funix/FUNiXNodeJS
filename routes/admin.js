const express = require("express");
const { check, body } = require('express-validator');

const adminController = require("../controllers/admin");
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
// Phân tích cú pháp từ trái qua phải, có thể thêm bao nhiêu đối số tùy ý.
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post("/add-product",
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({ min: 5, max: 200 })
            .trim(),
    ], isAuth, adminController.postAddProduct);

router.get("/edit-product/:productID", isAuth, adminController.getEditProduct);

router.post("/edit-product",
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('imageUrl')
            .isURL(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({ min: 5, max: 200 })
            .trim(),
    ], isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
