const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
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
app.get('/users', users.getUsers(pool)
);

// send account info
app.get('/account/:id', account.getAccountInfo(pool));

app.get('/products/:sellerID/:type', products.getProducts(pool));

app.get('/image/:name', image.getImage(pool, root));

app.post('/add_image', upload.single('image'), add_image.addImage(fs, root));

app.post('/create_product', create_product.createProduct(pool));

app.delete('/delete_product', delete_product.deleteProduct(pool, fs, root));

// update buyer's balance
app.post('/buy', buy.buy(pool));

// update product inventory and seller's balance
app.put('/sell', sell.sell(pool));

app.post('/login', login.login(pool));

app.post('/register', register.register(pool));

app.put('/verify', verify.verifyUser(pool, nodemailer, email_config));

app.delete('/delete_user/:id', (req, res) => {
    const { id } = req.params;
    delete_user.deleteUser(req, res, id, pool);
});

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});