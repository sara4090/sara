const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (
             file.mimetype === 'images/png'
            || file.mimetype === 'images/Jpg') {
            cb(null, path.join(__dirname, '../public/documents'));
        }
        else {
            cb(null, path.join(__dirname, '../public/images'));
        }
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "images") {
        ( file.mimetype === "images/jpg"
            || file.mimetype === "images/png")
            ? cb(null, true)
            : cb(null, false);
    }
    else if (file.fieldname === "documents") {
        (file.mimetype === 'application/msword'
            || file.mimetype === 'application/pdf')
            ? cb(null, true)
            : cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    // fileFilter: fileFilter
}).fields([{ name: 'documents', maxCount: 1 }, { name: 'images', maxCount: 3 }])

module.exports = upload;
