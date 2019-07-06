const getAccountInfo = (pool) => (req, res) => {
    const { id } = req.params;
    pool.query('SELECT email, username, balance FROM users WHERE id = $1', [id], (err, results) => {
        if (err) { throw err; }
        const user_info = results.rows[0];
        res.send(user_info);
    });
}

module.exports = {
    getAccountInfo: getAccountInfo
};