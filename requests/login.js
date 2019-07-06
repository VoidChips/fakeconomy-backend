const login = (pool) => (req, res) => {
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
}

module.exports = {
    login: login
};