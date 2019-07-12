const buy = (pool) => (req, res) => {
    const { id, price } = req.body;
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
        if (err) { throw err; }
        const balance = results.rows[0].balance;
        const new_balance = balance - price;
        pool.query('UPDATE users SET balance = $1 WHERE id = $2', [new_balance, id], (err, results) => {
            if (err) { throw err; }
            res.send({ 'result': 'balance updated' });
        });
    });
}

module.exports = {
    buy
};