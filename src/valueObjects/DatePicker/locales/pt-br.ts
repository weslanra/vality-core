import { formatDate, isEmpty } from "../../../utils";
import {
  FormatFunction,
  TimeLimiter,
  ValidateFunction,
  ValueOfFunction,
} from "../types";

const validarDataMinMax = (
  v: string,
  minDate?: Date,
  maxDate?: Date
): "menor" | "maior" | true => {
  let valor = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)}`;

  if (minDate) {
    const [dia, mes, ano] = valor.split("/");
    const data = new Date(`${ano}-${mes}-${dia}`);

    if (data < minDate) {
      const min = minDate;
      const dia = min.getDate().toString().padStart(2, "0");
      const mes = (min.getMonth() + 1).toString().padStart(2, "0");
      const ano = min.getFullYear();

      valor = `${dia}/${mes}/${ano}`;

      return "menor";
    }
  }

  if (maxDate) {
    const [dia, mes, ano] = valor.split("/");
    const data = new Date(`${ano}-${mes}-${dia}`);

    if (data > maxDate) {
      const max = maxDate;
      const dia = max.getDate().toString().padStart(2, "0");
      const mes = (max.getMonth() + 1).toString().padStart(2, "0");
      const ano = max.getFullYear();

      valor = `${dia}/${mes}/${ano}`;

      return "maior";
    }
  }

  return true;
};

const formatarData = (
  valueSanatizado: string,
  minDate?: Date,
  maxDate?: Date
): string => {
  let dataFormatada = valueSanatizado;

  const getDia = (dia: string): string => {
    if (Number(dia) > 31) return "31";
    if (Number(dia) === 0) return "01";
    return dia;
  };

  const getMes = (mes: string): string => {
    if (Number(mes) > 12) return "12";
    if (Number(mes) === 0) return "01";
    return mes;
  };

  if (valueSanatizado.length > 4) {
    const dia = getDia(valueSanatizado.slice(0, 2));
    const mes = getMes(valueSanatizado.slice(2, 4));
    const ano = valueSanatizado.slice(4, 8);
    dataFormatada = `${dia}/${mes}/${ano}`;

    if (valueSanatizado.length == 8) {
      const valido = validarDataMinMax(valueSanatizado, minDate, maxDate);

      if (minDate && valido == "menor") {
        const min = minDate;
        const dia = min.getDate().toString().padStart(2, "0");
        const mes = (min.getMonth() + 1).toString().padStart(2, "0");
        const ano = min.getFullYear();

        dataFormatada = `${dia}/${mes}/${ano}`;
      } else if (maxDate && valido == "maior") {
        const max = maxDate;
        const dia = max.getDate().toString().padStart(2, "0");
        const mes = (max.getMonth() + 1).toString().padStart(2, "0");
        const ano = max.getFullYear();

        dataFormatada = `${dia}/${mes}/${ano}`;
      }
    }
  } else if (valueSanatizado.length > 2) {
    const dia = getDia(valueSanatizado.slice(0, 2));
    const mes = valueSanatizado.slice(2);
    dataFormatada = `${dia}/${mes}`;
  }

  return dataFormatada;
};

const validarTimeMinMax = (
  valueSanatizado: string,
  minTime?: TimeLimiter,
  maxTime?: TimeLimiter
): "menor" | "maior" | true => {
  if (minTime) {
    const { hour, minute } = minTime;
    const time = Number(
      hour.toFixed(0).padStart(2, "0") + "" + minute.toFixed(0).padStart(2, "0")
    );
    if (Number(valueSanatizado) <= time) {
      return "menor";
    }
  }

  if (maxTime) {
    const { hour, minute } = maxTime;
    const time = Number(
      hour.toFixed(0).padStart(2, "0") + "" + minute.toFixed(0).padStart(2, "0")
    );
    if (Number(valueSanatizado) >= time) {
      return "maior";
    }
  }

  return true;
};

const formatarTime = (
  valueSanatizado: string,
  minTime?: TimeLimiter,
  maxTime?: TimeLimiter
): string => {
  let timeFormatado = valueSanatizado;

  const getHora = (hora: string): string => {
    const max = 23;
    const min = 0;

    if (Number(hora) > max) return "" + max.toFixed(0).padStart(2, "0");
    if (Number(hora) === min) return "" + min.toFixed(0).padStart(2, "0");
    return hora;
  };

  const getMinuto = (minuto: string): string => {
    const max = 59;
    const min = 0;

    if (Number(minuto) > max) return "" + max.toFixed(0).padStart(2, "0");
    if (Number(minuto) === min) return "" + min.toFixed(0).padStart(2, "0");
    return minuto;
  };

  if (valueSanatizado.length >= 4) {
    const hour = getHora(valueSanatizado.slice(0, 2));
    const minute = getMinuto(valueSanatizado.slice(2, 4));
    timeFormatado = `${hour}:${minute}`;
    const validar = validarTimeMinMax(valueSanatizado, minTime, maxTime);

    if (minTime && validar == "menor") {
      const { hour, minute } = minTime;
      const hourFormat = hour.toFixed(0).padStart(2, "0");
      const minuteFormat = minute.toFixed(0).padStart(2, "0");
      timeFormatado = `${hourFormat}:${minuteFormat}`;
    }

    if (maxTime && validar == "maior") {
      const { hour, minute } = maxTime;
      const hourFormat = hour.toFixed(0).padStart(2, "0");
      const minuteFormat = minute.toFixed(0).padStart(2, "0");
      timeFormatado = `${hourFormat}:${minuteFormat}`;
    }
  } else if (valueSanatizado.length > 2) {
    const hour = getHora(valueSanatizado.slice(0, 2));
    const minute = valueSanatizado.slice(2, 4);
    timeFormatado = `${hour}:${minute}`;
  } else if (valueSanatizado.length > 1) {
    timeFormatado = getHora(valueSanatizado.slice(0, 2));
  }

  return timeFormatado;
};

const formatarDateTime = (
  valueSanatizado: string,
  separator: string,
  minDate?: Date,
  maxDate?: Date
): string => {
  let dateTimeFormatado = formatarData(valueSanatizado, minDate, maxDate);

  if (valueSanatizado.length > 8) {
    dateTimeFormatado =
      formatarData(valueSanatizado, minDate, maxDate) +
      separator +
      formatarTime(valueSanatizado.slice(8));
  }

  return dateTimeFormatado;
};

const formatarPtBr: FormatFunction = (
  valor,
  type,
  options = {
    separator: " às ",
  }
): string => {
  const dataSanitizada = valor.replace(/[^0-9]/g, "");

  switch (type) {
    case "date":
      return formatarData(dataSanitizada, options.minDate, options.maxDate);
    case "time":
      return formatarTime(dataSanitizada, options.minTime, options.maxTime);
    case "datetime":
      return formatarDateTime(
        dataSanitizada,
        options.separator || " ",
        options.minDate,
        options.maxDate
      );
  }
};

const validarPtBr: ValidateFunction = (
  valor: string,
  type: "date" | "datetime" | "time",
  options
): true | string => {
  if (isEmpty(valor)) {
    return true;
  }

  switch (type) {
    case "date":
      const reg = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);
      if (!reg.test(valor)) {
        return "Data inválida";
      } else {
        const dataSanitizada = valor.replace(/[^0-9]/g, "");
        const valido = validarDataMinMax(
          dataSanitizada,
          options.minDate?.valor,
          options.maxDate?.valor
        );

        if (options.minDate && valido == "menor") {
          return `Deve ser superior à ${
            options.minDate.campo
              ? options.minDate.campo
              : formatDate(options.minDate.valor)
          }`;
        } else if (options.maxDate && valido == "maior") {
          return `Deve ser inferior à ${
            options.maxDate.campo
              ? options.maxDate.campo
              : formatDate(options.maxDate.valor)
          }`;
        }
      }

      return true;
    case "time":
      const regTime = new RegExp(/^\d{2}:\d{2}(:\d{2})?$/);
      if (!regTime.test(valor)) {
        return "Hora inválida";
      } else {
        const timeSanatizado = valor.replace(/[^0-9]/g, "");

        const valido = validarTimeMinMax(
          timeSanatizado,
          options.minTime,
          options.maxTime
        );
        if (options.minTime && valido == "menor") {
          return `Hora mínima ${options.minTime.hour
            .toFixed(0)
            .padStart(2, "0")}:${options.minTime.minute
            .toFixed(0)
            .padStart(2, "0")}`;
        } else if (options.maxTime && valido == "maior") {
          return `Hora máxima ${options.maxTime.hour
            .toFixed(0)
            .padStart(2, "0")}:${options.maxTime.minute
            .toFixed(0)
            .padStart(2, "0")}`;
        }
      }

      return true;
    case "datetime":
      const regDateTime = new RegExp(
        `^\\d{2}\\/\\d{2}\\/\\d{4}${
          options.separator || " "
        }\\d{2}:\\d{2}(:\\d{2})?$`
      );
      if (!regDateTime.test(valor)) {
        return "Data e hora inválida";
      } else {
        let dataSanitizada = valor.split(options.separator || " ")[0];
        dataSanitizada = dataSanitizada.replace(/[^0-9]/g, "");
        const valido = validarDataMinMax(
          dataSanitizada,
          options.minDate?.valor,
          options.maxDate?.valor
        );

        if (options.minDate && valido == "menor") {
          return `Deve ser superior à ${
            options.minDate.campo
              ? options.minDate.campo
              : formatDate(options.minDate.valor)
          }`;
        } else if (options.maxDate && valido == "maior") {
          return `Deve ser inferior à ${
            options.maxDate.campo
              ? options.maxDate.campo
              : formatDate(options.maxDate.valor)
          }`;
        }
      }

      return true;
  }
};

const valueOfPtBr: ValueOfFunction = (
  valor: string,
  type: "date" | "datetime" | "time",
  separator: string,
  ehValido: true | string
): number => {
  if (ehValido !== true) return NaN;

  switch (type) {
    case "date":
      const [dia, mes, ano] = valor.split("/");

      return new Date(`${ano}-${mes}-${dia}T00:00:00`).valueOf();
    case "time":
      const [horas, minutos] = valor.split(":").map((item) => Number(item));

      return horas * 3600 + minutos * 60;
    case "datetime":
      const [data, hora] = valor.split(separator);
      const [d, m, Y] = data.split("/");

      return new Date(`${Y}-${m}-${d}T${hora}`).valueOf();
  }
};

const dateFormatPtBr = (
  type: "date" | "datetime" | "time",
  separator: string
): string => {
  switch (type) {
    case "date":
      return "d/m/Y";
    case "time":
      return "H:i";
    case "datetime":
      return `d/m/Y${separator}H:i`;
  }
};

const toISOStringPtBr = (
  valor: string,
  type: "date" | "datetime" | "time",
  separator: string
): string => {
  try {
    switch (type) {
      case "time":
        const [h, i] = valor.split(":");
        return `${h}:${i}:00Z`;

      case "datetime":
        const [data, hora] = valor.split(separator);
        const [d, m, Y] = data.split("/");
        return new Date(`${Y}-${m}-${d}T${hora}`).toISOString();

      default:
        const [dia, mes, ano] = valor.split("/");
        return new Date(`${ano}-${mes}-${dia}T00:00:00`).toISOString();
    }
  } catch (e) {
    throw new Error("Data inválida");
  }
};

export {
  dateFormatPtBr,
  formatarPtBr,
  toISOStringPtBr,
  validarPtBr,
  valueOfPtBr
};

