"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("deposits", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            client_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "profile", // Nome da tabela referenciada
                    key: "id", // Chave primária na tabela referenciada
                },
                onUpdate: "CASCADE", // Atualizar em cascata
                onDelete: "SET NULL", // Definir como NULL se o perfil for excluído
            },
            operationDate: {
                type: Sequelize.DATE,
            },
            depositValue: {
                type: Sequelize.DOUBLE,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("deposits");
    },
};
