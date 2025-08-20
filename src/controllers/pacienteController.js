import Paciente from '../models/Paciente.js';

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
    const { cpf, email } = req.body;
    
    const paciente = await Paciente.findById(id);
    if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });

    if (cpf || email) {
      const conditions = [];
      if (cpf) conditions.push({ cpf });
      if (email) conditions.push({ email });

      const pacienteExistente = await Paciente.findOne({ _id: { $ne: id }, $or: conditions });
      if (pacienteExistente) {
        const campoDuplicado = pacienteExistente.cpf === cpf ? 'CPF' : 'Email';
        return res.status(400).json({ erro: `${campoDuplicado} já está em uso por outro paciente` });
      }
    }

    const pacienteAtualizado = await Paciente.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select('-senha');
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

    if (!email || !senha) {
      return res.status(400).json({ erro: 'email e senha são obrigatórios' });
    }

    // Busca paciente pelo email e inclui a senha (que está com select: false)
    const paciente = await Paciente.findOne({ email }).select('+senha');

    if (!paciente) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    // Compara senha
    const senhaValida = await paciente.compararSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    // Retorna paciente (sem senha) e mensagem de sucesso
    const pacienteData = paciente.toObject();
    delete pacienteData.senha;

    res.status(200).json({ mensagem: 'Login realizado com sucesso', paciente: pacienteData });

  } catch (error) {
    res.status(500).json({ erro: 'Falha no login', detalhes: error.message });
  }
};

export default {
  criarPaciente,
  listarPacientes,
  obterPaciente,
  atualizarPaciente,
  removerPaciente,
  buscarPacientePorCpf,
  loginPaciente
};
