const updateInventory = pool => (req, res) => {
    const { name } = req.body;
    pool.query('UPDATE products SET inventory = inventory - $1 WHERE name = $2', [1, name], (err, results) => {
        if (err) {
            res.status(404).send({ product: 'does not exist' });
        }
        res.send({ inventory: 'updated' });
    });
}

module.exports = {
    updateInventory
}