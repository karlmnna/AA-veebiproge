const express = require('express');
const router = express.Router();

//kasutatavad controllerid
const {
	eestifilm,
	eestifilmInimesed,
	eestifilmInimesedLisa,
	eestifilmInimesedLisaPost,
	eestifilmFilmid,
	eestifilmFilmidLisa,
	eestifilmFilmidLisaPost,
	eestifilmAmetid,
	eestifilmAmetidLisa,
	eestifilmAmetidLisaPost
} = require('../controllers/eestifilmControllers');

router.route('/').get(eestifilm);

router.route('/film_inimesed').get(eestifilmInimesed);

router.route('/lisa_film_inimesed').get(eestifilmInimesedLisa);

router.route('/lisa_film_inimesed').post(eestifilmInimesedLisaPost);

router.route('/filmid').get(eestifilmFilmid);

router.route('/lisa_film').get(eestifilmFilmidLisa);

router.route('/lisa_film').post(eestifilmFilmidLisaPost);

router.route('/ametid').get(eestifilmAmetid);

router.route('/lisa_amet').get(eestifilmAmetidLisa);

router.route('/lisa_amet').post(eestifilmAmetidLisaPost);


module.exports = router;