import { Router } from 'express';
import profissionalController from '../controllers/profissionalController.js';

const router = Router();

// Rotas sem conflito
router.post('/', profissionalController.criarProfissional);
router.get('/', profissionalController.listarProfissionais);

// Rotas com :id
router.get('/:id', profissionalController.obterProfissional);
router.put('/:id', profissionalController.atualizarProfissional);
router.delete('/:id', profissionalController.removerProfissional);

// Rota de login
router.post('/login', profissionalController.loginProfissional);

// Listar pacientes vinculados a um profissional
router.get('/:id/pacientes', profissionalController.listarPacientesDoProfissional);


export default router;
