const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
// const path = require('path');

const pool = require('../database-config/fakeconomy-config');
const email_config = require('../email_config');
const root = require('./root');
// root is the absolute path of the project directory

const app = express();
app.use(bodyParser.json());
app.use(cors());

// get verified users
app.get('/users', (req, res) => {
    pool.query('SELECT * FROM users WHERE verified = $1 ORDER BY id ASC', [true], (err, results) => {
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
    pool.query('SELECT * FROM products', (err, results) => {
        if (err) { throw err; }
        const products = results.rows;
        res.send(products);
    })
});

app.get('/image/:name', (req, res) => {
    const name = req.params.name;
    res.sendFile(`images/${name}`, { root: root });
})

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
        // check if there are any user with the username
        if (user.length) {
            // check if the login info is correct and the user if verified
            if (username === user[0].username && password === user[0].password && user[0].verified === true) {
                const id = user[0].id.toString();
                res.send({ 'id': id });
            }
            // check if the login info is correct and the user is unverified
            else if (username === user[0].username && password === user[0].password && user[0].verified === false) {
                res.status(404).send({ 'error': 'unverified' })
            }
            // login info is incorrect
            else {
                res.status(404).send({ 'error': 'incorrect info' });
            }
        }
        else {
            res.status(404).send({ 'error': 'not found' });
        }

    });
});

const generateVerificationCode = () => {
    return Math.floor(Math.random() * 999999) + 100000;
}

const sendVerificationMail = (email, username, code) => {
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
}

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
            pool.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3)', [email, username, password], (err, results) => {
                if (err) { throw err; }
                res.send({ result: 'user registered' });
            });
        }
        else {
            res.send({ 'result': 'user already exists' });
        }
    });
});

app.put('/verify', (req, res) => {
    const { username } = req.body;
    let { code } = req.body;
    pool.query('SELECT email, verification_code FROM users WHERE username = $1', [username], (err, results) => {
        if (err) { throw err; }
        if (code === 'reset') {
            const email = results.rows[0].email;
            const new_code = generateVerificationCode();
            pool.query('UPDATE users SET verification_code = $1 WHERE username = $2', [new_code, username], (err, results) => {
                if (err) { throw err; }
                sendVerificationMail(email, username, new_code);
                res.send({ result: 'new code' });

            });
        }
        else {
            // code variable is a string, so it needs to be converted to a number;
            code = Number(code);
            // verify user if code is valid
            if (code === results.rows[0].verification_code) {
                pool.query('UPDATE users SET verified = TRUE WHERE username = $1', [username], (err, results) => {
                    if (err) { res.status(400).send(err); }
                    res.send({ verified: 'true' });
                })
            }
            else {
                res.status(404).send({ verified: 'false' });
            }
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