import DatePicker, {
  DATA_MINIMA_SISTEMA,
} from "@/valueObjects/DatePicker/DatePicker";

describe("DatePicker", () => {
  it("deve inicializar com valores padrão", () => {
    const datePicker = new DatePicker();
    expect(datePicker.valor).toBe("");
    expect(datePicker.ehValido).toBe(true);
    expect(datePicker.locale).toBe("pt-br");
    expect(datePicker.options.type).toBe("date");
    expect(datePicker.options.separator).toBe(" às ");
    expect(datePicker.options.minDateLimit).toEqual(DATA_MINIMA_SISTEMA);
    expect(datePicker.dateFormat).toBe("d/m/Y");
  });

  it("deve definir e obter o valor corretamente", () => {
    const datePicker = new DatePicker("");
    datePicker.valor = "01/01/2025";
    expect(datePicker.valor).toBe("01/01/2025");
    expect(datePicker.ehValido).toBe(true);
  });

  describe("Locale - PT BR", () => {
    const erros = {
      data: "Data inválida",
      hora: "Hora inválida",
      dataHora: "Data e hora inválida",
    };

    describe("Formatação", () => {
      it("deve formatar a data corretamente", () => {
        const datePicker = new DatePicker("15");
        expect(datePicker.valor).toBe("15");

        datePicker.valor = "150";
        expect(datePicker.valor).toBe("15/0");

        datePicker.valor = "1508";
        expect(datePicker.valor).toBe("15/08");

        datePicker.valor = "15082";
        expect(datePicker.valor).toBe("15/08/2");

        datePicker.valor = "15082021";
        expect(datePicker.valor).toBe("15/08/2021");
      });

      it("limite mínimo de data deve ser por padrão 01/01/1900", () => {
        const datePicker = new DatePicker("01/01/1899");
        expect(datePicker.valor).toBe("01/01/1900");
      });

      it("não deve permitir a inserção de data menor que o limite mínimo de data", () => {
        const datePicker = new DatePicker("01/01/1999", "pt-br", {
          type: "date",
          minDateLimit: new Date("2000-01-01 00:00:00"),
        });

        expect(datePicker.valor).toBe("01/01/2000");
      });

      it("não deve permitir a inserção de data menor que o limite máximo de data", () => {
        const datePicker = new DatePicker("01/01/2022", "pt-br", {
          type: "date",
          maxDateLimit: new Date("2021-01-01 00:00:00"),
        });

        expect(datePicker.valor).toBe("01/01/2021");
      });

      it("deve formatar o tempo corretamente", () => {
        const datePicker = new DatePicker("15", "pt-br", { type: "time" });
        expect(datePicker.valor).toBe("15");

        datePicker.valor = "150";
        expect(datePicker.valor).toBe("15:0");

        datePicker.valor = "1508";
        expect(datePicker.valor).toBe("15:08");
      });

      it("deve formatar a data e hora corretamente", () => {
        const datePicker = new DatePicker("15082021", "pt-br", {
          type: "datetime",
        });

        expect(datePicker.valor).toBe("15/08/2021");

        datePicker.valor = "1508202110";
        expect(datePicker.valor).toBe("15/08/2021 às 10");

        datePicker.valor = "150820211015";
        expect(datePicker.valor).toBe("15/08/2021 às 10:15");
      });

      it("deve formatar e validar a data e hora corretamente com separador", () => {
        const datePicker = new DatePicker("150820211015", "pt-br", {
          type: "datetime",
          separator: ", ",
        });

        expect(datePicker.valor).toBe("15/08/2021, 10:15");
      });
    });

    describe("Validação", () => {
      it("deve validar a data corretamente", () => {
        const datePicker = new DatePicker("15");
        expect(datePicker.ehValido).toBe(erros.data);

        datePicker.valor = "150";
        expect(datePicker.ehValido).toBe(erros.data);

        datePicker.valor = "1508";
        expect(datePicker.ehValido).toBe(erros.data);

        datePicker.valor = "15082";
        expect(datePicker.ehValido).toBe(erros.data);

        datePicker.valor = "15082021";
        expect(datePicker.ehValido).toBe(true);
      });

      it("deve informar quando a data for menor que a mínima", () => {
        const datePicker = new DatePicker("01/01/2020", "pt-br", {
          type: "date",
          minDate: { valor: new Date("01/01/2021") },
        });

        expect(datePicker.ehValido).toBe("Deve ser superior à 01/01/2021");
      });

      it("deve informar quando a data for menor que a mínima com o campo informado", () => {
        const datePicker = new DatePicker("01/01/2020", "pt-br", {
          type: "date",
          minDate: { valor: new Date("01/01/2021"), campo: "data teste" },
        });

        expect(datePicker.ehValido).toBe("Deve ser superior à data teste");
      });

      it("deve informar quando a data for maior que a máxima", () => {
        const datePicker = new DatePicker("01/01/2022", "pt-br", {
          type: "date",
          maxDate: { valor: new Date("01/01/2021"), campo: "data teste" },
        });

        expect(datePicker.ehValido).toBe("Deve ser inferior à data teste");
      });

      it("deve validar a hora corretamente", () => {
        const datePicker = new DatePicker("15", "pt-br", { type: "time" });
        expect(datePicker.ehValido).toBe(erros.hora);

        datePicker.valor = "150";
        expect(datePicker.ehValido).toBe(erros.hora);

        datePicker.valor = "1508";
        expect(datePicker.ehValido).toBe(true);
      });

      it("deve informar quando a hora menor que a mínima", () => {
        const datePicker = new DatePicker("08:00", "pt-br", {
          type: "time",
          minTime: {
            hour: 9,
            minute: 0,
          },
        });

        expect(datePicker.ehValido).toBe("Hora mínima 09:00");
      });

      it("deve informar quando a hora maior que a máxima", () => {
        const datePicker = new DatePicker("10:00", "pt-br", {
          type: "time",
          maxTime: {
            hour: 9,
            minute: 0,
          },
        });

        expect(datePicker.ehValido).toBe("Hora máxima 09:00");
      });

      it("deve validar a data e hora corretamente", () => {
        const datePicker = new DatePicker("15082021", "pt-br", {
          type: "datetime",
        });

        expect(datePicker.ehValido).toBe(erros.dataHora);

        datePicker.valor = "150820211015";
        expect(datePicker.ehValido).toBe(true);
      });
    });

    describe("Valor de", () => {
      it("deve retornar timestemp corretamente da data", () => {
        const datePicker = new DatePicker("15/08/2021");
        expect(datePicker.valueOf()).toBe(
          new Date("2021-08-15 00:00").valueOf()
        );
      });

      it("deve retornar a quantidade de segundos da hora", () => {
        const datePicker = new DatePicker("10:15", "pt-br", { type: "time" });
        expect(datePicker.valueOf()).toBe(36900);
      });

      it("deve retornar timestemp corretamente da data e hora", () => {
        const datePicker = new DatePicker("15/08/2021 10:15", "pt-br", {
          type: "datetime",
        });

        expect(datePicker.valueOf()).toBe(
          new Date("2021-08-15 10:15").valueOf()
        );
      });
    });

    describe("Formato da data", () => {
      it("deve retornar o formato 'd/m/Y' para tipo data", () => {
        const datePicker = new DatePicker("");
        expect(datePicker.dateFormat).toBe("d/m/Y");
      });
      it("deve retornar o formato 'H:i' para tipo time", () => {
        const datePicker = new DatePicker("", "pt-br", { type: "time" });
        expect(datePicker.dateFormat).toBe("H:i");
      });

      it("deve retornar o formato 'd/m/Y às H:i' para tipo datetime", () => {
        const datePicker = new DatePicker("", "pt-br", { type: "datetime" });
        expect(datePicker.dateFormat).toBe("d/m/Y às H:i");
      });
    });
  });
});
