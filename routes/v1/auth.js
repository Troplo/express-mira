let express = require("express");
let router = express.Router();
let argon2 = require("argon2");
let jwt = require("jsonwebtoken");
let config = require("../../config/config.json");

let Errors = require("../../lib/errors.js");
let { user } = require("../../models");

router.post("/login", async(req, res, next) => {
    try {
        async function checkPassword(password, hash) {
            try {
                return await argon2.verify(hash, password)
            } catch {
                console.log('Error');
            }
        }
        let userFind = await user.findOne({
            where: {
                username: req.body.username
            }
        });

        if (userFind) {
            if (await checkPassword(req.body.password, userFind.password)) {
                jwt.sign(
                    {id: userFind.id},
                    config.jwt, {expiresIn: "30 days"},
                    (err, token) => {
                        if (err) throw err;
                        res.status(200).json({token: token});
                    }
                );
            } else {
                throw Errors.invalidCredentials
            }
        }
    } catch (err) { next(err); }
});

router.post("/register", async(req, res, next) => {
    try {
        async function hashPassword(password) {
            try {
                return await argon2.hash(password)
            } catch {
                console.log('Error');
            }
        }
        const userFind = await user.create({
            username: req.body.username,
            password: await hashPassword(req.body.password)
        });

        if (!userFind) {
            throw Errors.unknown
        } else {
            jwt.sign(
                {id: userFind.id},
                config.jwt, {expiresIn: "30 days"},
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({token: token});
                }
            );
        }
    } catch (err) { next(err); }
});

module.exports = router;
