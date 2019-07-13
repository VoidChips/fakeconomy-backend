const deleteUser = pool => (req, res) => {
    let { id } = req.params;
    pool.query(`DELETE FROM users WHERE id = $1`, [Number(id)], (err, results) => {
        if (err) { throw err; }
        res.send({ status: 'deleted' });
    });
}

module.exports = {
    deleteUser
};