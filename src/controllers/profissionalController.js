import jwt from 'jsonwebtoken';
import Profissional from '../models/Profissional.js';
import Paciente from '../models/Paciente.js';

// Campos permitidos para atualização
const camposPermitidos = ['cpf', 'email', 'nomeCompleto', 'senha', 'tipoAtuacao', 'valorConsulta', 'convenios', 'modalidades'];

// Criar profissional
const criarProfissional = async (req, res) => {
    try {
    const { cpf, email, crp } = req.body;

    const profissionalExistente = await Profissional.findOne({ $or: [{ cpf }, { email }, { crp }] });
    if (profissionalExistente) {
        return res.status(400).json({ erro: 'CPF, Email ou CRM/CRP já cadastrado no sistema' });
    }

    const novoProfissional = await Profissional.create(req.body);
    const profissionalSemSenha = novoProfissional.toObject();
    delete profissionalSemSenha.senha;

    res.status(201).json({ mensagem: 'Profissional cadastrado com sucesso', profissional: profissionalSemSenha });
    } catch (error) {
    res.status(400).json({ erro: 'Falha ao cadastrar profissional', detalhes: error.message });
    }
};

// Listar todos
const listarProfissionais = async (req, res) => {
    try {
    const profissionais = await Profissional.find().sort({ nomeCompleto: 1 }).select('-senha');
    res.status(200).json(profissionais);
    } catch (error) {
    res.status(500).json({ erro: 'Falha ao buscar profissionais', detalhes: error.message });
    }
};

// Obter por ID
const obterProfissional = async (req, res) => {
    try {
    const profissional = await Profissional.findById(req.params.id).select('-senha');
    if (!profissional) return res.status(404).json({ erro: 'Profissional não encontrado' });
    res.status(200).json(profissional);
    } catch (error) {
    res.status(500).json({ erro: 'Falha ao buscar profissional', detalhes: error.message });
    }
};

// Atualizar profissional
const atualizarProfissional = async (req, res) => {
    try {
    const { id } = req.params;
    const updates = {};

    camposPermitidos.forEach(campo => {
        if (req.body[campo] !== undefined) updates[campo] = req.body[campo];
    });

    const profissional = await Profissional.findById(id);
    if (!profissional) return res.status(404).json({ erro: 'Profissional não encontrado' });

    // Verifica duplicidade de CPF, email ou CRM/CRP
    if (updates.cpf || updates.email || updates.crp) {
        const conditions = [];
        if (updates.cpf) conditions.push({ cpf: updates.cpf });
        if (updates.email) conditions.push({ email: updates.email });
        if (updates.crp) conditions.push({ crp: updates.crp });

        const profissionalExistente = await Profissional.findOne({ _id: { $ne: id }, $or: conditions });
        if (profissionalExistente) {
        return res.status(400).json({ erro: 'CPF, Email ou CRM/CRP já está em uso por outro profissional' });
        }
    }

    Object.assign(profissional, updates);
    await profissional.save();

    const profissionalAtualizado = profissional.toObject();
    delete profissionalAtualizado.senha;

    res.status(200).json({ mensagem: 'Profissional atualizado com sucesso', profissional: profissionalAtualizado });
    } catch (error) {
    res.status(400).json({ erro: 'Falha ao atualizar profissional', detalhes: error.message });
    }
};

// Remover profissional
const removerProfissional = async (req, res) => {
    try {
    const profissional = await Profissional.findByIdAndDelete(req.params.id);
    if (!profissional) return res.status(404).json({ erro: 'Profissional não encontrado' });
    res.status(200).json({ mensagem: 'Profissional removido com sucesso' });
    } catch (error) {
    res.status(500).json({ erro: 'Falha ao remover profissional', detalhes: error.message });
    }
};

// Login de profissional
const loginProfissional = async (req, res) => {
    try {
    const { email, senha } = req.body;

    if (!email || !senha) return res.status(400).json({ erro: "Informe email e senha" });

    const profissional = await Profissional.findOne({ email }).select('+senha');
    if (!profissional) return res.status(404).json({ erro: "Profissional não encontrado" });

    const senhaValida = await profissional.compararSenha(senha);
    if (!senhaValida) return res.status(401).json({ erro: "Senha incorreta" });

    const token = jwt.sign(
        { id: profissional._id, email: profissional.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    const profissionalData = profissional.toObject();
    delete profissionalData.senha;

    res.status(200).json({
        mensagem: "Login realizado com sucesso",
        token,
        profissional: profissionalData,
    });
    } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no servidor" });
    }
};

// Listar pacientes de um profissional
// Listar pacientes de um profissional
export const listarPacientesDoProfissional = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o profissional existe
    const profissional = await Profissional.findById(id);
    if (!profissional) {
      return res.status(404).json({ erro: 'Profissional não encontrado' });
    }

    // Busca pacientes vinculados a esse profissional
    const pacientes = await Paciente.find({ profissional: id });

    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao listar pacientes', detalhes: error.message });
  }
};



export default {
    criarProfissional,
    listarProfissionais,
    obterProfissional,
    atualizarProfissional,
    removerProfissional,
    loginProfissional,
    listarPacientesDoProfissional
};
