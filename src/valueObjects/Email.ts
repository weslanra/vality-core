import { IEmail } from "../types";
import { isEmpty } from "../utils";

export default class Email implements IEmail {
  private _valor: string;
  private _ehValido: true | string = true;

  constructor(nome: string) {
    this.validar(nome);
    let valorSanitizado = this.sanitizar(nome);
    this.validar(valorSanitizado);

    this._valor = nome;
    this._valor = valorSanitizado;
  }

  set valor(v: string) {
    let valorSanitizado = this.sanitizar(v);
    this.validar(valorSanitizado);

    this._valor = valorSanitizado;
  }

  get valor(): string {
    return this._valor;
  }

  get ehValido() {
    return this._ehValido;
  }

  valueOf(): string {
    return this._valor;
  }

  public sanitizar(valor: string) {
    let sanitizado = valor.replace(/\s+/g, "");

    sanitizado = sanitizado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return sanitizado;
  }

  public validar(valor: string) {
    if (isEmpty(valor)) {
      this._ehValido = true;
      return;
    }

    const re =
      /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i;

    if (re.test(String(valor))) {
      this._ehValido = true;
      return;
    }
    this._ehValido = "O campo Email deve ser um email válido";
  }
}
