import { IMoeda } from "../types";
import Numero from "./Numero";

export interface Options {
  prefix?: string;
  suffix?: string;
  separator: string;
  decimal: string;
  precision?: number;
  min?: number;
  max?: number;
}

export const FORMATO_PADRAO_BR: Options = {
  decimal: ",",
  separator: ".",
  prefix: "R$ ",
  precision: 2,
  min: 0,
};

export default class Moeda extends Numero implements IMoeda {
  constructor(
    valor: string | number | null,
    formatador: Partial<Options> = FORMATO_PADRAO_BR
  ) {
    super(valor, { ...FORMATO_PADRAO_BR, ...formatador });
  }
}
