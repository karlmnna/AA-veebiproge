const express = require("express");
//sisselogimise kontrolli vahevara
const checkLogin = require('../src/checkLogin');

const router = express.Router();
//kontrollin sisselogimist
router.use(checkLogin.isLogin);

const { gallery } = require("../controllers/galleryControllers");

router.get("/", gallery);

module.exports = router;