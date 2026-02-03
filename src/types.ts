import { DatePickerOptions } from "./valueObjects/DatePicker/types";

export abstract class ValueObjects {
  abstract valor: unknown;
  abstract ehValido: true | string;

  abstract validar(valor: unknown): unknown;
  static formatar(valor: unknown): unknown {
    return valor;
  }
  abstract valueOf(): unknown;
}

export interface INumero extends ValueObjects {
  valor: string;
  setValor(valor: number | string | null): void;
  sanitizar(valor: string): number | null;
  valueOf(): number | null;
}

export interface IMoeda extends INumero {
  valor: string;
}

export interface IEmail extends ValueObjects {
  valor: string;
  valueOf(): string;
  validar(valor: string): void;
}

export interface IPlaca extends ValueObjects {
  valor: string;
  valueOf(): string;
  validar(valor: string): void;
}

export abstract class ICpfCnpj {
  abstract valor: string;
  abstract ehValido: true | string;
  abstract tipo: "CPF" | "CNPJ" | null;
  abstract valueOf(): string;

  static sanatizar(valor: string): string {
    return valor;
  }
  static formatar(valor: string): string {
    return valor;
  }
  abstract validar(valor: string): void;
}

export abstract class ICnpj {
  abstract valor: string;
  abstract ehValido: true | string;
  abstract valueOf(): string;

  static sanatizar(valor: string): string {
    return valor;
  }
  static formatar(valor: string): string {
    return valor;
  }
  abstract validar(valor: string): void;
}

export abstract class ICpf {
  abstract valor: string;
  abstract ehValido: true | string;
  abstract valueOf(): string;

  static sanatizar(valor: string): string {
    return valor;
  }
  static formatar(valor: string): string {
    return valor;
  }
  abstract validar(valor: string): void;
}

export interface IDatePicker {
  valor: string;
  ehValido: true | string;
  locale: string;
  options: DatePickerOptions;
  dateFormat: string;

  formatar(valor: string): string;
  validar(valor: string): void;
  valueOf(): number;
  toISOString(): string;
}

export interface INome {
  valor: string;
  ehValido: true | string;

  validar(valor: string): void;
}
