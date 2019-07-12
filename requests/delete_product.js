const deleteProduct = (pool, fs, root) => (req, res) => {
    const { product_name, image } = req.body;
    pool.query('DELETE FROM products WHERE name = $1', [product_name], (err, results) => {
        if (err) throw err;
        fs.unlink(`${root}/images/${image}`, err => {
            if (err) throw err;
            console.log(`${image} deleted`);
        });
        res.send({ deleted: 'true' });
    });
}

module.exports = {
    deleteProduct
}