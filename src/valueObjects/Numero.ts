import { INumero } from "../types";

export interface Options {
  prefix?: string;
  suffix?: string;
  separator: string;
  decimal: string;
  precision?: number;
  min?: number;
  max?: number;
}

/** Limites de dígitos para formatação (ex.: casas decimais) */
export const LIMITE_DIGITO_NUMBER = { NOVE: 9 } as const;

export const FORMATO_PADRAO: Options = {
  decimal: ",",
  separator: ".",
  precision: 0,
};

function between(min: number, n: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

function fixed(precision: number) {
  return between(0, precision, 20);
}

export default class Numero implements INumero {
  protected _valor!: string;
  protected _formatador: Options;
  protected _ehValido: true | string = true;

  constructor(
    valor: string | number | null,
    formatador: Partial<Options> = FORMATO_PADRAO
  ) {
    this._formatador = { ...FORMATO_PADRAO, ...formatador };
    this.valor = valor;
  }

  get ehValido(): true | string {
    return this._ehValido;
  }

  get valor(): string {
    return this._valor;
  }

  set valor(valor: number | string | null) {
    if (valor === null || valor === "") {
      this._valor = "";
      return;
    }

    if (valor == "-" && this._formatador.min && this._formatador.min < 0) {
      const numeroNegativo = Numero.aplicarSimbolos("0,00", this._formatador);
      this._valor = "-" + numeroNegativo;
      return;
    }

    // Sanatizar
    let valorSanitizado = this.sanitizar(valor);

    // Limitar
    let valorLimitado =
      Numero.limitarValor(valorSanitizado || 0, this._formatador) || 0;

    // Formatar
    const ehNegativo = valorLimitado < 0;

    let valorFormatado = valorLimitado
      .toFixed(this._formatador.precision || 0)
      .replace(/[.-]/g, "");
    valorFormatado = Numero.formatarValor(valorFormatado, this._formatador);

    // Aplicar simbolos
    valorFormatado = Numero.aplicarSimbolos(valorFormatado, this._formatador);

    this._valor = `${ehNegativo ? "-" : ""}${valorFormatado}`;
  }

  setValor(valor: number | string | null): void {
    this.valor = valor;
  }

  validar(value: string): boolean | string {
    return true;
  }

  private static limitarValor(valor: number, options: Options): number {
    const { min = 0, max } = options;

    if (min !== undefined && valor < min) {
      if (options.precision === 0) {
        valor = parseFloat(min.toString().split(".")[0]);
      } else if (options.precision && options.precision > 0) {
        valor = parseFloat(min.toFixed(options.precision));
      }
    }

    if (max !== undefined && valor > max) {
      if (options.precision === 0) {
        valor = parseFloat(max.toString().split(".")[0]);
      } else if (options.precision && options.precision > 0) {
        valor = parseFloat(max.toFixed(options.precision));
      }
    }

    return valor;
  }

  public sanitizar(valor: number | string): number | null {
    const { decimal, separator } = this._formatador;
    let valorLimite: number;

    if (typeof valor === "string") {
      const trimmed = valor.trim();
      const ehNegativo = trimmed.startsWith("-");
      let s = ehNegativo ? trimmed.slice(1).trim() : trimmed;

      const decimalIndex = s.lastIndexOf(decimal);

      if (decimalIndex !== -1) {
        let intRaw = s.slice(0, decimalIndex);
        let fracRaw = s.slice(decimalIndex + decimal.length);

        if (separator) {
          intRaw = intRaw.split(separator).join("");
        }
        intRaw = intRaw.replace(/[^0-9]/g, "");
        fracRaw = fracRaw.replace(/[^0-9]/g, "");

        if (intRaw === "" && fracRaw === "") {
          return null;
        }

        const intPart = intRaw === "" ? "0" : intRaw;
        const numStr =
          fracRaw.length > 0 ? `${intPart}.${fracRaw}` : intPart;
        valorLimite = parseFloat(numStr);

        if (Number.isNaN(valorLimite)) {
          return null;
        }

        if (ehNegativo) {
          valorLimite = -valorLimite;
        }
      } else {
        let valorSanitizado = s.replace(/[^0-9]/g, "").replace(/^0+/, "");

        valorSanitizado = Numero.formatarValor(
          valorSanitizado,
          this._formatador
        );

        if (valorSanitizado === "") {
          return null;
        }

        valorLimite = parseFloat(valorSanitizado.replace(decimal, "."));

        if (ehNegativo) {
          valorLimite = -valorLimite;
        }
      }
    } else {
      valorLimite = valor;
    }

    return parseFloat(valorLimite.toFixed(this._formatador.precision || 0));
  }

  public static aplicarSimbolos(
    valor: string,
    options: Options = FORMATO_PADRAO
  ): string {
    let valorFormatado = valor;

    // Aplicar separador
    if (options.separator) {
      const [parteInteira, parteDecimal] = valorFormatado.split(
        options.decimal
      );
      valorFormatado = parteInteira;
      valorFormatado = valorFormatado.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        options.separator
      );

      if (parteDecimal) {
        valorFormatado += options.decimal + parteDecimal;
      }
    }

    // Aplicar simbolos
    if (options.prefix) {
      valorFormatado = `${options.prefix}${valorFormatado}`;
    }
    if (options.suffix) {
      valorFormatado = `${valorFormatado}${options.suffix}`;
    }

    return valorFormatado;
  }

  public static formatarValor(
    valor: string,
    options: Options = FORMATO_PADRAO
  ) {
    let valorFormatado = valor;

    const { precision = 0, decimal } = options;
    if (precision > 0) {
      const paddedValue = valorFormatado.padStart(precision + 1, "0");
      const integerPart = paddedValue.slice(0, -precision);
      const decimalPart = paddedValue.slice(-precision);
      valorFormatado = `${integerPart}${decimal}${decimalPart}`;
    }

    return valorFormatado;
  }

  public static formatar(valor: string, options: Options = FORMATO_PADRAO) {
    const valorFormatado = Numero.formatarValor(valor, options);

    return Numero.aplicarSimbolos(valorFormatado, options);
  }

  valueOf(): number | null {
    return this.sanitizar(this.valor);
  }
}
