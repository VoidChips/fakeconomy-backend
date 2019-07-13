const register = (pool, bcrypt) => (req, res) => {
    const { email, username, password } = req.body;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            // store user info in the users table then login info to the login table
            pool.query('WITH new_user AS (INSERT INTO users (email, username) VALUES ($1, $2) RETURNING id, username) INSERT INTO login (id, username, hash) VALUES ((SELECT id FROM new_user), (SELECT username FROM new_user), $3)', [email, username, hash], (err, results) => {
                // error if the user already exists
                if (err) { res.status(400).send({ 'result': 'user already exists' }); }
                res.send({ result: 'user registered' });
            });
        });
    });
}

module.exports = {
    register
};