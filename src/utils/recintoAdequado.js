import { recintos } from "../data/recintos.js";
import { animais } from "../data/animais.js";

export function recintoAdequado(animal, quantidade) {
  // Validação da quantidade
  if (quantidade <= 0 || quantidade / 1 !== quantidade) {
    return {
      erro: "Quantidade inválida",
    };
  }

  let especie = animais.find((a) => {
    return a.nome == animal.toLowerCase();
  });

  // Validação do animal
  if (!especie) {
    return {
      erro: "Animal inválido",
    };
  }

  const biomaDaEspecie = especie.bioma;

  const recintosComBiomaAdequado = recintos.filter(recinto => {
    return recinto.bioma.some(b => biomaDaEspecie.includes(b))
  });

  const recintosViaveis = recintosComBiomaAdequado.filter((recinto) => {
    const espacoDisponivel = recinto.tamanho - recinto.espacoOcupado;
    const animaisExistentes = recinto.animais;
    const dadosDosAnimaisExistentes = animais.find(
      (a) => a.nome == animaisExistentes[0]
    );

    // Verifica se o recinto é grande o suficiente
    let espacoNecessario = quantidade * especie.tamanho;

    // Conta um espaço extra caso existiam animais de uma espécie diferente no recinto
    if (animaisExistentes.length > 0) {
      if (dadosDosAnimaisExistentes.nome !== especie.nome) {
        ++espacoNecessario;
      }
    }

    // Regras caso exista outra espécie no recinto

    if (
      animaisExistentes.length > 0 &&
      dadosDosAnimaisExistentes.nome !== especie.nome
    ) {
      // Carnívoros só podem ficar no mesmo recinto que animais da mesma espécie
      if (especie.carnivoro || dadosDosAnimaisExistentes.carnivoro) {
        return false;
      }

      // Hipopótamos só toleram outras espécies estando num recinto com savana e rio
      if (especie.nome == "hipopotamo" && !recinto.bioma.includes("rio")) {
        return false;
      }
    }

    // Macacos só podem ficar em um recinto se tiver outro animal, da mesma espécie ou de uma diferente
    if (
      especie.nome == "macaco" &&
      quantidade === 1 &&
      animaisExistentes.length == 0
    ) {
      return false;
    }

    // Verifica se há espaço suficiente
    if (espacoNecessario > espacoDisponivel) {
      return false;
    }

    return true;
  });

  if (recintosViaveis.length === 0) {
    return {
      erro: "Não há recinto viável",
    };
  }

  // Prepara o resultado com a lista de recintos viáveis
  const resultado = recintosViaveis.map((recinto) => {
    const tamanhoTotal = recinto.tamanho;
    const espacoNecessario =
      quantidade * especie.tamanho +
      recinto.espacoOcupado +
      (recinto.animais.length > 0 && especie.nome !== recinto.animais[0]
        ? 1
        : 0);
    const espacoLivre = tamanhoTotal - espacoNecessario;

    return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${tamanhoTotal})`;
  });

  return { recintosViaveis: resultado };
}
