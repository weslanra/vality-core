import { ICpfCnpj } from "../types";
import { isEmpty } from "../utils";
import Cnpj from "./Cnpj";
import Cpf from "./Cpf";
export default class CpfCnpj implements ICpfCnpj {
  private _valor: string;
  private _ehValido: true | string = true;

  constructor(nome: string) {
    nome = CpfCnpj.formatar(nome);
    this.validar(nome);

    this._valor = nome;
  }

  set valor(v: string) {
    v = CpfCnpj.formatar(v);
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
    return CpfCnpj.sanitizar(this._valor);
  }

  get tipo() {
    const valorSanitizado = CpfCnpj.sanitizar(this._valor);
    if (valorSanitizado.length === 11) {
      return "CPF";
    } else if (valorSanitizado.length === 14) {
      return "CNPJ";
    } else {
      return null;
    }
  }

  private static sanitizar(valor: string): string {
    return valor.replace(/[^0-9]/g, "");
  }

  private static formatarCpf(valor: string): string {
    let valorFormatado = valor;
    if (valor.length > 3) {
      valorFormatado =
        valorFormatado.slice(0, 3) + "." + valorFormatado.slice(3);
    }
    if (valor.length > 6) {
      valorFormatado =
        valorFormatado.slice(0, 7) + "." + valorFormatado.slice(7);
    }
    if (valor.length > 9) {
      valorFormatado =
        valorFormatado.slice(0, 11) + "-" + valorFormatado.slice(11);
    }

    return valorFormatado.slice(0, 14);
  }

  private static formatarCnpj(valor: string): string {
    let valorFormatado = valor;
    if (valor.length > 2) {
      valorFormatado = valor.slice(0, 2) + "." + valor.slice(2);
    }
    if (valor.length > 5) {
      valorFormatado =
        valorFormatado.slice(0, 6) + "." + valorFormatado.slice(6);
    }
    if (valor.length > 8) {
      valorFormatado =
        valorFormatado.slice(0, 10) + "/" + valorFormatado.slice(10);
    }
    if (valor.length > 12) {
      valorFormatado =
        valorFormatado.slice(0, 15) + "-" + valorFormatado.slice(15);
    }

    return valorFormatado.slice(0, 18);
  }

  public static formatar(valor: string): string {
    const valorSanitizado = this.sanitizar(valor);
    let valorFormatado = valorSanitizado;

    if (valorSanitizado.length <= 11) {
      valorFormatado = this.formatarCpf(valorSanitizado);
    } else {
      valorFormatado = this.formatarCnpj(valorSanitizado);
    }

    return valorFormatado;
  }

  public validar(valor: string) {
    if (isEmpty(valor)) {
      this._ehValido = true;
      return;
    }

    const cleanedValue = valor.replace(/\D/g, "");
    if (cleanedValue.length === 11) {
      const cpf = new Cpf(valor);
      this._ehValido = cpf.ehValido;
      return;
    } else if (cleanedValue.length > 11 && cleanedValue.length <= 14) {
      const cnpj = new Cnpj(valor);
      this._ehValido = cnpj.ehValido;
      return;
    } else {
      this._ehValido = "Insira um CPF ou CNPJ válido";
    }
  }
}
