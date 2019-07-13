const register = (pool, bcrypt) => (req, res) => {
    const { email, username, password } = req.body;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            // Store hash in your password DB.
            pool.query('INSERT INTO users (email, username) VALUES ($1, $2)', [email, username], (err, results) => {
                // database checks if the user already exists.
                if (err) { res.send({ 'result': 'user already exists' }); }
                pool.query('INSERT INTO login (username, hash) VALUES ($1, $2)', [username, hash], (err, results) => {
                    if (err) throw err;
                    res.send({ result: 'user registered' });
                })
            });
        });
    });
}

module.exports = {
    register
};