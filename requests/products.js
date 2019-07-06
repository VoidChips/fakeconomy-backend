const getProducts = (pool) => (req, res) => {
    pool.query('SELECT * FROM products', (err, results) => {
        if (err) { throw err; }
        const products = results.rows;
        res.send(products);
    });
}

module.exports = {
    getProducts: getProducts
};