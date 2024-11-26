const express = require("express");
const router = express.Router();
const {
    profile: profileModel,
    deposit: depositModel,
    contract: contractModel,
    job: jobModel,
    payment: paymentModel,
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

// Rota para adicioar um contrato a um cliente
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

//adicionar job a um contract
router.post("/contract/:contract_id/jobs", async (req, res) => {
    const { contract_id } = req.params; // ID do contrato fornecido na URL
    const { description, operationDate, paymentDate, price, paid } = req.body; // Dados do Job

    try {
        // Verificar se o contrato existe
        const contract = await contractModel.findByPk(contract_id);
        if (!contract) {
            return res.status(404).json({ error: "Contrato não encontrado." });
        }

        // Criar o novo Job vinculado ao contrato
        const newJob = await jobModel.create({
            contract_id,
            description,
            operationDate,
            paymentDate,
            price,
            paid: paid || false, // Definir como não pago se não for enviado
        });

        res.status(201).json({
            message: "Job criado com sucesso.",
            job: newJob,
        });
    } catch (error) {
        console.error("Erro ao criar Job:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

//listart jobs de um contract
router.get("/contract/:contract_id/jobs", async (req, res) => {
    const { contract_id } = req.params; // ID do contrato fornecido na URL

    try {
        // Verificar se o contrato existe
        const contract = await contractModel.findByPk(contract_id);
        if (!contract) {
            return res.status(404).json({ error: "Contrato não encontrado." });
        }

        // Buscar todos os Jobs associados ao contrato
        const jobs = await jobModel.findAll({
            where: { contract_id }, // Filtrar pelo ID do contrato
            order: [["operationDate", "ASC"]], // Ordenar por data de operação
        });

        // Retornar os Jobs encontrados
        res.status(200).json({
            message: `Jobs do contrato ID ${contract_id} listados com sucesso.`,
            jobs,
        });
    } catch (error) {
        console.error("Erro ao listar Jobs:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

// Rota para adicionar um pagamento a um Job
router.post("/jobs/:job_id/payments", async (req, res) => {
    const { job_id } = req.params; // ID do Job fornecido na URL
    const { operationDate, paymentValue } = req.body; // Dados do pagamento fornecidos no corpo da requisição

    try {
        // Verificar se o Job existe
        const job = await jobModel.findByPk(job_id);
        if (!job) {
            return res.status(404).json({ error: "Job não encontrado." });
        }

        // Criar o pagamento vinculado ao Job
        const payment = await paymentModel.create({
            job_id,
            operationDate,
            paymentValue,
        });

        // Atualizar o status do Job se o pagamento for integral
        const totalPayments = await paymentModel.sum("paymentValue", {
            where: { job_id },
        });

        if (totalPayments >= job.price) {
            job.paid = true; // Marca como pago
            await job.save();
        }

        res.status(201).json({
            message: "Pagamento registrado com sucesso.",
            payment,
            jobUpdated: job,
        });
    } catch (error) {
        console.error("Erro ao registrar pagamento:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

module.exports = router;
