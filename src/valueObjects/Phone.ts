import { IPhone } from "../types";
import { isEmpty } from "../utils";

/** Celular brasileiro: (DDD) 9 XXXX-XXXX */
export const FORMATO_TELEFONE_PADRAO_BR = "(##) # ####-####";

export default class Phone implements IPhone {
  private _valor: string;
  private _ehValido: true | string = true;
  private _formato: string;

  constructor(valor: string, formato: string = FORMATO_TELEFONE_PADRAO_BR) {
    this._formato = formato;
    const formatado = Phone.formatar(valor, this._formato);
    this.validar(formatado);
    this._valor = formatado;
  }

  get formato(): string {
    return this._formato;
  }

  set valor(v: string) {
    v = Phone.formatar(v, this._formato);
    this.validar(v);
    this._valor = v;
  }

  get valor(): string {
    return this._valor;
  }

  get ehValido(): true | string {
    return this._ehValido;
  }

  valueOf(): string {
    return Phone.sanitizar(this._valor, this._formato);
  }

  private static quantidadeDigitos(formato: string): number {
    return (formato.match(/#/g) ?? []).length;
  }

  private static sanitizar(valor: string, formato: string): string {
    return valor.replace(/\D/g, "").slice(0, Phone.quantidadeDigitos(formato));
  }

  public static formatar(
    valor: string,
    formato: string = FORMATO_TELEFONE_PADRAO_BR
  ): string {
    const digitos = Phone.sanitizar(valor, formato);
    let resultado = "";
    let indice = 0;

    for (const caractere of formato) {
      if (indice >= digitos.length) break;

      if (caractere === "#") {
        resultado += digitos[indice];
        indice += 1;
        continue;
      }

      resultado += caractere;
    }

    return resultado;
  }

  public validar(valor: string): void {
    if (isEmpty(valor)) {
      this._ehValido = true;
      return;
    }

    const digitos = Phone.sanitizar(valor, this._formato);
    if (digitos.length !== Phone.quantidadeDigitos(this._formato)) {
      this._ehValido = "Telefone inválido";
      return;
    }

    this._ehValido = true;
  }
}
