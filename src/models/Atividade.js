// models/Atividade.js Esse model define quem criou, pra quem foi enviada, qual é a descrição, prazo e progresso
import mongoose from "mongoose";

const atividadeSchema = new mongoose.Schema({
  psicologoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profissional",
    required: true,
  },
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
    required: true,
  },
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  descricao: {
    type: String,
    required: true,
    trim: true,
  },
  prazo: {
    type: Date,
    required: false,
  },
  progresso: {
    type: Number,
    default: 0, // Representa % (0 a 100)
    min: 0,
    max: 100,
  },
  observacaoPaciente: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pendente", "em andamento", "concluída"],
    default: "pendente",
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Atividade", atividadeSchema);
