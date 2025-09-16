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

// Vincular paciente a um profissional
const vincularProfissional = async (req, res) => {
  try {
    const { pacienteId, profissionalId } = req.params;

    // Verifica se paciente existe
    const paciente = await Paciente.findById(pacienteId);
    if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });

    // Verifica se profissional existe
    const profissional = await Profissional.findById(profissionalId);
    if (!profissional) return res.status(404).json({ erro: 'Profissional não encontrado' });

    // Atualiza o vínculo
    paciente.profissional = profissionalId;
    await paciente.save();

    res.status(200).json({ mensagem: 'Profissional vinculado com sucesso', paciente });
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao vincular profissional', detalhes: error.message });
  }
};

// Mostrar profissional vinculado a um paciente
export const mostrarProfissionalDoPaciente = async (req, res) => {
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


export default {
  criarPaciente,
  listarPacientes,
  obterPaciente,
  atualizarPaciente,
  removerPaciente,
  buscarPacientePorCpf,
  loginPaciente,
  vincularProfissional,
  mostrarProfissionalDoPaciente
};
