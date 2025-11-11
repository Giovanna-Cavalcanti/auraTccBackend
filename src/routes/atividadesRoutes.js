// routes/atividadeRoutes.js
import express from "express";
import atividadeController from "../controllers/atividadeController.js";

const router = express.Router();

// Criar atividade (psicólogo)
router.post("/", atividadeController.criarAtividade);

// Ver atividades do paciente
router.get("/paciente/:pacienteId", atividadeController.obterAtividadesPorPaciente);

// Ver atividades criadas pelo psicólogo
router.get("/psicologo/:psicologoId", atividadeController.obterAtividadesPorPsicologo);

// Ver uma atividade específica
router.get("/:id", atividadeController.obterAtividadePorId);

// Atualizar progresso do paciente
router.put("/:id/progresso", atividadeController.atualizarProgresso);

// Deletar atividade
router.delete("/:id", atividadeController.deletarAtividade);


export default router;
