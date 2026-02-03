import { INome } from "../types";

export default class Nome implements INome {
  private _valor: string;
  private _ehValido: true | string = true;
  private _nomeDoCampo: string;
  constructor(nome: string, nomeDoCampo: string = "nome") {
    this._nomeDoCampo = nomeDoCampo;
    this.validar(nome);

    this._valor = this.sanitizar(nome);
  }

  set valor(v: string) {
    v = this.sanitizar(v);
    this.validar(v);

    this._valor = v;
  }

  get valor(): string {
    return this._valor;
  }

  get ehValido() {
    return this._ehValido;
  }

  private sanitizar(nome: string): string {
    return nome.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
  }

  public validar(valor: string) {
    if (!valor) {
      this._ehValido = true;
      return;
    }

    const arrayName = valor!.trim().split(" ");

    if (arrayName.length < 2) {
      this._ehValido = `O ${this._nomeDoCampo} deve possuir um sobrenome`;
      return;
    }

    this._ehValido = true;
  }
}
