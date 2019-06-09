const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

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

app.get('/users', (req, res) => { res.send(users); });

app.post('/register', (req, res) => {
    let isFound = false;
    for (user of users) {
        if (user.email === req.body.email) {
            isFound = true;
        }
    }
    if (isFound === true) {
        res.status(400).send('user already exists');
    }
    else {
        users.push(req.body);
        res.send(users);
    }
    
});

app.listen(3000, () => {
    console.log(`app is running on port 3000`);
});
