const addImage = (fs, ABSOLUTE_PATH) => (req, res) => {
    if (!req.file) {
        res.send({ upload: 'file not found' });
    }
    else {
        res.send({ upload: 'successful' })
    }
}

module.exports = {
    addImage: addImage
};