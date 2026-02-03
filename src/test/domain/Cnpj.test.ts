import Cnpj from "@/valueObjects/Cnpj";

describe("Validar valueObject CNPJ", () => {
  it("deve inicializar com um CNPJ válido", () => {
    const CnpjInstance = new Cnpj("30.208.494/0001-65");
    expect(CnpjInstance.valor).toBe("30.208.494/0001-65");
    expect(CnpjInstance.ehValido).toBe(true);
  });

  it("deve rejeitar CNPJ com menos de 14 dígitos", () => {
    const CnpjInstance = new Cnpj("30.208.494/0001");
    expect(CnpjInstance.ehValido).toBe("Insira um CNPJ válido");
  });

  it("deve rejeitar CNPJ com sequência de números repetidos", () => {
    const CnpjInstance = new Cnpj("11.111.111/1111-11");
    expect(CnpjInstance.ehValido).toBe("Insira um CNPJ válido");
  });

  it("deve rejeitar CNPJ com dígitos verificadores incorretos", () => {
    const CnpjInstance = new Cnpj("04.252.011/0001-11");
    expect(CnpjInstance.ehValido).toBe("Insira um CNPJ válido");
  });

  it("deve aceitar um CNPJ válido via setter", () => {
    const CnpjInstance = new Cnpj("30.208.494/0001-65");
    CnpjInstance.valor = "11.658.798/0001-80";
    expect(CnpjInstance.valor).toBe("11.658.798/0001-80");
    expect(CnpjInstance.ehValido).toBe(true);
  });

  it("deve rejeitar CNPJ inválido via setter", () => {
    const CnpjInstance = new Cnpj("30.208.494/0001-65");
    CnpjInstance.valor = "20.392.312/0001-00";
    expect(CnpjInstance.ehValido).toBe("Insira um CNPJ válido");
  });

  it("deve remover caracteres especiais e letras", () => {
    const CnpjInstance = new Cnpj("12c.def.ghi/jklm-np");
    expect(CnpjInstance.valor).toBe("12");
  });

  it("deve ser válido se um CNPJ inválido for alterado para vazio", () => {
    const CnpjInstance = new Cnpj("04.252.011/0001-11");
    expect(CnpjInstance.ehValido).toBe("Insira um CNPJ válido");
    CnpjInstance.valor = "";
    expect(CnpjInstance.ehValido).toBe(true);
  });

  it("deve retornar valor formatado caso realize a instância de um cnpj", () => {
    const CnpjInstance = new Cnpj("30208494000165");
    expect(CnpjInstance.valor).toBe("30.208.494/0001-65");
  });

  it("deve retornar valor formatado caso altere um cnpj", () => {
    const CnpjInstance = new Cnpj("30.208.494/0001-65");
    CnpjInstance.valor = "11658798000180";
    expect(CnpjInstance.valor).toBe("11.658.798/0001-80");
  });

  it("deve retornar valor sem formatação", () => {
    const CnpjInstance = new Cnpj("30.208.494/0001-65");
    expect(CnpjInstance.valueOf()).toBe("30208494000165");
  });

  it("deve permitir apenas 14 números", () => {
    const CnpjInstance = new Cnpj("30.208.494/0001-6578987987");
    expect(CnpjInstance.valor).toBe("30.208.494/0001-65");
  });

  it("verificando validação feita no construtor", () => {
    const CnpjInstance = new Cnpj("sjdhsjhd");
    expect(CnpjInstance.ehValido).toBe(true);
  });

  it("deve formatar corretamente", () => {
    const CnpjInstance = new Cnpj("300");
    expect(CnpjInstance.valor).toBe("30.0");
    CnpjInstance.valor = "300300";
    expect(CnpjInstance.valor).toBe("30.030.0");
    CnpjInstance.valor = "300300300";
    expect(CnpjInstance.valor).toBe("30.030.030/0");
    CnpjInstance.valor = "3003003003003";
    expect(CnpjInstance.valor).toBe("30.030.030/0300-3");
  });
});
