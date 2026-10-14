const express = require('express');
const router = express.Router();

const {
	regvisit,
	regvisitPost,
} = require('../controllers/visitsControllers');

router.route('/regvisit').get(regvisit);

router.route('/regvisit').post(regvisitPost);


module.exports = router;