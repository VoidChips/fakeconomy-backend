const register = (pool) => (req, res) => {
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
}

module.exports = {
    register: register
};