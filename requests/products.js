const getProducts = (pool) => (req, res) => {
    const { sellerID, type } = req.params;
    // send all products if seller is 0 and type is set to all
    if (Number(sellerID) === 0) {
        if (type === 'all') {
            pool.query('SELECT * FROM products', (err, results) => {
                if (err) { throw err; }
                const products = results.rows;
                res.send(products);
            });
        }
    }
    else {
        if (type === 'all') {
            // get username with that id
            pool.query('SELECT username FROM users WHERE id = $1', [sellerID], (err, results) => {
                if (err) {
                    res.status(404).send({ result: 'seller not found' });
                }
                const username = results.rows[0].username;
                // get products with that seller name
                pool.query('SELECT * FROM products WHERE seller = $1', [username], (err, results) => {
                    if (err) throw err;
                    const products = results.rows;
                    res.send(products);
                });
            })
        }
    }
}

module.exports = {
    getProducts: getProducts
};