"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class payment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            payment.belongsTo(models.job, {
                foreignKey: "job_id",
                as: "job",
            });
        }
    }
    payment.init(
        {
            job_id: DataTypes.INTEGER,
            operationDate: DataTypes.DATE,
            paymentValue: DataTypes.DOUBLE,
        },
        {
            sequelize,
            modelName: "payment",
        }
    );
    return payment;
};
