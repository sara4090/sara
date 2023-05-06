const multer = require('multer');


let storage = multer.diskStorage({
   destination: (req, file, cb) => { cb(null, './public/upload') },
   filename: (req, file, cb) => { cb(null, file.originalname) }
})
let upload = multer({ storage: storage })

module.exports = upload;
