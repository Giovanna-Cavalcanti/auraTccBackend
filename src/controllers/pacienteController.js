import jwt from 'jsonwebtoken';
import Paciente from '../models/Paciente.js';
import Profissional from '../models/Profissional.js';


// Campos permitidos para atualização
const camposPermitidos = ['cpf', 'email', 'nomeCompleto', 'senha'];

// Cria paciente
const criarPaciente = async (req, res) => {
  try {
    const { cpf, email } = req.body;

    const pacienteExistente = await Paciente.findOne({ $or: [{ cpf }, { email }] });
    if (pacienteExistente) {
      const campoDuplicado = pacienteExistente.cpf === cpf ? 'CPF' : 'Email';
      return res.status(400).json({ erro: `${campoDuplicado} já cadastrado no sistema` });
    }

    const novoPaciente = await Paciente.create(req.body);
    const pacienteSemSenha = novoPaciente.toObject();
    delete pacienteSemSenha.senha;

    res.status(201).json({ mensagem: 'Paciente cadastrado com sucesso', paciente: pacienteSemSenha });
  } catch (error) {
    res.status(400).json({ erro: 'Falha ao cadastrar paciente', detalhes: error.message });
  }
};

// Listar todos
const listarPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find().sort({ nomeCompleto: 1 }).select('-senha');
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao buscar pacientes', detalhes: error.message });
  }
};

// Obter por ID
const obterPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id).select('-senha');
    if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });
    res.status(200).json(paciente);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao buscar paciente', detalhes: error.message });
  }
};

// Atualizar paciente
const atualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};

    // Filtrar apenas campos permitidos
    camposPermitidos.forEach(campo => {
      if (req.body[campo] !== undefined) updates[campo] = req.body[campo];
    });

    const paciente = await Paciente.findById(id);
    if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });

    // Verifica duplicidade de CPF/email
    if (updates.cpf || updates.email) {
      const conditions = [];
      if (updates.cpf) conditions.push({ cpf: updates.cpf });
      if (updates.email) conditions.push({ email: updates.email });

      const pacienteExistente = await Paciente.findOne({ _id: { $ne: id }, $or: conditions });
      if (pacienteExistente) {
        const campoDuplicado = pacienteExistente.cpf === updates.cpf ? 'CPF' : 'Email';
        return res.status(400).json({ erro: `${campoDuplicado} já está em uso por outro paciente` });
      }
    }

    // Atualiza campos permitidos
    Object.assign(paciente, updates);

    // Se houver senha, hash será aplicado no pre('save')
    await paciente.save();

    const pacienteAtualizado = paciente.toObject();
    delete pacienteAtualizado.senha;

    res.status(200).json({ mensagem: 'Paciente atualizado com sucesso', paciente: pacienteAtualizado });
  } catch (error) {
    res.status(400).json({ erro: 'Falha ao atualizar paciente', detalhes: error.message });
  }
};

// Remover paciente
const removerPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndDelete(req.params.id);
    if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });
    res.status(200).json({ mensagem: 'Paciente removido com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao remover paciente', detalhes: error.message });
  }
};

// Buscar paciente por CPF
const buscarPacientePorCpf = async (req, res) => {
  try {
    const { cpf } = req.query;
    if (!cpf || !/^\d{11}$/.test(cpf)) return res.status(400).json({ erro: 'O CPF deve conter exatamente 11 dígitos numéricos' });

    const paciente = await Paciente.findOne({ cpf }).select('-senha');
    if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });

    res.status(200).json(paciente);
  } catch (error) {
    res.status(500).json({ erro: 'Falha na busca de paciente', detalhes: error.message });
  }
};

