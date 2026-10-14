//@desc home page for Estonian Film section
//@route GET /eestifilm
//@access public
const mysql = require('mysql2/promise');

//app.get('/eestifilm', (req, res)=>{
const eestifilm = (req, res) => {
	res.render('eestifilm');
};
//@desc page for people involved in Estonian Film industry
//@route GET /eestifilm/film_inimesed
//@access public

//app.get('/eestifilm/film_inimesed', async (req, res)=>{
const eestifilmInimesed = async (req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		//defineerime sql päringu
		let sqlReq = 'SELECT * FROM person';
		// käivitame päringu
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('film_inimesed', {personList: sqlRes});
		
	}
	catch (err){
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('film_inimesed', {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc page for adding ppl in film industry
//@route GET /eestifilm/lisa_film_inimesed
//@access public

//app.get('/eestifilm/lisa_film_inimesed', (req, res)=>{
const eestifilmInimesedLisa = (req, res) => {
    res.render('lisa_film_inimesed', {
        notice: 'Ootan andmeid',
        firstNameInput: null,
        lastNameInput: null,
        bornInput: null,
        deceasedInput: null
    });
};

//@desc page for adding ppl in film industry
//@route POST /eestifilm/lisa_film_inimesed
//@access public

//app.post('/eestifilm/lisa_film_inimesed', async (req, res)=>{
const eestifilmInimesedLisaPost = async (req, res) => {
	console.log(req.body);
	const formData = {
    firstNameInput: req.body.firstNameInput,
    lastNameInput: req.body.lastNameInput,
    bornInput: req.body.bornInput,
    deceasedInput: req.body.deceasedInput
	};

	//kontrollime andmeid, teeme kõige lahjema kontrolli
	
	const bornDate = new Date(req.body.bornInput);
	const timeNow = new Date();

	let deceasedDate = null;
	let deceasedDateValid = true;

	if(req.body.deceasedInput != ''){
    	deceasedDate = req.body.deceasedInput;
    	const deceasedDateObj = new Date(deceasedDate);

    	if(isNaN(deceasedDateObj.getTime()) ||
       	deceasedDateObj.toISOString().slice(0, 10) != deceasedDate ||
    	deceasedDateObj > timeNow ||
       	deceasedDateObj < bornDate){
        deceasedDateValid = false;
    	}
	}

	if(!req.body.firstNameInput ||
		!req.body.lastNameInput ||
		!req.body.bornInput ||
		isNaN(bornDate.getTime()) ||
		bornDate.toISOString().slice(0, 10) != req.body.bornInput ||
		bornDate > timeNow ||
		!deceasedDateValid){
		console.log("Andmed pole korrektsed!");
		return res.render('lisa_film_inimesed', {
	notice: 'Sisestatud andmed pole korrektsed!',
	...formData
});

	}
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
		await conn.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			deceasedDate
		]);
		res.render('lisa_film_inimesed', {
    	notice: req.body.firstNameInput + ' ' + req.body.lastNameInput + ' andmebaasi salvestatud',
    	firstNameInput: null,
    	lastNameInput: null,
    	bornInput: null,
    	deceasedInput: null
});

	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga');
		res.render('lisa_film_inimesed', {
    	notice: 'Tekkis viga, andmeid ei salvestatud!',
    	...formData
});

	}
	finally {
		if(conn){
			await conn.end();
		}
	}
	
};

//@desc page for adding Estonian films
//@route GET /eestifilm/lisa_film
//@access public

//app.get('/eestifilm/lisa_film', (req, res)=>{
const eestifilmFilmidLisa = (req, res) => {
    res.render('lisa_film', {
        notice: 'Ootan filmi andmeid',
        titleInput: null,
        releaseYearInput: null,
        durationInput: null,
        descriptionInput: null
    });
};

//@desc page for adding Estonian films
//@route POST /eestifilm/lisa_film
//@access public

