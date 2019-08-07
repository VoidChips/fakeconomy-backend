const updateBalance = pool => (req, res) => {
    const { username, amount } = req.body;
    pool.query('UPDATE users SET balance = balance + $1 WHERE username = $2', [amount, username], (err, results) => {
        if (err) throw err;
        res.send({ balance: 'updated' });
    });
}

module.exports = {
    updateBalance
}