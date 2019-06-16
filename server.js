const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

const users = [
    {
        email: 'void@gmail.com',
        username: 'void',
        password: '123',
        balance: 1000
    },
    {
        email: 'test@gmail.com',
        username: 'test',
        password: '1234',
        balance: 100
    }
];

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
    let usernames = [];
    for (user of users) {
        usernames.push(user.username);
    }
    res.send(usernames);
});

app.get('/products', (req, res) => {
    res.send(products);
});

// send user's balance
app.post('/balance', (req, res) => {
    const username = req.body.username;
    let isFound = false;
    let i = 0;
    for (user of users) {
        if (user.username === username) {
            isFound = true;
            break;
        }
        i++;
    }
    // if user was found
    if (isFound) {
        const balance = users[i].balance.toString();
        res.send({ 'balance': balance });
    }
    else {
        res.status(404).send('user not found');
    }
});

// update user's balance
app.post('/update_balance', (req, res) => {
    const username = req.body.username;
    let isFound = false;
    let i = 0;
    for (user of users) {
        if (user.username === username) {
            isFound = true;
            break;
        }
        i++;
    }
    
    if (isFound) {
        let isUpdated = false;
        const new_balance = Number(req.body.new_balance);
        // find out if balance was updated
        if (new_balance != users[i].balance) {
            isUpdated = true;
        }
        if (isUpdated) {
            users[i].balance = new_balance;
            res.send('balance updated');
        }
        else {
            res.send('balance unchanged');
        }
    }
    else {
        res.status(404).send('user not found');
    }

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
    if (arr[0] === 'email' && arr[1] === 'username' && arr[2] === 'password' && arr[3] === 'balance') {
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
        res.status(400).send({ 'result': 'error' });
    }
});

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});
