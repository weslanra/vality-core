import { IDatePicker } from "../../types";
import {
  dateFormatPtBr,
  formatarPtBr,
  toISOStringPtBr,
  validarPtBr,
  valueOfPtBr,
} from "./locales/pt-br";
import {
  DatePickerOptions,
  FormatFunction,
  ToISOStringFunction,
  ValidateFunction,
  ValueOfFunction,
} from "./types";

/** Data mínima padrão para o sistema (1900-01-01) */
export const DATA_MINIMA_SISTEMA = new Date(1900, 0, 1);

export default class DatePicker implements IDatePicker {
  private _valor: string;
  private _ehValido: true | string = true;
  private _locale: string = "pt-br";
  private _options: DatePickerOptions;
  private _formatar: FormatFunction;
  private _validar: ValidateFunction;
  private _valueOf: ValueOfFunction;
  private _toISOString: ToISOStringFunction;
  private _dateFormat: string = "d/M/Y";

  constructor(
    data: string = "",
    locale: string = "pt-br",
    options: DatePickerOptions = {
      type: "date",
    }
  ) {
    const defaultOptions = {
      type: "date",
      separator: " às ",
      maxDateLimit: new Date(),
      minDateLimit: DATA_MINIMA_SISTEMA,
    };

    this._locale = locale;
    this._options = { ...defaultOptions, ...options };

    // Quando houver mais de uma localidade, adicionar um switch case aqui
    this._formatar = formatarPtBr;
    this._validar = validarPtBr;
    this._valueOf = valueOfPtBr;
    this._toISOString = toISOStringPtBr;
    this._dateFormat = dateFormatPtBr(
      this._options.type,
      this._options.separator || " "
    );

    data = this.formatar(data);
    this.validar(data);
    this._valor = data;
  }

  get valor(): string {
    return this._valor;
  }

  set valor(v: string) {
    v = this.formatar(v || "");
    this.validar(v);
    this._valor = v;
  }

  get ehValido() {
    return this._ehValido;
  }

  get locale() {
    return this._locale;
  }

  get options() {
    return this._options;
  }

  set options(o: DatePickerOptions) {
    this._options = o;
  }

  get dateFormat() {
    return this._dateFormat;
  }

  public formatar(valor: string): string {
    return this._formatar(valor, this.options.type, {
      separator: this.options.separator || " ",
      minDate: this.options.minDateLimit,
      maxDate: this.options.maxDateLimit,
      minTime: this.options.minTimeLimit,
      maxTime: this.options.maxTimeLimit,
    });
  }

  public valueOf() {
    return this._valueOf(
      this.valor,
      this.options.type,
      this.options.separator || " ",
      this.ehValido
    );
  }

  public toISOString() {
    return this._toISOString(
      this.valor,
      this.options.type,
      this.options.separator || " "
    );
  }

  public validar(valor: string) {
    this._ehValido = this._validar(valor, this.options.type, {
      separator: this.options.separator || " ",
      minDate: this.options.minDate,
      maxDate: this.options.maxDate,
      minTime: this.options.minTime,
      maxTime: this.options.maxTime,
    });
  }
}
