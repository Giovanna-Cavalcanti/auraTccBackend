// controllers/atividadeController.js psicólogo cria uma nova atividade pro pacient; paciente vê suas atividades; paciente atualiza o progresso; psicólogo pode listar todas as atividades criadas por ele; (opcional) psicólogo deleta/edita uma atividade

import Atividade from "../models/Atividade.js";

const atividadeController = {
  // Psicólogo cria atividade para paciente
  criarAtividade: async (req, res) => {
    try {
      const { psicologoId, pacienteId, titulo, descricao, prazo } = req.body;

      if (!psicologoId || !pacienteId || !titulo || !descricao) {
        return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
      }

      const novaAtividade = await Atividade.create({
        psicologoId,
        pacienteId,
        titulo,
        descricao,
        prazo,
      });

      res.status(201).json({
        mensagem: "Atividade criada com sucesso!",
        atividade: novaAtividade,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao criar atividade." });
    }
  },

  // Paciente visualiza suas atividades
  obterAtividadesPorPaciente: async (req, res) => {
    try {
      const { pacienteId } = req.params;
      const atividades = await Atividade.find({ pacienteId }).sort({
        dataCriacao: -1,
      });
      res.json(atividades);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao buscar atividades." });
    }
  },

  // Psicólogo visualiza todas as atividades que criou
  obterAtividadesPorPsicologo: async (req, res) => {
    try {
      const { psicologoId } = req.params;
      const atividades = await Atividade.find({ psicologoId }).populate("pacienteId", "nome email");
      res.json(atividades);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao buscar atividades do psicólogo." });
    }
  },

  // Paciente atualiza progresso e observação
  atualizarProgresso: async (req, res) => {
    try {
      const { id } = req.params;
      const { progresso, observacaoPaciente } = req.body;

      const atividade = await Atividade.findById(id);
      if (!atividade) return res.status(404).json({ erro: "Atividade não encontrada." });

      if (progresso !== undefined) atividade.progresso = progresso;
      if (observacaoPaciente) atividade.observacaoPaciente = observacaoPaciente;

      // Atualiza status automaticamente
      if (progresso === 100) atividade.status = "concluída";
      else if (progresso > 0) atividade.status = "em andamento";
      else atividade.status = "pendente";

      await atividade.save();

      res.json({ mensagem: "Progresso atualizado com sucesso!", atividade });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao atualizar progresso." });
    }
  },

  // Obter uma atividade específica pelo ID
obterAtividadePorId: async (req, res) => {
  try {
    const { id } = req.params;
    const atividade = await Atividade.findById(id)
      .populate("psicologoId", "nome email")
      .populate("pacienteId", "nome email");

    if (!atividade) {
      return res.status(404).json({ erro: "Atividade não encontrada." });
    }

    res.json(atividade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar atividade." });
  }
},

  // Psicólogo ou sistema pode deletar atividade
  deletarAtividade: async (req, res) => {
    try {
      const { id } = req.params;
      const atividadeRemovida = await Atividade.findByIdAndDelete(id);

      if (!atividadeRemovida) {
        return res.status(404).json({ erro: "Atividade não encontrada." });
      }

      res.json({ mensagem: "Atividade removida com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao deletar atividade." });
    }
  },
};


export default atividadeController;
