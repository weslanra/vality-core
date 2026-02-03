export interface DatePickerOptions {
  type: "date" | "datetime" | "time";
  separator?: string;
  minDate?: {
    valor: Date;
    campo?: string;
  };
  minDateLimit?: Date;
  maxDate?: {
    valor: Date;
    campo?: string;
  };
  maxDateLimit?: Date;
  minTime?: TimeLimiter;
  minTimeLimit?: TimeLimiter;
  maxTime?: TimeLimiter;
  maxTimeLimit?: TimeLimiter;
}

export type TimeLimiter = {
  hour: number;
  minute: number;
};

export type FormatFunction = (
  valor: string,
  type: "date" | "datetime" | "time",
  options: {
    minDate?: Date;
    maxDate?: Date;
    minTime?: TimeLimiter;
    maxTime?: TimeLimiter;
    separator?: string;
  }
) => string;

export type ValidateFunction = (
  valor: string,
  type: "date" | "datetime" | "time",
  options: {
    separator: string;
    minDate?: {
      valor: Date;
      campo?: string;
    };
    maxDate?: {
      valor: Date;
      campo?: string;
    };
    minTime?: {
      hour: number;
      minute: number;
      campo?: string;
    };
    maxTime?: {
      hour: number;
      minute: number;
      campo?: string;
    };
  }
) => true | string;

export type ValueOfFunction = (
  valor: string,
  type: "date" | "datetime" | "time",
  separator: string,
  ehValido: true | string
) => number;

export type ToISOStringFunction = (
  valor: string,
  type: "date" | "datetime" | "time",
  separator: string
) => string;
