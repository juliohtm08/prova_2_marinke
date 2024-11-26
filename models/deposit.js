"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class deposit extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            deposit.belongsTo(models.profile, {
                foreignKey: "client_id",
                as: "profile",
            });
        }
    }
    deposit.init(
        {
            client_id: DataTypes.INTEGER,
            operationDate: DataTypes.DATE,
            depositValue: DataTypes.DOUBLE,
        },
        {
            sequelize,
            modelName: "deposit",
        }
    );
    return deposit;
};
