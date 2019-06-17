const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('../database-config/fakeconomy-config');

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
    pool.query('select * from users order by id asc', (err, results) => {
        if (err) {
            throw err;
        }
        let usernames = [];
        const users = results.rows;
        for (user of users) {
            usernames.push(user.username);
        }
        res.send(usernames);
    })
});

app.get('/products', (req, res) => {
    res.send(products);
});

// send user's balance
app.get('/balance/:id', (req, res) => {
    const id = req.params.id;
    pool.query('select * from users where id = $1', [id], (err, results) => {
        if (err) {
            throw err;
        }
        const balance = results.rows[0].balance;
        res.send({ 'balance': balance });
    })
});

// update user's balance
app.post('/update_balance', (req, res) => {
    const { id, price } = req.body;
    pool.query('select * from users where id = $1', [id], (err, results) => {
        if (err) { throw err; }
        const balance = results.rows[0].balance;
        const new_balance = balance - price;
        pool.query('update users set balance = $1 where id = $2', [new_balance, id], (err, results) => {
            if (err) { throw err; }
            res.send({'result': 'balance updated'});
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    pool.query('select * from users where username = $1', [username], (err, results) => {
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
    pool.query('select * from users order by id asc', (err, results) => {
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
            const balance = 2000;
            pool.query('insert into users (email, username, password, balance) values ($1, $2, $3, $4)', [email, username, password, balance], (err, results) => {
                if (err) { return err; }
                res.send({ 'result': 'new user added' });
            });
        }
        else {
            res.send({ 'result': 'user already exists' });
        }
    });
});

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});
