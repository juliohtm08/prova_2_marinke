const express = require("express");
const router = express.Router();
const {
    profile: profileModel,
    deposit: depositModel,
    contract: contractModel,
} = require("../models");

// Rota para listar clientes
router.get("/getProfile", async (req, res) => {
    try {
        const fetchedData = await profileModel.findAll();
        res.json(fetchedData);
    } catch (error) {
        console.error("Erro ao buscar perfis:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// Rota para realizar um depósito a um cliente
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

// Rota para adicioanr um contrato a um cliente
router.post("/contract/:client_id", async (req, res) => {
    const { client_id } = req.params; // Recebe os IDs na URL
    const { terms, operationDate, status } = req.body; // Dados do contrato no corpo da requisição

    try {
        // Validar se o cliente e o contratante existem
        const client = await profileModel.findByPk(client_id);

        if (!client) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }

        // Criar o contrato
        const newContract = await contractModel.create({
            terms,
            client_id,
            operationDate,
            status,
        });

        res.status(201).json({
            message: "Contrato criado com sucesso",
            contract: newContract,
        });
    } catch (error) {
        console.error("Erro ao criar contrato:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// listar contratos de um cliente
router.get("/profile/:id/contracts", async (req, res) => {
    const { id } = req.params; // ID do profile

    try {
        // Buscar o profile com contratos
        const profileWithContracts = await profileModel.findByPk(id, {
            include: [
                {
                    model: contractModel,
                    as: "clientContracts", // Inclui contratos como cliente
                },
                {
                    model: contractModel,
                    as: "contractorContracts", // Inclui contratos como contratante
                },
            ],
        });

        if (!profileWithContracts) {
            return res.status(404).json({ error: "Profile não encontrado" });
        }

        // Retornar os contratos
        res.json({
            clientContracts: profileWithContracts.clientContracts,
            contractorContracts: profileWithContracts.contractorContracts,
        });
    } catch (error) {
        console.error("Erro ao buscar contratos:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

module.exports = router;
