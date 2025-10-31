import express from "express";
import { criarTriagem, obterTriagensPorPaciente } from "../controllers/triagemController.js";

const router = express.Router();

// POST /triagem -> cria uma triagem nova
router.post("/", criarTriagem);

// GET /triagem/:pacienteId -> busca todas as triagens de um paciente
router.get("/:pacienteId", obterTriagensPorPaciente);

export default router;
