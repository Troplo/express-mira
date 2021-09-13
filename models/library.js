'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class library extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    library.init({
        title: {
            type: DataTypes.STRING
        },
        authors: {
            type: DataTypes.JSON,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE
        },
        cover: {
            type: DataTypes.STRING
        },
        file: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'library',
    });

    return library;
};