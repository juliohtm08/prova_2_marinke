"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class profile extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            profile.hasMany(models.deposit, {
                foreignKey: "client_id", // Campo de chave estrangeira
                as: "deposit", // Nome do alias para facilitar consultas
            });
        }
    }
    profile.init(
        {
            firstName: DataTypes.STRING,
            lastname: DataTypes.STRING,
            profession: DataTypes.STRING,
            balance: DataTypes.DOUBLE,
            type: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "profile",
        }
    );
    return profile;
};
