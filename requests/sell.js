const sell = pool => (req, res) => {
    const { price, name, seller } = req.body;
    // update inventory
    pool.query('UPDATE products SET inventory = inventory - $1 WHERE name = $2', [1, name], (err, results) => {
        if (err) {
            res.status(404).send({ product: 'does not exist' });
        }
        // update seller balance
        pool.query('UPDATE users SET balance = balance + $1 WHERE username = $2', [price, seller], (err, results) => {
            if (err) throw err;
            res.send({ balance: 'updated' });
        });
    });
}

module.exports = {
    sell
}