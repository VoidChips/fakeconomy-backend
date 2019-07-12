const getUsers = (pool) => (req, res) => {
    pool.query('SELECT * FROM users WHERE verified = $1 ORDER BY id ASC', [true], (err, results) => {
        if (err) { throw err; }
        let usernames = [];
        const users = results.rows;
        for (user of users) {
            usernames.push(user.username);
        }
        res.send(usernames);
    });
}

module.exports = {
    getUsers
};