const login = (pool, bcrypt) => (req, res) => {
    const { username, password } = req.body;
    pool.query('SELECT a.id, a.verified, b.hash FROM users a INNER JOIN login b ON a.username = b.username WHERE a.username = $1', [username], (err, results) => {
        if (err) {
            res.status(404).send({ 'error': 'unknown' });
        }

        // check if the user exists
        if ((results.rows).length) {
            let { id } = results.rows[0];
            const { verified, hash } = results.rows[0];
            // check if the password is correct and the user is verified
            if (bcrypt.compareSync(password, hash) && verified) {
                id = id.toString();
                res.send({ 'id': id });
            }
            // check if the password is correct and the user is unverified
            else if (bcrypt.compareSync(password, hash) && !verified) {
                res.status(404).send({ error: 'unverified' })
            }
            // login info is incorrect
            else {
                res.status(400).send({ error: 'incorrect info' });
            }
        }
        // user doesn't exist
        else {
            res.status(404).send({ 'error': 'not found' });
        }
    });
}

// const checkPassword = (bcrypt, password, hash) => {
//     bcrypt.compare(password, hash, function (err, res) {
//         return res;
//     });
// }

module.exports = {
    login
};