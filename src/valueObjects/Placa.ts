import { IPlaca } from "../types";
import { isEmpty } from "../utils";

export default class Placa implements IPlaca {
  private _valor: string;
  private _ehValido: true | string = true;

  constructor(value?: string) {
    value = Placa.formatar(value || "");
    this.validar(value);

    this._valor = value;
  }

  set valor(v: string) {
    v = Placa.formatar(v);
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
    return Placa.sanitizar(this._valor);
  }

  private static sanitizar(valor: string): string {
    if (valor.length <= 3) {
      return valor.toUpperCase().replace(/[^A-Z]/g, "");
    }

    return valor.toUpperCase().replace(/[^A-Z0-9]/g, "");
  }

  public static formatar(valor: string): string {
    const placaSanitizado = this.sanitizar(valor);
    let placaFormatado = placaSanitizado;

    if (placaSanitizado.length > 3) {
      placaFormatado =
        placaFormatado.slice(0, 3) + "-" + placaFormatado.slice(3);
    }

    return placaFormatado.slice(0, 8);
  }

  public validar(valor: string) {
    if (isEmpty(valor)) {
      this._ehValido = true;
      return;
    }

    const reg = new RegExp(/[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/);
    const placa = valor!.replace(/[^A-Z0-9]/g, ""); // Remove caracteres não permitidos
    if (!reg.test(placa)) {
      this._ehValido = "Placa inválida";
      return;
    }

    this._ehValido = true;
  }
}
