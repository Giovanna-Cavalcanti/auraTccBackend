import Triagem from "../models/Triagem.js";

// Criar nova triagem
const criarTriagem = async (req, res) => {
  try {
    const { pacienteId, motivo, tempoSintomas, frequencia, genero } = req.body;

    if (!pacienteId || !motivo || !tempoSintomas || !frequencia || !genero) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }

    const novaTriagem = await Triagem.create({
      pacienteId,
      motivo,
      tempoSintomas,
      frequencia,
      genero,
    });

    res.status(201).json({
      mensagem: "Triagem salva com sucesso!",
      triagem: novaTriagem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao salvar triagem." });
  }
};

// Buscar triagens de um paciente
const obterTriagensPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    const triagens = await Triagem.find({ pacienteId }).sort({ dataResposta: -1 });

    if (!triagens.length) {
      return res.status(404).json({ mensagem: "Nenhuma triagem encontrada." });
    }

    res.json(triagens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar triagens." });
  }
};

// Atualizar triagem existente de um paciente
const atualizarTriagem = async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const { motivo, tempoSintomas, frequencia, genero } = req.body;

    const triagemAtualizada = await Triagem.findOneAndUpdate(
      { pacienteId },
      { motivo, tempoSintomas, frequencia, genero },
      { new: true } // retorna o documento atualizado
    );

    if (!triagemAtualizada) {
      return res.status(404).json({ erro: "Triagem não encontrada para este paciente." });
    }

    res.json({
      mensagem: "Triagem atualizada com sucesso!",
      triagem: triagemAtualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar triagem." });
  }
};

export default{
  criarTriagem,
  obterTriagensPorPaciente,
  atualizarTriagem
};