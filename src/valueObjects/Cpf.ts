import { ICpf } from "../types";
import { isEmpty } from "../utils";

// TODO: Ajustar classe para o valueof ser uma função
export default class Cpf implements ICpf {
  private _valor: string;
  private _ehValido: true | string = true;

  constructor(nome: string) {
    nome = Cpf.formatar(nome);
    this.validar(nome);

    this._valor = nome;
  }

  set valor(v: string) {
    v = Cpf.formatar(v);
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
    return Cpf.sanitizar(this._valor);
  }

  private static sanitizar(valor: string): string {
    return valor.replace(/[^0-9]/g, "");
  }

  public static formatar(valor: string): string {
    const cpfSanitizado = this.sanitizar(valor);
    let cpfFormatado = cpfSanitizado;

    if (cpfSanitizado.length > 3) {
      cpfFormatado = cpfFormatado.slice(0, 3) + "." + cpfFormatado.slice(3);
    }
    if (cpfSanitizado.length > 6) {
      cpfFormatado = cpfFormatado.slice(0, 7) + "." + cpfFormatado.slice(7);
    }
    if (cpfSanitizado.length > 9) {
      cpfFormatado = cpfFormatado.slice(0, 11) + "-" + cpfFormatado.slice(11);
    }

    return cpfFormatado.slice(0, 14);
  }

  public validar(valor: string) {
    if (isEmpty(valor)) {
      this._ehValido = true;
      return;
    }
    const cpf = valor!.replace(/\D/g, ""); // Remove caracteres não permitidos
    if (cpf.length !== 11) {
      this._ehValido = "CPF inválido";
      return;
    }

    // Verifica se o CPF é uma sequência de números repetidos
    if (/^(\d)\1+$/.test(cpf)) {
      this._ehValido = "CPF inválido";
      return;
    }

    // Valida 1o digito
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) {
      this._ehValido = "CPF inválido";
      return;
    }

    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) {
      this._ehValido = "CPF inválido";
      return;
    }

    this._ehValido = true;
  }
}
