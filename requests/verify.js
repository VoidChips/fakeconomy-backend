const verifyUser = (pool, controllers) => (req, res) => {
    const { username } = req.body;
    let { code } = req.body;
    pool.query('SELECT email, verification_code FROM users WHERE username = $1', [username], (err, results) => {
        if (err) throw err;
        if (code === 'reset') {
            const email = results.rows[0].email;
            const new_code = generateVerificationCode();
            pool.query('UPDATE users SET verification_code = $1 WHERE username = $2', [new_code, username], (err, results) => {
                if (err) throw err;
                controllers.sendMail(email, new_code);
                res.send({ result: 'new code' });
            });
        }
        else {
            // convert code to a number
            code = Number(code);
            // verify user if code is valid
            if (code === results.rows[0].verification_code) {
                pool.query('UPDATE users SET verified = TRUE WHERE username = $1', [username], (err, results) => {
                    if (err) { res.status(400).send(err); }
                    res.send({ verified: 'true' });
                })
            }
            else {
                res.status(404).send({ verified: 'false' });
            }
        }
    });
}

const generateVerificationCode = () => {
    return Math.floor(Math.random() * 999999) + 100000;
}

module.exports = {
    verifyUser
};