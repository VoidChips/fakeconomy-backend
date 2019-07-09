const createProduct = (pool) => (req, res) => {
    const { id, name, desc, price, inventory } = req.body;
    let {image} = req.body;
    pool.query('SELECT username FROM users WHERE id = $1', [id], (err, results) => {
        if (err) { throw err; }
        const username = results.rows[0].username;
        pool.query('INSERT INTO products (name, image, price, seller, description, inventory) VALUES ($1, $2, $3, $4, $5, $6)', [name, image, price, username, desc, inventory], (err, results) => {
            if (err) { res.send({ result: 'product already exists' }); }
            res.send({ result: 'product created' });
        });
    });
}

module.exports = {
    createProduct: createProduct
};