import { recintoAdequado } from "./utils/recintoAdequado.js";

class RecintosZoo {
  analisaRecintos(animal, quantidade) {
    return recintoAdequado(animal, quantidade);
  }
}

export { RecintosZoo as RecintosZoo };
