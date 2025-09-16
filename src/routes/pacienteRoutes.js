import { Router } from 'express';
import pacienteController from '../controllers/pacienteController.js';

const router = Router();

// Rotas sem conflito
router.post('/', pacienteController.criarPaciente);
router.get('/buscar/cpf', pacienteController.buscarPacientePorCpf); // 🔹 precisa vir antes do :id
router.get('/', pacienteController.listarPacientes);

// Rotas com :id
router.get('/:id', pacienteController.obterPaciente);
router.put('/:id', pacienteController.atualizarPaciente);
router.delete('/:id', pacienteController.removerPaciente);

// Rota de login
router.post('/login', pacienteController.loginPaciente);

// Vincular paciente a profissional
router.put('/:pacienteId/profissional/:profissionalId', pacienteController.vincularProfissional);

// Mostrar profissional vinculado ao paciente
router.get('/:id/profissional', pacienteController.mostrarProfissionalDoPaciente);


export default router;
