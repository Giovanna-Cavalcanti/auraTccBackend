import express from "express";
import humorController from "../controllers/humorController.js";

const router = express.Router();

// POST /humor -> cria ou atualiza o humor do dia
router.post("/", humorController.registrarHumor);

// GET /humor/:pacienteId -> lista todos os humores do paciente
router.get("/:pacienteId", humorController.listarHumores);

// GET /humor/:pacienteId/:data -> busca humor de uma data específica
router.get("/:pacienteId/:data", humorController.obterHumorDoDia);

// DELETE /humor/:id -> deleta um registro (opcional)
router.delete("/:id", humorController.deletarHumor);

export default router;
