const getImage = (pool, ABSOLUTE_PATH) => (req, res) => {
    const name = req.params.name;
    res.sendFile(`images/${name}`, { ABSOLUTE_PATH: ABSOLUTE_PATH });
}

module.exports = {
    getImage: getImage
};