const fs = require('fs').promises;
const dateTimeET = require('../src/dateTimeET.js');
const regTextRef = 'public/txt/visits.txt';

//@desc visitor registration page
//@route GET /regvisit
//@access public

//app.get('/regvisit', (req, res)=>{

const regvisit = async (req, res) => {
    try {
        const data = await fs.readFile(regTextRef, 'utf8');
        const visits = data.split(';');
        const lastVisit = visits[visits.length - 2];
        const visitParts = lastVisit.split(',');

        const name = visitParts[0];
        const date = visitParts[1];
        const time = visitParts[2];

        res.render('regvisit', {
            name: name,
            date: date,
            time: time
        });
    }
    catch (err) {
        console.log(err);
        res.render('regvisit', {
            name: null,
            date: null,
            time: null
        });
    }
};


//@desc save visitor registration
//@route POST /regvisit
//@access public

//app.post('/regvisit', async (req, res)=>{
const regvisitPost = async (req, res) => {	
	console.log(req.body);

	const date = dateTimeET.dateET().replace(',', '');
	const time = dateTimeET.timeET();

	try{
		await fs.appendFile(
			regTextRef,
			req.body.nameInput + ',' + date + ',' + time + ';'
		);
		res.redirect('/regvisit');
	}
	catch (err) {
		console.log(err);
		res.redirect('/regvisit');
	}
};


module.exports = {
	regvisit,
	regvisitPost
};