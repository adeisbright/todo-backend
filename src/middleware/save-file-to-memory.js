const Multer = require("multer");

module.exports = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 200 * 1024 * 1024,
    },
});
