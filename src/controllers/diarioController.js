import Diario from "../models/Diario.js";

// Criar nova anotação
const criarAnotacao = async (req, res) => {
    try {
        const { pacienteId, conteudo } = req.body;

    if (!pacienteId || !conteudo) {
        return res.status(400).json({ erro: "Informe pacienteId e conteudo." });
    }

    const novaAnotacao = await Diario.create({ pacienteId, conteudo });
    res.status(201).json({
        mensagem: "Anotação criada com sucesso!",
        anotacao: novaAnotacao,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao salvar anotação." });
    }
};

// Obter todas as anotações de um paciente
const obterAnotacoesPorPaciente = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        const anotacoes = await Diario.find({ pacienteId }).sort({
        dataCriacao: -1,
    });

        res.json(anotacoes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao buscar anotações." });
    }
};

// Editar uma anotação existente
const atualizarAnotacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { conteudo } = req.body;

    const anotacaoAtualizada = await Diario.findByIdAndUpdate(
      id,
      { conteudo, dataAtualizacao: new Date() },
      { new: true }
    );

    if (!anotacaoAtualizada) {
      return res.status(404).json({ erro: "Anotação não encontrada." });
    }

    res.json({
      mensagem: "Anotação atualizada com sucesso!",
      anotacao: anotacaoAtualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar anotação." });
  }
};

// Deletar uma anotação
const deletarAnotacao = async (req, res) => {
  try {
    const { id } = req.params;
    const anotacaoRemovida = await Diario.findByIdAndDelete(id);

    if (!anotacaoRemovida) {
      return res.status(404).json({ erro: "Anotação não encontrada." });
    }

    res.json({ mensagem: "Anotação deletada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao deletar anotação." });
  }
};

// Obter uma anotação específica pelo ID
const obterAnotacaoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const anotacao = await Diario.findById(id);

    if (!anotacao) {
      return res.status(404).json({ erro: "Anotação não encontrada." });
    }

    res.json(anotacao);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar anotação." });
  }
};


export default{
    criarAnotacao,
    obterAnotacoesPorPaciente,
    atualizarAnotacao,
    deletarAnotacao, 
    obterAnotacaoPorId
}