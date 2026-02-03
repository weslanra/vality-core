// 👉 IsEmpty
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined || value === "") return true;

  return !!(Array.isArray(value) && value.length === 0);
};

export const ehDataBrasileira = (value: string): boolean => {
  const dateTimeRegex = /^(\d{2})\/(\d{2})\/(\d{4})( \d{2}:\d{2}(:\d{2})?)?$/;
  if (!dateTimeRegex.test(value)) return false;

  const [datePart, timePart] = value.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  if (timePart) {
    const [hours, minutes, segundos] = timePart.split(":").map(Number);
    if (
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59 ||
      segundos < 0 ||
      segundos > 59
    ) {
      return false;
    }
  }

  return true;
};

export const converterParaDate = (value: string | Date): Date => {
  if (typeof value === "string" && value.trim() != "") {
    if (!ehDataBrasileira(value)) {
      throw new Error("data inválida");
    }

    const [data, hora] = value.split(" ");
    const [dia, mes, ano] = data.split("/").map((item) => Number(item));

    if (!hora && dia && mes && ano) {
      return new Date(ano, mes - 1, dia);
    }

    const [horas, minutos, segundo] = hora
      .split(":")
      .map((item) => Number(item));

    if (typeof horas == "number" && typeof minutos == "number") {
      if (typeof segundo == "number")
        return new Date(ano, mes - 1, dia, horas, minutos, segundo);

      return new Date(ano, mes - 1, dia, horas, minutos);
    }
  }

  return new Date(value);
};

/**
 * Format and return date in Humanize format
 * Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 * Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {string} value date to format
 * @param {Intl.DateTimeFormatOptions} formatting Intl object to format with
 */
export const formatDate = (
  value: string | Date,
  locales: string | string[] = "pt-br",
  formatting: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }
) => {
  if (!value) return value;

  if (typeof value === "string" && ehDataBrasileira(value)) {
    value = converterParaDate(value);
  }

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (typeof value === "string" && isoDateRegex.test(value)) {
    value = new Date(value + " 00:00");
  }

  const date = typeof value === "string" ? new Date(value) : value;

  try {
    const hasTime =
      formatting.hour !== undefined ||
      formatting.minute !== undefined ||
      formatting.second !== undefined;

    // Se houver data e hora, formatar separadamente para remover a vírgula
    if (hasTime && (formatting.day || formatting.month || formatting.year)) {
      const datePart = new Intl.DateTimeFormat(locales, {
        day: formatting.day,
        month: formatting.month,
        year: formatting.year,
      }).format(date);

      const timePart = new Intl.DateTimeFormat(locales, {
        hour: formatting.hour,
        minute: formatting.minute,
        second: formatting.second,
        hour12: formatting.hour12,
      }).format(date);

      return `${datePart} ${timePart}`;
    }

    return new Intl.DateTimeFormat(locales, formatting).format(date);
  } catch (error) {
    throw new Error("Erro ao formatar a data");
  }
};
