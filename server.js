const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('../database-config/fakeconomy-config');
const nodemailer = require('nodemailer');
const email_config = require('../email_config');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const products = [
    {
        name: 'Instant Ramen Noodles',
        image: 'https://images-na.ssl-images-amazon.com/images/I/915AEp17FaL._SL1500_.jpg',
        price: 0.99
    },
    {
        name: 'Dell Desktop PC Combo',
        image: 'https://cdn11.bigcommerce.com/s-w5trgcbv/images/stencil/608x608/products/5945/49088/35049sku__97320.1545069629.jpg?c=2',
        price: 600
    },
    {
        name: 'Xbox One Controller',
        image: 'https://m.media-amazon.com/images/S/aplus-media/mg/e78341e6-37be-49a8-9044-f9389a0384de.jpg',
        price: 50
    },
    {
        name: 'Apples (1 lb)',
        image: 'https://images-prod.healthline.com/hlcmsresource/images/topic_centers/Do_Apples_Affect_Diabetes_and_Blood_Sugar_Levels-732x549-thumbnail.jpg',
        price: 1.5
    }
];

app.get('/users', (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
        if (err) { throw err; }
        let usernames = [];
        const users = results.rows;
        for (user of users) {
            usernames.push(user.username);
        }
        res.send(usernames);
    })
});

// send account info
app.get('/account/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT email, username, balance FROM users WHERE id = $1', [id], (err, results) => {
        if (err) { throw err; }
        const user_info = results.rows[0];
        res.send(user_info);
    });
});

app.get('/products', (req, res) => {
    res.send(products);
});

// update user's balance
app.post('/update_balance', (req, res) => {
    const { id, price } = req.body;
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
        if (err) { throw err; }
        const balance = results.rows[0].balance;
        const new_balance = balance - price;
        pool.query('UPDATE users SET balance = $1 WHERE id = $2', [new_balance, id], (err, results) => {
            if (err) { throw err; }
            res.send({ 'result': 'balance updated' });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    pool.query('SELECT * FROM users WHERE username = $1', [username], (err, results) => {
        if (err) {
            res.status(404).send({ 'error': 'unknown' });
        }
        const user = results.rows;
        if (user.length) {
            if (username === user[0].username && password === user[0].password) {
                const id = user[0].id.toString();
                res.send({ 'id': id });
            }
            else {
                res.status(404).send({ 'error': 'incorrect info' });
            }
        }
        else {
            res.status(404).send({ 'error': 'not found' });
        }

    });
});

app.post('/register', (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
        let isFound = false;
        const users = results.rows;
        const { email, username, password } = req.body;
        for (user of users) {
            if (user.email === email || user.username === username) {
                isFound = true;
                break; // don't need to continue the loop after user found
            }
        }
        if (!isFound) {
            let code = Math.floor(Math.random() * 999999) + 100000;
            pool.query('INSERT INTO users (email, username, password, verification_code) VALUES ($1, $2, $3, $4)', [email, username, password, code], (err, results) => {
                if (err) { throw err; }

                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: email_config.address,
                        pass: email_config.password
                    }
                });

                const mailOptions = {
                    from: `${email_config.name} <${email_config.address}>`,
                    to: email,
                    subject: 'Verify your account',
                    text: `${username}, Your verification code is ${code}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                pool.query('SELECT id FROM users WHERE username = $1', [username], (err, results) => {
                    res.send({ 'result': results.rows[0].id });
                });
            });
        }
        else {
            res.send({ 'result': 'user already exists' });
        }
    });
});

app.put('/verify', (req, res) => {
    const { id } = req.body;
    let { code } = req.body;
    code = Number(code);
    pool.query('SELECT verification_code FROM users WHERE id = $1', [id], (err, results) => {
        if (err) { throw err; }
        // verify user if code is valid
        if (code === results.rows[0].verification_code) {
            pool.query('UPDATE users SET verified = TRUE WHERE id = $1', [id], (err, results) => {
                if (err) { res.status(400).send(err); }
                res.send({ verified: 'true' });
            })
        }
        else {
            res.status(404).send({ verified: 'false' });
        }
    });
});

app.delete('/delete_user/:id', (req, res) => {
    const { id } = req.params;
    pool.query(`DELETE FROM users WHERE id = $1`, [id], (err, results) => {
        if (err) { throw err; }
        res.send({ status: 'deleted' });
    });
});

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});