const express = require("express");
const router = express.Router();
const { profile: profileModel, deposit: depositModel } = require("../models");

// Rota para listar perfis
router.get("/getProfile", async (req, res) => {
    try {
        const fetchedData = await profileModel.findAll();
        res.json(fetchedData);
    } catch (error) {
        console.error("Erro ao buscar perfis:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// Rota para realizar um depósito
router.post("/deposit/:client_id", async (req, res) => {
    const { client_id } = req.params; // Pega o ID do cliente da URL
    const { operationDate, depositValue } = req.body; // Dados do depósito do corpo da requisição

    try {
        // Validar se o cliente existe
        const profile = await profileModel.findByPk(client_id);
        if (!profile) {
            return res.status(404).json({ error: "Perfil não encontrado" });
        }

        // Criar o depósito
        const deposit = await depositModel.create({
            client_id,
            operationDate,
            depositValue,
        });

        // Atualizar o saldo do perfil
        profile.balance += parseFloat(depositValue);
        await profile.save();

        res.status(201).json({
            message: `Depósito realizado com sucesso para o cliente ID ${client_id}`,
            deposit,
            updatedBalance: profile.balance,
        });
    } catch (error) {
        console.error("Erro ao processar depósito:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

module.exports = router;
