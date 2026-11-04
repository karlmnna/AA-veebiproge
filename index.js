const express = require('express');
const dateTimeET = require('./src/dateTimeET.js');
const fs = require('fs').promises;
const bodyparser = require('body-parser');
const mysql = require('mysql2/promise');
//moodul keskkonnamuutujate lugemiseks
require('dotenv').config();

const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visits.txt';

//käivitan express() funktsiooni ja tähistan töötava asja nimega "app"
const app = express();
//määrame veebilehe mallide järgi renderdamise mootori
app.set('view engine', 'ejs');
//muudan "public" veebiserveri kättesaadavax
app.use(express.static('public'));
//hakkame paringuid parsima
app.use (bodyparser.urlencoded({extended: true}));


app.get('/', async (req, res)=>{
    const day = dateTimeET.weekDayET();
    const date = dateTimeET.dateET();
    const time = dateTimeET.timeET();

    let conn;
    let latestPhoto = null;

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });

        let sqlReq = 'SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy=? AND deleted IS NULL)';

        const [sqlRes] = await conn.execute(sqlReq, [3]);

        if (sqlRes.length > 0) {
            latestPhoto = sqlRes[0];
        }
    }
    catch (err) {
        console.log('Foto lugemisel tekkis viga: ' + err);
    }
    finally {
        if (conn) {
            await conn.end();
        }
    }

    res.render('index', {
        day: day,
        date: date,
        time: time,
        latestPhoto: latestPhoto
    });
});

app.get('/home', (req, res) => {
	res.render('home');
});

app.get('/logout', (req, res) => {
	res.redirect('/');
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

const visitsRouter = require('./routes/visitsRoutes');
app.use('/', visitsRouter);

const eestifilmRouter = require('./routes/eestifilmRoutes');
app.use('/eestifilm', eestifilmRouter);

const galleryPhotoUploadRouter = require('./routes/galleryPhotoUploadRoutes');
app.use('/galleryphotoupload', galleryPhotoUploadRouter);

const galleryRouter = require("./routes/galleryRoutes");
app.use("/gallery", galleryRouter);

const signupRouter = require("./routes/signupRoutes");
app.use("/signup", signupRouter);

const signinRouter = require("./routes/signinRoutes");
app.use("/signin", signinRouter);

app.listen(5325);