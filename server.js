const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const users = [
    {
        email: 'void@gmail.com',
        username: 'void',
        password: '123'
    },
    {
        email: 'test@gmail.com',
        username: 'test',
        password: '1234'
    }
]

app.get('/users', (req, res) => {
    let usernames = [];
    for (user of users) {
        usernames.push(user.username);
    }
    res.send(usernames);
});

app.post('/login', (req, res) => {
    let isFound = false;
    for (user of users) {
        if (user.username === req.body.username && user.password === req.body.password) {
            isFound = true;
            break; // stop loop after user found
        }
    }
    if (isFound) {
        res.send({ 'result': 'found' });
    }
    else {
        res.status(400).send({ 'result': 'not found' });
    }
});

app.post('/register', (req, res) => {
    let isFound = false;
    const arr = Object.keys(req.body);
    if (arr[0] === 'email' && arr[1] === 'username' && arr[2] === 'password') {
        for (user of users) {
            if (user.email === req.body.email || user.username === req.body.username) {
                isFound = true;
                break; // don't need to continue the loop after user found
            }
        }
        if (!isFound) {
            res.send({ 'result': 'success' });
            users.push(req.body);
        }
        else {
            res.status(400).send({ 'result': 'user already exists' });
        }
    }
    else {
        res.status(400).send({ 'result': 'invalid' });
    }
});

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});
