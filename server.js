const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        console.log(`File type is: ${file.mimetype}`);
        if ((file.mimetype).search('image/' !== -1)) {
            cb(null, file.originalname);
            console.log(`${file.originalname} added in images directory`);
        }
    }
})
const upload = multer({ storage: storage });
// const path = require('path');

const pool = require('../database-config/fakeconomy-config');
const email_config = require('../email_config');
const root = require('./root');
// root is the absolute path of the project directory

const users = require('./requests/users');
const account = require('./requests/account');
const products = require('./requests/products');
const image = require('./requests/image');
const add_image = require('./requests/add_image');
const create_product = require('./requests/create_product');
const buy = require('./requests/buy');
const sell = require('./requests/sell');
const login = require('./requests/login');
const register = require('./requests/register');
const verify = require('./requests/verify');
const delete_user = require('./requests/delete_user');
const delete_product = require('./requests/delete_product');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// get verified users
app.get('/api/users', users.getUsers(pool)
);

// send account info
app.get('/api/account/:id', account.getAccountInfo(pool));

app.get('/api/products/:sellerID/:type', products.getProducts(pool));

app.get('/api/image/:name', image.getImage(pool, root));

app.post('/api/add_image', upload.single('image'), add_image.addImage(fs, root));

app.post('/api/create_product', create_product.createProduct(pool));

app.delete('/api/delete_product', delete_product.deleteProduct(pool, fs, root));

// update buyer's balance
app.post('/api/buy', buy.buy(pool));

// update product inventory and seller's balance
app.put('/api/sell', sell.sell(pool));

app.post('/api/login', login.login(pool, bcrypt));

app.post('/api/register', register.register(pool, bcrypt));

app.put('/api/verify', verify.verifyUser(pool, nodemailer, email_config));

app.delete('/api/delete_user/:username', delete_user.deleteUser(pool, fs, root));

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});