import express from "express";
import triagemController from "../controllers/triagemController.js";

const router = express.Router();

// POST /triagem -> cria uma triagem nova
router.post("/", triagemController.criarTriagem);
// PUT /triagem/:pacienteId -> atualiza dados da triagem já existente
router.put("/:pacienteId", triagemController.atualizarTriagem); // edita a triagem existente
// GET /triagem/:pacienteId -> busca todas as triagens de um paciente
router.get("/:pacienteId", triagemController.obterTriagensPorPaciente);

export default router;
