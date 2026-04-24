import { IMoeda } from "../types";
import Numero from "./Numero";

export interface MoedaOptions {
  prefix?: string;
  suffix?: string;
  separator: string;
  decimal: string;
  precision?: number;
  min?: number;
  max?: number;
}

export const FORMATO_MOEDA_PADRAO_BR: MoedaOptions = {
  decimal: ",",
  separator: ".",
  prefix: "R$ ",
  precision: 2,
  min: 0,
};

export default class Moeda extends Numero implements IMoeda {
  constructor(
    valor: string | number | null,
    formatador: Partial<MoedaOptions> = FORMATO_MOEDA_PADRAO_BR
  ) {
    super(valor, { ...FORMATO_MOEDA_PADRAO_BR, ...formatador });
  }
}
