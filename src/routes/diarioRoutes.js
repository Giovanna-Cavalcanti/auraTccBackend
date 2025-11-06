import express from "express";
import diarioController from "../controllers/diarioController.js";

const router = express.Router();

// POST /diario -> cria nova anotação
router.post("/", diarioController.criarAnotacao);

// GET /diario/:pacienteId -> retorna todas as anotações de um paciente
router.get("/:pacienteId", diarioController.obterAnotacoesPorPaciente);

// PUT /diario/:id -> atualiza uma anotação específica
router.put("/:id", diarioController.atualizarAnotacao);

// DELETE /diario/:id -> deleta uma anotação específica
router.delete("/:id", diarioController.deletarAnotacao);

export default router;
