const mysql = require("mysql2/promise");

const gallery = async (req, res) => {
    let conn;
    let photoList = [];

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });

        let sqlReq = "SELECT filename, alttext FROM galleryphotos WHERE privacy >= ? AND deleted IS NULL ORDER BY id DESC";
        const [sqlRes] = await conn.execute(sqlReq, [2]);

        photoList = sqlRes;
    } catch (err) {
        console.log("Galerii lugemisel tekkis viga: " + err);
    } finally {
        if (conn) {
            await conn.end();
        }
    }

    res.render("gallery", { photoList: photoList });
};

module.exports = { gallery };