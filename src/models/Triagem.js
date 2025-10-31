import mongoose from "mongoose";

const triagemSchema = new mongoose.Schema({
pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente", // faz referência ao modelPaciente
    required: true,
},
motivo: {
    type: String,
    enum: [
        "Lidar melhor com emoções",
        "Ansiedade",
        "Problemas familiares",
        "Outro",
    ],
    required: true,
},
tempoSintomas: {
    type: String,
    enum: [
        "Menos de 1 semana",
        "1 a 4 semanas",
        "1 a 3 meses",
        "Mais de 3 meses",
    ],
    required: true,
},
frequencia: {
    type: String,
    enum: [
        "Raramente",
        "Algumas vezes por semana",
        "Todos os dias",
        "Não sei dizer",
    ],
    required: true,
},
genero: {
    type: String,
    enum: ["Feminino", "Masculino", "Sem preferência"],
    required: true,
},
dataResposta: {
    type: Date,
    default: Date.now,
},
});

export default mongoose.model("Triagem", triagemSchema);
