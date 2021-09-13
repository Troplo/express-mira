let express = require("express");
let router = express.Router();
let argon2 = require("argon2");
let jwt = require("jsonwebtoken");

let auth = require("../../lib/auth")
let Errors = require("../../lib/errors.js");
let { user } = require("../../models");

router.get("/", auth, async(req, res, next) => {
    try {
        const userFind = await user.findOne({
            where: {
                id: req.user.id
            },
            attributes: {
                exclude: ["password"]
            }
        });

        console.log(req.userData.id)

        if (!userFind) {
            throw Errors.notAuthenticated
        } else {
            res.json(userFind)
        }
    } catch (err) { next(err); }
});

module.exports = router;