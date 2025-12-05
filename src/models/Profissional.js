import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ProfissionalSchema = new mongoose.Schema({
    cpf: {
    type: String,
    required: [true, 'CPF é obrigatório'],
    unique: true,
    trim: true,
    validate: {
        validator: (v) => /^\d{11}$/.test(v),
        message: 'CPF deve conter exatamente 11 dígitos numéricos'
    }
    },
    nomeCompleto: {
    type: String,
    required: [true, 'Nome completo é obrigatório'],
    trim: true,
    maxLength: [100, 'Nome não pode exceder 100 caracteres']
    },
  crp: { // CRM/CRP
    type: String,
    required: [true, 'CRP é obrigatório'],
    unique: true,
    trim: true
    },
    email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Email inválido'
    }
    },
    senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
    select: false
    },
    tipoAtuacao: {
    type: String,
    enum: ['clinica', 'atendimento próprio'],
    required: [true, 'Tipo de atuação é obrigatório']
    },
    valorConsulta: {
    type: String,
    enum: ['100-150', '200-250', '300-350', '400+'],
    required: [true, 'Valor da consulta é obrigatório']
    },
    convenios: {
    type: [String],
    enum: ['unimed', 'bradesco', 'amil', 'sulamerica', 'hapvida'],
    default: []
    },
    modalidadesAtendimento: {
    type: [String],
    enum: ['hibrido', 'online', 'presencial'],
    default: []
    },
    descricao: {
    type: String,
    trim: true,
    maxLength: [1000, 'A descrição não pode ultrapassar 1000 caracteres'],
    default: ''
    },
    localizacao: {
    type: String,
    trim: true,
    maxLength: [200, 'A localização não pode ultrapassar 200 caracteres'],
    default: ''
    },
    telefone: {
    type: String,
    trim: true,
    maxLength: [20, 'Telefone não pode ultrapassar 20 caracteres'],
    default: ''
    },
    dataCadastro: {
    type: Date,
    default: Date.now,
    immutable: true
    }
}, {
    versionKey: false,
    timestamps: false
});

// Middleware unificado: remove formatação do CPF e aplica hash da senha
ProfissionalSchema.pre('save', async function(next) {
    try {
    if (this.cpf) this.cpf = this.cpf.replace(/\D/g, '');
    if (this.isModified('senha')) {
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
    }
    next();
    } catch (err) {
    next(err);
    }
});

// Método para comparar senha em login
ProfissionalSchema.methods.compararSenha = async function(senhaDigitada) {
    return bcrypt.compare(senhaDigitada, this.senha);
};

// Índices para melhor performance
ProfissionalSchema.index({ cpf: 1 }, { unique: true });
ProfissionalSchema.index({ crp: 1 }, { unique: true });
ProfissionalSchema.index({ email: 1 }, { unique: true });
ProfissionalSchema.index({ nomeCompleto: 1 });

const Profissional = mongoose.model('Profissional', ProfissionalSchema);

export default Profissional;
