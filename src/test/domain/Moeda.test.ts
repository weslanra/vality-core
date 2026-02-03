import Moeda, {
  FORMATO_PADRAO_BR,
  type Options,
} from "@/valueObjects/Moeda";

describe("Moeda com Objeto Formatador", () => {
  it("deve inicializar com o valor correto", () => {
    const moeda = new Moeda(100);
    expect(moeda.valueOf()).toBe(100);
  });

  it("deve formatar o valor corretamente com o formatador", () => {
    const moeda = new Moeda(100);
    expect(moeda.valor).toBe("R$ 100,00");

    moeda.valor = 450;
    expect(moeda.valor).toBe("R$ 450,00");
  });

  it("deve formatar o valor corretamente quando houver casas decimais", () => {
    const moeda = new Moeda(200.34, FORMATO_PADRAO_BR);

    expect(moeda.valor).toBe("R$ 200,34");
  });

  it("deve formatar o valor com options diferentes do padrao BR", () => {
    const formatador: Options = {
      decimal: ".",
      separator: ",",
      prefix: "$ ",
      precision: 2,
    };

    const moeda = new Moeda(1234.56, formatador);
    expect(moeda.valor).toBe("$ 1,234.56");
  });

  it("deve formatar o valor com options diferentes do padrao BR - alterando precision", () => {
    const formatador: Options = {
      decimal: ".",
      separator: ",",
      prefix: "$ ",
      precision: 1,
    };

    const moeda = new Moeda(4563.43, formatador);
    expect(moeda.valor).toBe("$ 4,563.4");
  });

  it("deve formatar o valor com options diferentes do padrao BR - alterando precision para 0", () => {
    const formatador: Options = {
      decimal: ".",
      separator: ",",
      prefix: "$ ",
      precision: 0,
    };

    const moeda = new Moeda(984.44, formatador);
    expect(moeda.valor).toBe("$ 984");
  });

  it("deve aceitar valor negativo se o formatador permitir", () => {
    const customFormatador = { min: -100 };
    const moeda = new Moeda(-50, customFormatador);
    expect(moeda.valueOf()).toBe(-50);
    expect(moeda.valor).toBe("-R$ 50,00");
  });

  it("Deve forçar o valor mínimo quando o valor inserido for menor", () => {
    const moeda = new Moeda(-150, FORMATO_PADRAO_BR);
    expect(moeda.valueOf()).toEqual(0);
  });

  it("Deve forçar o valor máximo quando o valor inserido for maior", () => {
    const moeda = new Moeda(300, { max: 200 });
    expect(moeda.valueOf()).toEqual(200);
  });

  it("deve sanitizar e converter uma string monetária corretamente", () => {
    const moeda = new Moeda("R$ 1.234,56", FORMATO_PADRAO_BR);
    expect(moeda.valueOf()).toBe(1234.56);
  });

  it("deve detectar quando a string sanitizada não é um número válido", () => {
    const moeda = new Moeda("R$ ABC", FORMATO_PADRAO_BR);
    expect(moeda.valueOf()).toBe(0);
  });

  it("deve formatar o valor com o suffix", () => {
    const formatador: Options = {
      decimal: ",",
      separator: ".",
      prefix: "",
      suffix: " R$",
      precision: 2,
    };

    const moeda = new Moeda(1234.56, formatador);
    expect(moeda.valor).toBe("1.234,56 R$");
  });
});
