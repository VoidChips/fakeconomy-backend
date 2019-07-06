const getImage = (pool, root) => (req, res) => {
    const name = req.params.name;
    res.sendFile(`images/${name}`, { root: root });
}

module.exports = {
    getImage: getImage
};