import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const PacienteSchema = new mongoose.Schema({
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
    select: false // evita retornar senha em consultas por padrão
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

// Pré-processamento para remover formatação do CPF
PacienteSchema.pre('save', function(next) {
  if (this.cpf) {
    this.cpf = this.cpf.replace(/\D/g, '');
  }
  next();
});

// Middleware para hash da senha antes de salvar
PacienteSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senha em login
PacienteSchema.methods.compararSenha = async function(senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

// Índices para melhor performance
PacienteSchema.index({ cpf: 1 }, { unique: true });
PacienteSchema.index({ email: 1 }, { unique: true });
PacienteSchema.index({ nomeCompleto: 1 });

const Paciente = mongoose.model('Paciente', PacienteSchema);

export default Paciente;