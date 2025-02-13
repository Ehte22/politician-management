const multer = require("multer")
const path = require("path")
const { v4 } = require("uuid")

const multerMiddleware = (fileTypes = [], fileSize = 10) => {
    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, v4() + path.extname(file.originalname))
        }
    });

    const fileFilter = (req, file, cb) => {
        if (fileTypes.length > 0 && !fileTypes.includes(file.mimetype)) {
            return cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
        }
        cb(null, true);
    };

    const maxFileSize = fileSize * 1024 * 1024

    return multer({
        storage,
        limits: { fileSize: maxFileSize },
        fileFilter,
    });
};

module.exports = multerMiddleware;
