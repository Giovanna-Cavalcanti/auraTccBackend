import mongoose from "mongoose";

const humorSchema = new mongoose.Schema({
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
    required: true,
  },
  humor: {
    type: String,
    enum: ["Muito feliz", "Feliz", "Neutro", "Triste", "Muito triste", ""], // pode deixar em branco
    default: "",
  },
  dataRegistro: {
    type: Date,
    default: Date.now,
  },
  dataAtualizacao: {
    type: Date,
  },
});

// Um paciente só pode ter um registro por dia
humorSchema.index(
  { pacienteId: 1, dataRegistro: 1 },
  { unique: true, partialFilterExpression: { dataRegistro: { $exists: true } } }
);

export default mongoose.model("Humor", humorSchema);
