const register = (pool) => (req, res) => {
    const { email, username, password } = req.body;
    pool.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3)', [email, username, password], (err, results) => {
        // database already checks if the user already exists.
        if (err) { res.send({ 'result': 'user already exists' }); }
        res.send({ result: 'user registered' });
    });
}

module.exports = {
    register: register
};