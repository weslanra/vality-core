import { ICnpj } from "../types";
import { isEmpty } from "../utils";

const TAMANHO_CNPJ = 14;

/**
 * DOCS: https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/cnpj/cnpj-alfanumerico.pdf
 * 
 * NOTE: Essa classe foi contruida com base na documentação da receita federal
 */
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
    return valor
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, TAMANHO_CNPJ);
  }

  public static formatar(valor: string): string {
    const cnpjSanitizado = Cnpj.sanitizar(valor);
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

    const obterValorASCII = (c: string): number => {
      const CHAR_CODE_ZERO = 48;
      return c.charCodeAt(0) - CHAR_CODE_ZERO;
    }

    const cnpj = Cnpj.sanitizar(valor!);
    if(cnpj.length !== TAMANHO_CNPJ) {
      this._ehValido = "Insira um CNPJ válido";
      return;
    }

    if(!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) {
      this._ehValido = "Insira um CNPJ válido";
      return;
    }

    let sum = 0;
    let weight = 2;

    for (let i = 11; i >= 0; i--) {
      sum += obterValorASCII(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }

    const mod = sum % 11;
    const digit1 = mod < 2 ? 0 : 11 - mod;

    if (obterValorASCII(cnpj.charAt(12)) !== digit1) {
      this._ehValido = "Insira um CNPJ válido";
      return;
    }

    sum = 0;
    weight = 2;

    for (let i = 12; i >= 0; i--) {
      sum += obterValorASCII(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }

    const mod2 = sum % 11;
    const digit2 = mod2 < 2 ? 0 : 11 - mod2;

    if (obterValorASCII(cnpj.charAt(13)) !== digit2) {
      this._ehValido = "Insira um CNPJ válido";
      return;
    }

    this._ehValido = true;
  }
}
