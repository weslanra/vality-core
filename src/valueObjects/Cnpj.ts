import { ICnpj } from "../types";
import { isEmpty } from "../utils";

// TODO: Ajustar classe para o valueof ser uma função
export default class Cnpj implements ICnpj {
  private _valor: string;
  private _ehValido: true | string = true;

  constructor(nome: string) {
    nome = Cnpj.formatar(nome);
    this.validar(nome);

    this._valor = nome;
  }

  set valor(v: string) {
    v = Cnpj.formatar(v);
    this.validar(v);

    this._valor = v;
  }

  get valor(): string {
    return this._valor;
  }

  get ehValido() {
    return this._ehValido;
  }

  valueOf() {
    return Cnpj.sanitizar(this._valor);
  }

  private static sanitizar(valor: string): string {
    return valor.replace(/[^0-9]/g, "");
  }

  public static formatar(valor: string): string {
    const cnpjSanitizado = this.sanitizar(valor);
    let cnpjFormatado = cnpjSanitizado;

    if (cnpjSanitizado.length > 2) {
      cnpjFormatado =
        cnpjSanitizado.slice(0, 2) + "." + cnpjSanitizado.slice(2);
    }
    if (cnpjSanitizado.length > 5) {
      cnpjFormatado = cnpjFormatado.slice(0, 6) + "." + cnpjFormatado.slice(6);
    }
    if (cnpjSanitizado.length > 8) {
      cnpjFormatado =
        cnpjFormatado.slice(0, 10) + "/" + cnpjFormatado.slice(10);
    }
    if (cnpjSanitizado.length > 12) {
      cnpjFormatado =
        cnpjFormatado.slice(0, 15) + "-" + cnpjFormatado.slice(15);
    }

    return cnpjFormatado.slice(0, 18);
  }

  public validar(valor: string) {
    if (isEmpty(valor)) {
      this._ehValido = true;
      return;
    }
    const cleanedValue = valor!.replace(/\D/g, ""); // Remove non-digit characters
    if (cleanedValue.length === 14) {
      // CNPJ validation
      const cnpj = cleanedValue.padStart(14, "0");
      let sum = 0;
      let weight = 2;

      for (let i = 11; i >= 0; i--) {
        sum += parseInt(cnpj.charAt(i)) * weight;
        weight = weight === 9 ? 2 : weight + 1;
      }

      const mod = sum % 11;
      const digit1 = mod < 2 ? 0 : 11 - mod;

      if (parseInt(cnpj.charAt(12)) !== digit1) {
        this._ehValido = "Insira um CNPJ válido";
        return;
      }

      sum = 0;
      weight = 2;

      for (let i = 12; i >= 0; i--) {
        sum += parseInt(cnpj.charAt(i)) * weight;
        weight = weight === 9 ? 2 : weight + 1;
      }

      const mod2 = sum % 11;
      const digit2 = mod2 < 2 ? 0 : 11 - mod2;

      if (parseInt(cnpj.charAt(13)) !== digit2) {
        this._ehValido = "Insira um CNPJ válido";
        return;
      }

      this._ehValido = true;
      return;
    }
    this._ehValido = "Insira um CNPJ válido";
  }
}
