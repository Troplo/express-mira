'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    user.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "This username is already taken.",
                fields: ["username"],
                val: true,
            },
            validate: {
                is: {
                    args: [/^[a-zA-Z0-9_]*$/],
                    msg: "Your username may only contain alphanumeric characters."
                },
                len: {
                    args: [3, 30],
                    msg: "Your username must be between 3-20 characters."
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'user',
    });

    return user;
};