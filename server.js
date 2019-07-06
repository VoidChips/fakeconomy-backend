const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
// const path = require('path');

const pool = require('../database-config/fakeconomy-config');
const email_config = require('../email_config');
const root = require('./root');
// root is the absolute path of the project directory

const users = require('./requests/users');
const account = require('./requests/account');
const products = require('./requests/products');
const image = require('./requests/image');
const update_balance = require('./requests/update_balance');
const login = require('./requests/login');
const register = require('./requests/register');
const verify = require('./requests/verify');
const delete_user = require('./requests/delete_user');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// get verified users
app.get('/users', users.getUsers(pool)
);

// send account info
app.get('/account/:id', account.getAccountInfo(pool));

app.get('/products', products.getProducts(pool));

app.get('/image/:name', image.getImage(pool, root));

// update user's balance
app.post('/update_balance', update_balance.updateBalance(pool));

app.post('/login', login.login(pool));

app.post('/register', register.register(pool, nodemailer));

app.put('/verify', verify.verifyUser(pool, nodemailer, email_config));

app.delete('/delete_user/:id', (req, res) => {
    const { id } = req.params;
    delete_user.deleteUser(req, res, id, pool);
});

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});