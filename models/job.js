"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class job extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            job.belongsTo(models.contract, {
                foreignKey: "contract_id",
                as: "contractID",
            });
        }
    }
    job.init(
        {
            contract_id: DataTypes.INTEGER,
            description: DataTypes.STRING,
            operationDate: DataTypes.DATE,
            paymentDate: DataTypes.DATE,
            price: DataTypes.DOUBLE,
            paid: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "job",
        }
    );
    return job;
};
