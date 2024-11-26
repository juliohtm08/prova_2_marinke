"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class contract extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            contract.belongsTo(models.profile, {
                foreignKey: "client_id",
                as: "client",
            });
            contract.belongsTo(models.profile, {
                foreignKey: "contractorid",
                as: "contractor",
            });

            contract.hasMany(models.job, {
                foreignKey: "contract_id", // Campo de chave estrangeira
                as: "contract", // Nome do alias para facilitar consultas
            });
        }
    }
    contract.init(
        {
            terms: DataTypes.STRING,
            client_id: DataTypes.INTEGER,
            contractorid: DataTypes.INTEGER,
            operationDate: DataTypes.DATE,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "contract",
        }
    );
    return contract;
};
