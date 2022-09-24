require('dotenv').config();
const env = process.env;
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
const users = require('./requests/users');
const account = require('./requests/account');
const products = require('./requests/products');
const image = require('./requests/image');
const add_image = require('./requests/add_image');
const create_product = require('./requests/create_product');
const buy = require('./requests/buy');
const update_inventory = require('./requests/update_inventory');
const update_balance = require('./requests/update_balance');
const login = require('./requests/login');
const register = require('./requests/register');
const verify = require('./requests/verify');
const delete_user = require('./requests/delete_user');
const delete_product = require('./requests/delete_product');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: env.PG_USER,
    host: env.PG_HOST,
    database: env.PG_DATABASE,
    password: env.PG_PASSWORD,
    port: env.PG_PORT
});
const email_config = {
    name: env.EMAIL_NAME,
    address: env.EMAIL_ADDRESS,
    password: env.EMAIL_PASSWORD
}
const ABSOLUTE_PATH = env.ABSOLUTE_ABSOLUTE_PATH;
// ABSOLUTE_PATH is the absolute ABSOLUTE_PATH of the project directory

const app = express();
app.use(bodyParser.json());
app.use(cors());

// get verified users
app.get('/api/users', users.getUsers(pool)
);

// send account info
app.get('/api/account/:id', account.getAccountInfo(pool));

app.get('/api/products/:sellerID/:type', products.getProducts(pool));

app.get('/api/image/:name', image.getImage(pool, ABSOLUTE_PATH));

app.post('/api/add_image', upload.single('image'), add_image.addImage(fs, ABSOLUTE_PATH));

app.post('/api/create_product', create_product.createProduct(pool));

app.delete('/api/delete_product', delete_product.deleteProduct(pool, fs, ABSOLUTE_PATH));

// update buyer's balance
app.post('/api/buy', buy.buy(pool));

// update product's inventory
app.put('/api/update_inventory', update_inventory.updateInventory(pool));

// update user's balance
app.put('/api/update_balance', update_balance.updateBalance(pool));

app.post('/api/login', login.login(pool, bcrypt));

app.post('/api/register', register.register(pool, bcrypt));

app.put('/api/verify', verify.verifyUser(pool, nodemailer, email_config));

app.delete('/api/delete_user/:username', delete_user.deleteUser(pool, fs, ABSOLUTE_PATH));

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});