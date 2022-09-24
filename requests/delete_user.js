const deleteUser = (pool, fs, ABSOLUTE_PATH) => (req, res) => {
    let { username } = req.params;
    pool.query('SELECT image FROM products WHERE seller = $1', [username], (err, results) => {
        if (err) throw err;
        const images = results.rows;
        // delete all images of products of the user
        for (image of images) {
            console.log(`Deleting ${image.image}...`);
            fs.unlink(`${ABSOLUTE_PATH}/images/${image.image}`, err => {
                if (err) throw err;
            });
        }
        // delete the user
        pool.query('DELETE FROM users WHERE username = $1', [username], (err, results) => {
            if (err) { throw err; }
            console.log(`User ${username} deleted`);
            res.send({ status: 'deleted' });
        });
    });
}

module.exports = {
    deleteUser
};