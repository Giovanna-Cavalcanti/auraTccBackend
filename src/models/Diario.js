import mongoose from "mongoose";

const diarioSchema = new mongoose.Schema({
    pacienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paciente",
        required: true,
    },
    conteudo: {
        type: String,
        required: true,
    },
    dataCriacao: {
        type: Date,
    default: Date.now,
    },
    dataAtualizacao: {
        type: Date,
    },
});

export default mongoose.model("Diario", diarioSchema);
