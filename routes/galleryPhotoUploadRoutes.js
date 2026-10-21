const express = require('express');
const multer = require('multer');

const router = express.Router();

//seadistame multer vahevara faile uleslaadima kindlasse kataloogi
const upload = multer({dest: './public/gallery/orig/'});
//saab maarata ka lubatud failityype, failimahtu ja  muud sellist

//kasutatavad controllerid
const {
	galleryPhotoUpload,
	galleryPhotoUploadPost
} = require('../controllers/galleryPhotoUploadControllers');

router.route('/').get(galleryPhotoUpload);

router.route('/').post(upload.single('photoInput'), galleryPhotoUploadPost);



module.exports = router;