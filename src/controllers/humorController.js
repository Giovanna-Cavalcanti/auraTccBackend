import Humor from "../models/Humor.js";

const humorController = {
  // Criar ou atualizar humor do dia
  registrarHumor: async (req, res) => {
    try {
      const { pacienteId, humor } = req.body;

      if (!pacienteId) {
        return res.status(400).json({ erro: "Informe o pacienteId." });
      }

      // Pega o início do dia pra garantir um registro por dia
      const inicioDoDia = new Date();
      inicioDoDia.setHours(0, 0, 0, 0);

      const fimDoDia = new Date();
      fimDoDia.setHours(23, 59, 59, 999);

      // Verifica se já existe um humor hoje
      let registro = await Humor.findOne({
        pacienteId,
        dataRegistro: { $gte: inicioDoDia, $lte: fimDoDia },
      });

      if (registro) {
        // Atualiza o humor existente
        registro.humor = humor || "";
        registro.dataAtualizacao = new Date();
        await registro.save();

        return res.json({
          mensagem: "Humor atualizado com sucesso!",
          humor: registro,
        });
      }

      // Cria novo registro se ainda não existe no dia
      const novoHumor = await Humor.create({ pacienteId, humor });
      res.status(201).json({
        mensagem: "Humor registrado com sucesso!",
        humor: novoHumor,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao registrar humor." });
    }
  },

  // Obter todos os registros de humor de um paciente
  listarHumores: async (req, res) => {
    try {
      const { pacienteId } = req.params;
      const humores = await Humor.find({ pacienteId }).sort({ dataRegistro: -1 });
      res.json(humores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao buscar registros de humor." });
    }
  },

// Visualizar humor de um dia específico (sem precisar passar horário)
obterHumorDoDia: async (req, res) => {
  try {
    const { pacienteId, data } = req.params;

    // Interpreta a data como local (sem UTC)
    const [ano, mes, dia] = data.split("-").map(Number);
    const inicioDoDia = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
    const fimDoDia = new Date(ano, mes - 1, dia, 23, 59, 59, 999);

    const humor = await Humor.findOne({
      pacienteId,
      dataRegistro: { $gte: inicioDoDia, $lte: fimDoDia },
    });

    if (!humor) {
      return res.status(404).json({ mensagem: "Nenhum registro encontrado para essa data." });
    }

    res.json(humor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar humor do dia." });
  }
},


  // Deletar registro (opcional)
  deletarHumor: async (req, res) => {
    try {
      const { id } = req.params;
      const removido = await Humor.findByIdAndDelete(id);

      if (!removido) {
        return res.status(404).json({ erro: "Registro de humor não encontrado." });
      }

      res.json({ mensagem: "Registro de humor deletado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao deletar registro de humor." });
    }
  },
};

export default humorController;
