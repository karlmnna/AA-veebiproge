
const mysql = require("mysql2/promise");

//@desc Photo gallery
//@route GET /gallery
//@access private
const gallery = async (req, res) => {
    let conn;
    let galleryData = [];

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });

        let sqlReq = "SELECT id, filename, alttext FROM galleryphotos WHERE privacy >= ? AND deleted IS NULL ORDER BY id DESC";
        const [sqlRes] = await conn.execute(sqlReq, [2]);

        for (let i = 0; i < sqlRes.length; i++) {
            let altText = "Galeriipilt";

            if (sqlRes[i].alttext) {
                altText = sqlRes[i].alttext;
            }

            galleryData.push({
                id: sqlRes[i].id,
                src: sqlRes[i].filename,
                alt: altText
            });
        }

    } catch (err) {
        console.log("Galerii lugemisel tekkis viga: " + err);
    } finally {
        if (conn) {
            await conn.end();
        }
    }

    res.render("gallery", {
        galleryData: galleryData,
        imagehref: process.env.GALLERY_THUMBNAIL
    });
};

module.exports = { gallery };
