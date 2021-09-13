'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class session extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    session.init({
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        bookId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        progress: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        bookmarks: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: 'session',
    });

    return session;
};