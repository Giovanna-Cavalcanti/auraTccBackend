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

// Enviar solicitação de vínculo
router.post('/:pacienteId/solicitar/:profissionalId', pacienteController.enviarSolicitacao);

// Ver solicitação atual do paciente
router.get('/:id/solicitacao', pacienteController.verSolicitacaoAtual);

// Cancelar solicitação pendente
router.delete('/:id/solicitacao', pacienteController.cancelarSolicitacao);

// Mostrar profissional vinculado ao paciente
router.get('/:id/profissional', pacienteController.mostrarProfissionalDoPaciente);

// Paciente desfaz vínculo com profissional atual
router.delete('/:id/desvincular', pacienteController.desvincularProfissional);


export default router;