//app.post('/eestifilm/lisa_film', async (req, res)=>{
const eestifilmFilmidLisaPost = async (req, res) => {
    console.log(req.body);

    const formData = {
        titleInput: req.body.titleInput,
        releaseYearInput: req.body.releaseYearInput,
        durationInput: req.body.durationInput,
        descriptionInput: req.body.descriptionInput
    };

    //kontrollime sisestatud andmeid
    const title = (req.body.titleInput || '').trim();
    const releaseYear = Number(req.body.releaseYearInput);
    const duration = Number(req.body.durationInput);
    const description = (req.body.descriptionInput || '').trim();

    if(!title ||
       title.length > 100 ||
       !Number.isInteger(releaseYear) ||
       releaseYear < 1 ||
       releaseYear > 9999 ||
       !Number.isInteger(duration) ||
       duration <= 0 ||
       duration > 10000 ||
       description.length > 1000){

        console.log('Andmed pole korrektsed!');

        return res.render('lisa_film', {
            notice: 'Sisestatud andmed pole korrektsed!',
            ...formData
        });
    }

    let conn;
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });

        let sqlReq = 'INSERT INTO movie (title, release_year, duration_minutes, description) VALUES (?,?,?,?)';

        await conn.execute(sqlReq, [
            title,
            releaseYear,
            duration,
            description || null
        ]);

        res.render('lisa_film', {
            notice: title + ' andmebaasi salvestatud',
            titleInput: null,
            releaseYearInput: null,
            durationInput: null,
            descriptionInput: null
        });
    }
    catch (err) {
        console.log('Andmebaasiga suhtlemise viga: ' + err);

        res.render('lisa_film', {
            notice: 'Tekkis viga, andmeid ei salvestatud!',
            ...formData
        });
    }
    finally {
        if(conn){
            await conn.end();
        }
    }
};

//@desc page for list of Estonian films
//@route GET /eestifilm/filmid
//@access public

//app.get('/eestifilm/filmid', async (req, res)=>{
const eestifilmFilmid = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });

        let sqlReq = 'SELECT * FROM movie ORDER BY title';
        const [sqlRes] = await conn.execute(sqlReq);

        res.render('filmid', {movieList: sqlRes});
    }
    catch (err) {
        console.log('Andmebaasiga suhtlemise viga: ' + err);
        res.render('filmid', {movieList: []});
    }
    finally {
        if(conn){
            await conn.end();
        }
    }
};

//@desc page for list of professions in the film industry
//@route GET /eestifilm/ametid
//@access public

//app.get('/eestifilm/ametid', async (req, res)=>{
const eestifilmAmetid = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });

        let sqlReq = 'SELECT * FROM profession ORDER BY title';
        const [sqlRes] = await conn.execute(sqlReq);

        res.render('ametid', {professionList: sqlRes});
    }
    catch (err) {
        console.log('Andmebaasiga suhtlemise viga: ' + err);
        res.render('ametid', {professionList: []});
    }
    finally {
        if(conn){
            await conn.end();
        }
    }
};

//@desc page for adding professions of the film industry into the list
//@route GET /eestifilm/lisa_amet
//@access public

//app.get('/eestifilm/lisa_amet', (req, res)=>{
const eestifilmAmetidLisa = (req, res) => {
    res.render('lisa_amet', {
        notice: 'Ootan ameti andmeid',
        titleInput: null,
        descriptionInput: null
    });
};

//@desc page for adding professions of the film industry into the list
//@route POST /eestifilm/lisa_amet
//@access public

//app.post('/eestifilm/lisa_amet', async (req, res)=>{
const eestifilmAmetidLisaPost = async (req, res) => {
    console.log(req.body);

    const formData = {
        titleInput: req.body.titleInput,
        descriptionInput: req.body.descriptionInput
    };

    //kontrollime sisestatud andmeid
    const title = (req.body.titleInput || '').trim();
    const description = (req.body.descriptionInput || '').trim();

    if(!title ||
       title.length > 50 ||
       description.length > 1000){

        console.log('Andmed pole korrektsed!');

        return res.render('lisa_amet', {
            notice: 'Sisestatud andmed pole korrektsed!',
            ...formData
        });
    }

    let conn;
    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });

        let sqlReq = 'INSERT INTO profession (title, description) VALUES (?,?)';

        await conn.execute(sqlReq, [
            title,
            description || null
        ]);

        res.render('lisa_amet', {
            notice: title + ' andmebaasi salvestatud',
            titleInput: null,
            descriptionInput: null
        });
    }
    catch (err) {
        console.log('Andmebaasiga suhtlemise viga: ' + err);

        res.render('lisa_amet', {
            notice: 'Tekkis viga, andmeid ei salvestatud!',
            ...formData
        });
    }
    finally {
        if(conn){
            await conn.end();
        }
    }
};


module.exports = {
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
}