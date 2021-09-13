const jwt = require("jsonwebtoken");
const Errors = require("./errors.js");
let config = require("../config/config.json");

const { user } = require("../models");
const {Op} = require("sequelize");

module.exports = function (req, res, next) {
    const token = req.header("Authorization");

    if (token == null) {
        throw Errors.emptyJWT
    } else {
        try {
            jwt.verify(token, config.jwt, (err, token) => {
                if (err) {
                    throw Errors.invalidJWT
                } else {
                    let userData = user.findOne({
                        where: {
                            id: token.id
                        }
                    })
                    req.user = token;
                    req.userData = userData
                    next();
                }
            });
        } catch (err) { next(err); }
    }
};