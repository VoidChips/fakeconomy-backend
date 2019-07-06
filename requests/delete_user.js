const deleteUser = (req, res, id, pool) => {
    pool.query(`DELETE FROM users WHERE id = $1`, [id], (err, results) => {
        if (err) { throw err; }
        res.send({ status: 'deleted' });
    });
}

module.exports = {
    deleteUser: deleteUser
};