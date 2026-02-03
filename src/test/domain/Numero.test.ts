import Numero, {
  FORMATO_PADRAO,
  Options,
} from "@/valueObjects/Numero";

const PERCENT_FORMAT: Options = {
  ...FORMATO_PADRAO,
  suffix: "%",
  precision: 2,
};
const MONEY_FORMAT: Options = {
  ...FORMATO_PADRAO,
  prefix: "R$ ",
  precision: 2,
};

describe("Classe Numero", () => {
  it("deve inicializar com o formato padrão", () => {
    const numero = new Numero(null);
    expect(numero.valor).toBe("");
  });

  it("deve aceitar um valor numérico e formatá-lo corretamente", () => {
    const numero = new Numero(1234.56, { ...FORMATO_PADRAO, precision: 2 });
    expect(numero.valor).toBe("1.234,56");
  });

  it("deve aceitar um valor em string e formatá-lo corretamente", () => {
    const formato = {
      ...FORMATO_PADRAO,
      prefix: "R$ ",
      precision: 2,
    };
    const numero = new Numero("1234,56", formato);
    expect(numero.valor).toBe("R$ 1.234,56");
  });

  it("deve aplicar o prefixo e sufixo corretamente", () => {
    const numero = new Numero(1234.56, {
      ...FORMATO_PADRAO,
      prefix: "R$ ",
      suffix: " reais",
      precision: 2,
    });
    expect(numero.valor).toBe("R$ 1.234,56 reais");
  });

  it("deve limitar o valor mínimo", () => {
    const numero = new Numero(50, {
      ...FORMATO_PADRAO,
      precision: 2,
      min: 100,
    });
    expect(numero.valor).toBe("100,00");
  });

  it("deve limitar o valor máximo", () => {
    const formatador: Options = {
      ...FORMATO_PADRAO,
      max: 999,
      precision: 2,
    };
    const numero = new Numero(1000, formatador);
    expect(numero.valor).toBe("999,00");
  });

  it("deve sanitizar e converter uma string inválida para o valor '0'", () => {
    const numero = new Numero("invalido");
    expect(numero.valueOf()).toBeNull();
  });

  it("deve retornar o valor numérico correto com valueOf", () => {
    const numero = new Numero("1.234,56", { ...FORMATO_PADRAO, precision: 2 });
    expect(numero.valueOf()).toBe(1234.56);
  });

  it("deve lidar com valores negativos corretamente", () => {
    let numero = new Numero(-99.56, {
      ...FORMATO_PADRAO,
      precision: 2,
      min: -100,
    });
    expect(numero.valor).toBe("-99,56");

    numero = new Numero("-99,56", {
      ...FORMATO_PADRAO,
      precision: 2,
      min: -100,
    });
    expect(numero.valor).toBe("-99,56");

    numero = new Numero(-99.56, {
      ...FORMATO_PADRAO,
      precision: 2,
    });
    expect(numero.valor).toBe("0,00");
  });

  it("deve lidar com limitadores corretamente", () => {
    let numero = new Numero(-1234.56, {
      ...FORMATO_PADRAO,
      precision: 2,
      min: -1000,
    });
    expect(numero.valor).toBe("-1.000,00");

    numero = new Numero(-1234.56, { ...FORMATO_PADRAO, precision: 2, min: 10 });
    expect(numero.valor).toBe("10,00");

    numero = new Numero(1234.56, { ...FORMATO_PADRAO, precision: 2, max: 500 });
    expect(numero.valor).toBe("500,00");
  });

  it("deve aplicar separadores corretamente", () => {
    const numero = new Numero(1234567.89, { ...FORMATO_PADRAO, precision: 2 });
    expect(numero.valor).toBe("1.234.567,89");
  });

  it("deve aplicar formatação corretamente", () => {
    let numero = new Numero(4, PERCENT_FORMAT);
    expect(numero.valor).toBe("4,00%");

    numero = new Numero(4, MONEY_FORMAT);
    expect(numero.valor).toBe("R$ 4,00");
  });

  it("deve validar instância do número", () => {
    const numero = new Numero(5);
    expect(numero.validar(numero.valor)).toBe(true);
  });
});
