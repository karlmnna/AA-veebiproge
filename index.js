const express = require('express');
const dateTimeET = require('./src/dateTimeET.js');
const fs = require('fs').promises;
const bodyparser = require('body-parser');

const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visits.txt';

//käivitan express() funktsiooni ja tähistan töötava asja nimega "app"
const app = express();
//määrame veebilehe mallide järgi renderdamise mootori
app.set('view engine', 'ejs');
//muudan "public" veebiserveri kättesaadavax
app.use(express.static('public'));
//hakkame paringuid parsima
app.use (bodyparser.urlencoded({extended: false}));

app.get('/', (req, res)=>{
	//res.send('Express.js veeb käivitus!');
	const day = dateTimeET.weekDayET();
	const date = dateTimeET.dateET();
	const time = dateTimeET.timeET();
	res.render('index', {day: day, date: date, time: time});
});

app.get('/vanasona', async (req, res)=>{
	try {
		const data = await fs.readFile(textRef, 'utf8')
		let folkWisdom = data.split(';');
		let wisdom = folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))];
		res.render('wisdom', {wisdom: wisdom});
	}
	catch (err){
		console.log(err);
		res.render('wisdom', {wisdom: 'Kahjuks ühtegi vanasõna ei leitud!'});
	}
});

app.get('/miks-tlu', (req, res)=>{
	res.render('miks-tlu');
});

app.get('/regvisit', (req, res)=>{
	res.render('regvisit');
});

app.post('/regvisit', async (req, res)=>{
	console.log(req.body);

	const date = dateTimeET.dateET().replace(',', '');
	const time = dateTimeET.timeET();

	try{
		await fs.appendFile(
			regTextRef,
			req.body.nameInput + ',' + date + ',' + time + ';'
		);
		res.render('regvisit');
	}
	catch (err) {
		console.log(err);
		res.render('regvisit');
	}
});

app.get('/lastvisit', async (req, res)=>{
	try {
		const data = await fs.readFile(regTextRef, 'utf8');

		const visits = data.split(';');

		const lastVisit = visits[visits.length - 2];

		const visitParts = lastVisit.split(',');

		const name = visitParts[0];
		const date = visitParts[1];
		const time = visitParts[2];

		res.render('lastvisit', {
			name: name,
			date: date,
			time: time
		});
	}
	catch (err) {
		console.log(err);
	}
});

app.listen(5325);