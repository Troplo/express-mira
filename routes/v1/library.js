let express = require("express");
let router = express.Router();
let config = require("../../config/config.json");
let {EpubParser} = require("@ridi/epub-parser");
let auth = require("../../lib/auth")
let Errors = require("../../lib/errors")
let fs = require("fs");
let crypto = require("crypto")
let { user, library, session } = require("../../models");

router.get("/", auth, async(req, res, next) => {
    try {
        let libraryFind = await library.findAndCountAll();
        res.json(libraryFind)
    } catch (err) { next(err); }
});

router.get("/scan", auth, async(req, res, next) => {
    try {
        await library.destroy({
            where: {}
        })
        let dirents = fs.readdirSync(config.library, {withFileTypes: true})
        let files = dirents
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);
        for (const file of files) {
            let parser = new EpubParser(config.library + file);
            parser.parse().then((book) => {
                console.log(book)
                library.create({
                    id: crypto.createHash('sha256').update(file).digest('hex'),
                    title: book.titles[0],
                    authors: book.creators,
                    description: book.description,
                    date: book.dates[0].value,
                    file: file
                })
            });
        }
        res.json({success: true})
    }
    catch (err) { next(err); }
});

router.get("/file/:epub.epub", auth, async(req, res, next) => {
    try {
        let book = await library.findOne({
            where: {
                id: req.params.epub
            }
        })
        if(book) {
            res.sendFile(config.library + book.file)
        }
    }
    catch (err) { next(err); }
});

router.get("/session/:id", auth, async(req, res, next) => {
    try {
        let book = await library.findOne({
            where: {
                id: req.params.id
            }
        })
        if (book) {
            let bookSession = await session.findOne({
                where: {
                    bookId: book.id,
                    userId: req.user.id
                }
            })
            if (bookSession) {
                res.json(bookSession)
            } else {
                let newSession = await session.create({
                    userId: req.user.id,
                    bookId: req.params.id,
                    progress: 0,
                    bookmarks: []
                })
                res.json(newSession)
            }
        } else {
            throw Errors.bookDoesNotExist
        }
    }
    catch (err) { next(err); }
});

router.put("/session/:id", auth, async(req, res, next) => {
    try {
        let book = await library.findOne({
            where: {
                id: req.params.id
            }
        })
        if (book) {
            let bookSession = await session.findOne({
                where: {
                    bookId: book.id,
                    userId: req.user.id
                }
            })
            if (bookSession) {
                await bookSession.update({
                    progress: req.body.progress,
                    bookmarks: req.body.bookmarks
                })
                res.json({success: true})
            } else {
                await session.create({
                    userId: req.user.id,
                    bookId: req.params.id,
                    progress: req.body.progress,
                    bookmarks: req.body.bookmarks
                })
                res.json({success: true})
            }
        } else {
            throw Errors.bookDoesNotExist
        }
    }
    catch (err) { next(err); }
});

module.exports = router;