// Login de paciente
const loginPaciente = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) return res.status(400).json({ erro: "Informe email e senha" });

    const paciente = await Paciente.findOne({ email }).select('+senha');
    if (!paciente) return res.status(404).json({ erro: "Paciente não encontrado" });

    const senhaValida = await paciente.compararSenha(senha);
    if (!senhaValida) return res.status(401).json({ erro: "Senha incorreta" });

    // JWT usando apenas .env
    const token = jwt.sign(
      { id: paciente._id, email: paciente.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const pacienteData = paciente.toObject();
    delete pacienteData.senha;

    res.status(200).json({
      mensagem: "Login realizado com sucesso",
      token,
      paciente: pacienteData,
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor" });
  }
};


// Mostrar profissional vinculado a um paciente
const mostrarProfissionalDoPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o paciente
    const paciente = await Paciente.findById(id).populate('profissional'); 
    // `populate` traz os dados do profissional

    if (!paciente) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    if (!paciente.profissional) {
      return res.status(200).json({ mensagem: 'Paciente ainda não possui profissional vinculado' });
    }

    res.status(200).json(paciente.profissional);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao buscar profissional do paciente', detalhes: error.message });
  }
};

const enviarSolicitacao = async (req, res) => {
  try {
    const { pacienteId, profissionalId } = req.params;

    const paciente = await Paciente.findById(pacienteId);
    if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });

    const profissional = await Profissional.findById(profissionalId);
    if (!profissional) return res.status(404).json({ erro: 'Profissional não encontrado' });

    // Verifica se o paciente já tem vínculo ativo
    if (paciente.profissional) {
      return res.status(400).json({ erro: 'Paciente já possui um profissional vinculado' });
    }

    // Verifica se já há uma solicitação pendente
    if (paciente.solicitacao?.status === 'pendente') {
      return res.status(400).json({ erro: 'Já existe uma solicitação pendente' });
    }

    // Cria nova solicitação
    paciente.solicitacao = {
      profissional: profissionalId,
      status: 'pendente'
    };

    await paciente.save();
    res.status(200).json({ mensagem: 'Solicitação enviada com sucesso', paciente });
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao enviar solicitação', detalhes: error.message });
  }
};

const verSolicitacaoAtual = async (req, res) => {
  try {
    const { id } = req.params;

    const paciente = await Paciente.findById(id)
      .populate('solicitacao.profissional', 'nomeCompleto email');

    if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });

    if (!paciente.solicitacao || !paciente.solicitacao.profissional) {
      return res.status(200).json({ mensagem: 'Nenhuma solicitação enviada' });
    }

    res.status(200).json({
      profissional: paciente.solicitacao.profissional,
      status: paciente.solicitacao.status
    });
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao buscar solicitação atual', detalhes: error.message });
  }
};

const cancelarSolicitacao = async (req, res) => {
  try {
    const { id } = req.params;

    const paciente = await Paciente.findById(id);
    if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });

    if (!paciente.solicitacao || paciente.solicitacao.status !== 'pendente') {
      return res.status(400).json({ erro: 'Nenhuma solicitação pendente para cancelar' });
    }

    // Cancela a solicitação
    paciente.solicitacao = { profissional: null, status: null };
    await paciente.save();

    res.status(200).json({ mensagem: 'Solicitação cancelada com sucesso', paciente });
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao cancelar solicitação', detalhes: error.message });
  }
};


const desvincularProfissional = async (req, res) => {
  try {
    const { id } = req.params; // ID do paciente
    const paciente = await Paciente.findById(id);

    if (!paciente) {
      return res.status(404).json({ erro: "Paciente não encontrado." });
    }

    if (!paciente.profissional) {
      return res.status(400).json({ erro: "Este paciente não possui um profissional vinculado." });
    }

    // Remove vínculo direto e limpa solicitação (se existir)
    const profissionalId = paciente.profissional;
    paciente.profissional = null;
    paciente.solicitacao = { profissional: null, status: null };

    await paciente.save();

    res.status(200).json({
      mensagem: "Vínculo entre paciente e profissional removido com sucesso.",
      pacienteId: id,
      profissionalRemovido: profissionalId
    });
  } catch (error) {
    res.status(500).json({ erro: "Falha ao remover vínculo", detalhes: error.message });
  }
};

export default {
  criarPaciente,
  listarPacientes,
  obterPaciente,
  atualizarPaciente,
  removerPaciente,
  buscarPacientePorCpf,
  loginPaciente,
  mostrarProfissionalDoPaciente,
  enviarSolicitacao,
  verSolicitacaoAtual,
  cancelarSolicitacao,
  desvincularProfissional
};
