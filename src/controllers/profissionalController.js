import jwt from 'jsonwebtoken';
import Profissional from '../models/Profissional.js';
import Paciente from '../models/Paciente.js';

// Campos permitidos para atualização
const camposPermitidos = ['cpf', 'email', 'nomeCompleto', 'senha', 'tipoAtuacao', 'valorConsulta', 'convenios', 'modalidades','descricao', 'localizacao' ];

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
const listarPacientesDoProfissional = async (req, res) => {
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

const completarCadastro = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, localizacao } = req.body;

    const profissional = await Profissional.findById(id);
    if (!profissional) {
      return res.status(404).json({ erro: 'Profissional não encontrado' });
    }

    profissional.descricao = descricao || profissional.descricao;
    profissional.localizacao = localizacao || profissional.localizacao;
    await profissional.save();

    const atualizado = profissional.toObject();
    delete atualizado.senha;

    res.status(200).json({
      mensagem: 'Cadastro complementado com sucesso',
      profissional: atualizado
    });
  } catch (error) {
    res.status(400).json({
      erro: 'Falha ao completar cadastro',
      detalhes: error.message
    });
  }
};

const responderSolicitacao = async (req, res) => {
  try {
    const { profissionalId, pacienteId } = req.params;
    const { acao } = req.body; // "aceitar" ou "recusar"

    const profissional = await Profissional.findById(profissionalId);
    if (!profissional) return res.status(404).json({ erro: 'Profissional não encontrado' });

    const paciente = await Paciente.findById(pacienteId);
    if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado' });

    if (!paciente.solicitacao || paciente.solicitacao.status !== 'pendente') {
      return res.status(400).json({ erro: 'Nenhuma solicitação pendente para este paciente' });
    }

    if (paciente.solicitacao.profissional.toString() !== profissionalId) {
      return res.status(403).json({ erro: 'Este profissional não é o destinatário da solicitação' });
    }

    if (acao === 'aceitar') {
      paciente.profissional = profissionalId;
      paciente.solicitacao.status = 'aceita';
      await paciente.save();

      return res.status(200).json({ mensagem: 'Solicitação aceita, vínculo criado', paciente });
    }

    if (acao === 'recusar') {
      paciente.solicitacao.status = 'recusada';
      await paciente.save();

      return res.status(200).json({ mensagem: 'Solicitação recusada', paciente });
    }

    return res.status(400).json({ erro: 'Ação inválida. Use "aceitar" ou "recusar".' });
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao responder solicitação', detalhes: error.message });
  }
};

const listarSolicitacoesPendentes = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se profissional existe
    const profissional = await Profissional.findById(id);
    if (!profissional) return res.status(404).json({ erro: 'Profissional não encontrado' });

    // Busca todos os pacientes com solicitação pendente para este profissional
    const solicitacoes = await Paciente.find({
      'solicitacao.profissional': id,
      'solicitacao.status': 'pendente'
    }).select('nomeCompleto email cpf solicitacao');

    if (solicitacoes.length === 0) {
      return res.status(200).json({ mensagem: 'Nenhuma solicitação pendente encontrada' });
    }

    res.status(200).json(solicitacoes);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao listar solicitações pendentes', detalhes: error.message });
  }
};

const desvincularPaciente = async (req, res) => {
  try {
    const { profissionalId, pacienteId } = req.params;

    const profissional = await Profissional.findById(profissionalId);
    const paciente = await Paciente.findById(pacienteId);

    if (!profissional || !paciente) {
      return res.status(404).json({ erro: "Profissional ou paciente não encontrado." });
    }

    // Verifica se o paciente está vinculado a este profissional
    if (paciente.profissional?.toString() !== profissionalId) {
      return res.status(400).json({ erro: "Este paciente não está vinculado a este profissional." });
    }

    // Remove vínculo do paciente
    paciente.profissional = null;
    paciente.solicitacao = { profissional: null, status: null };
    await paciente.save();

    res.status(200).json({ mensagem: "Vínculo com paciente removido com sucesso." });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao desfazer vínculo.", detalhe: erro.message });
  }
};


export default {
    criarProfissional,
    listarProfissionais,
    obterProfissional,
    atualizarProfissional,
    removerProfissional,
    loginProfissional,
    listarPacientesDoProfissional,
    completarCadastro,
    responderSolicitacao,
    listarSolicitacoesPendentes,
    desvincularPaciente
};
