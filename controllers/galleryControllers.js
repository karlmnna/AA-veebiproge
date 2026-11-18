const mysql = require("mysql2/promise");

// GET /gallery
const galleryHome = (req, res) => {
    res.redirect("/gallery/1");
};

// GET /gallery/:page
const galleryPage = async (req, res) => {
    let page = parseInt(req.params.page, 10);
    const privacy = 2;
    const limit = 5;

    if (page < 1 || Number.isNaN(page)) {
        page = 1;
    }

    let conn;
    const galleryData = [];
    const separator = " &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; ";
    let galleryLinks = `Eelmine leht${separator}Järgmine leht`;

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });

        // Loendame üldgaleriisse sobivad fotod.
        const countSql = "SELECT COUNT(id) AS photos FROM galleryphotos WHERE privacy >= ? AND deleted IS NULL";
        const [countResult] = await conn.execute(countSql, [privacy]);
        const photoCount = countResult[0].photos;

        // Liiga suure leheküljenumbri korral kuvame viimase lehe.
        const lastPage = Math.max(1, Math.ceil(photoCount / limit));
        page = Math.min(page, lastPage);
        const skip = (page - 1) * limit;

        const photoSql = "SELECT id, filename, alttext FROM galleryphotos WHERE privacy >= ? AND deleted IS NULL ORDER BY id DESC LIMIT ?, ?";
        const [photos] = await conn.execute(photoSql, [privacy, skip, limit]);

        for (let i = 0; i < photos.length; i++) {
            galleryData.push({
                id: photos[i].id,
                src: photos[i].filename,
                alt: photos[i].alttext || "Galeriipilt"
            });
        }

        let previousLink = "Eelmine leht";
        let nextLink = "Järgmine leht";

        if (page > 1) {
            previousLink = `<a href="/gallery/${page - 1}">Eelmine leht</a>`;
        }

        if (page < lastPage) {
            nextLink = `<a href="/gallery/${page + 1}">Järgmine leht</a>`;
        }

        galleryLinks = previousLink + separator + nextLink;
    } catch (err) {
        console.log("Galerii lugemisel tekkis viga: " + err);
    } finally {
        if (conn) {
            await conn.end();
        }
    }

    res.render("gallery", {
        galleryData: galleryData,
        imagehref: process.env.GALLERY_THUMBNAIL,
        links: galleryLinks
    });
};

// GET /gallery/my
const myGalleryPage = async (req, res) => {
    let conn;
    const galleryData = [];

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });

        const sqlReq = "SELECT id, filename, alttext FROM galleryphotos WHERE userid = ? AND deleted IS NULL";
        const [photos] = await conn.execute(sqlReq, [req.session.userId]);

        for (let i = 0; i < photos.length; i++) {
            galleryData.push({
                id: photos[i].id,
                src: photos[i].filename,
                alt: photos[i].alttext || "Galeriipilt"
            });
        }
    } catch (err) {
        console.log("Minu galerii lugemisel tekkis viga: " + err);
    } finally {
        if (conn) {
            await conn.end();
        }
    }

    res.render("mygallery", {
        galleryData: galleryData,
        imagehref: process.env.GALLERY_NORMAL
    });
};

module.exports = { galleryHome, myGalleryPage, galleryPage };