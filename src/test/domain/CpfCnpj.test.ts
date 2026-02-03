import CpfCnpj from "@/valueObjects/CpfCnpj";

describe("Validar valueObject CPF e CNPJ", () => {
  it("deve inicializar com um CPF válido", () => {
    const CpfCnpjInstance = new CpfCnpj("300.300.300-30");
    expect(CpfCnpjInstance.valor).toBe("300.300.300-30");
    expect(CpfCnpjInstance.ehValido).toBe(true);
  });

  it("deve inicializar com um CNPJ válido", () => {
    const CpfCnpjInstance = new CpfCnpj("30.208.494/0001-65");
    expect(CpfCnpjInstance.valor).toBe("30.208.494/0001-65");
    expect(CpfCnpjInstance.ehValido).toBe(true);
  });

  it("deve rejeitar valor com menos de 11 dígitos", () => {
    const CpfCnpjInstance = new CpfCnpj("123.456.78");
    expect(CpfCnpjInstance.ehValido).toBe("Insira um CPF ou CNPJ válido");
  });

  it("deve rejeitar valor com mais de 11 dígitos e menos de 14 dígitos", () => {
    const CpfCnpjInstance = new CpfCnpj("04.252.011/0001");
    expect(CpfCnpjInstance.ehValido).toBe("Insira um CNPJ válido");
  });

  it("deve rejeitar um CPF incorreto", () => {
    const CpfCnpjInstance = new CpfCnpj("192.837.465-00");
    expect(CpfCnpjInstance.ehValido).toBe("CPF inválido");
  });

  it("deve rejeitar um CNPJ incorreto", () => {
    const CpfCnpjInstance = new CpfCnpj("04.252.011/0001-11");
    expect(CpfCnpjInstance.ehValido).toBe("Insira um CNPJ válido");
  });

  it("deve aceitar um CPF válido via setter", () => {
    const CpfCnpjInstance = new CpfCnpj("300.300.300-30");
    CpfCnpjInstance.valor = "218.289.060-26";
    expect(CpfCnpjInstance.valor).toBe("218.289.060-26");
    expect(CpfCnpjInstance.ehValido).toBe(true);
  });

  it("deve rejeitar CPF inválido via setter", () => {
    const CpfCnpjInstance = new CpfCnpj("300.300.300-30");
    CpfCnpjInstance.valor = "192.837.465-00";
    expect(CpfCnpjInstance.ehValido).toBe("CPF inválido");
  });

  it("deve aceitar um CNPJ válido via setter", () => {
    const CpfCnpjInstance = new CpfCnpj("30.208.494/0001-65");
    CpfCnpjInstance.valor = "11.658.798/0001-80";
    expect(CpfCnpjInstance.valor).toBe("11.658.798/0001-80");
    expect(CpfCnpjInstance.ehValido).toBe(true);
  });

  it("deve rejeitar CNPJ inválido via setter", () => {
    const CpfCnpjInstance = new CpfCnpj("30.208.494/0001-65");
    CpfCnpjInstance.valor = "20.392.312/0001-00";
    expect(CpfCnpjInstance.ehValido).toBe("Insira um CNPJ válido");
  });

  it("deve ser válido se um CPF inválido for alterado para vazio", () => {
    const CpfCnpjInstance = new CpfCnpj("123.456.789-00");
    expect(CpfCnpjInstance.ehValido).toBe("CPF inválido");
    CpfCnpjInstance.valor = "";
    expect(CpfCnpjInstance.ehValido).toBe(true);
  });

  it("deve ser válido se um CNPJ inválido for alterado para vazio", () => {
    const CpfCnpjInstance = new CpfCnpj("04.252.011/0001-11");
    expect(CpfCnpjInstance.ehValido).toBe("Insira um CNPJ válido");
    CpfCnpjInstance.valor = "";
    expect(CpfCnpjInstance.ehValido).toBe(true);
  });

  it("deve retornar valor formatado com cpf caso seja menor ou igual 11 números", () => {
    const CpfCnpjInstance = new CpfCnpj("300300300");
    expect(CpfCnpjInstance.valor).toBe("300.300.300");
    CpfCnpjInstance.valor = "30030030030";
    expect(CpfCnpjInstance.valor).toBe("300.300.300-30");
  });

  it("deve retornar valor formatado com cnpj caso seja maior que 11", () => {
    const CpfCnpjInstance = new CpfCnpj("302084940001");
    expect(CpfCnpjInstance.valor).toBe("30.208.494/0001");
    CpfCnpjInstance.valor = "30208494000165";
    expect(CpfCnpjInstance.valor).toBe("30.208.494/0001-65");
  });

  it("deve retornar valor sem formatação", () => {
    const CpfCnpjInstance = new CpfCnpj("300.300.300-30");
    expect(CpfCnpjInstance.valueOf()).toBe("30030030030");
    CpfCnpjInstance.valor = "30.208.494/0001-65";
    expect(CpfCnpjInstance.valueOf()).toBe("30208494000165");
  });

  it("deve permitir apenas 14 números", () => {
    const CpfCnpjInstance = new CpfCnpj("302.084.940.00/1-6578987987");
    expect(CpfCnpjInstance.valor).toBe("30.208.494/0001-65");
  });

  it("deve remover caracteres especiais e letras", () => {
    const CpfInstance = new CpfCnpj("3ab.3@#.300-3045");
    expect(CpfInstance.valor).toBe("333.003.045");
  });

  it("deve retornar tipo CPF quando possui 11 caracteres", () => {
    const CnpjInstance = new CpfCnpj("300.300.300-30");
    expect(CnpjInstance.tipo).toBe("CPF");
  });

  it("deve retornar tipo CNPJ quando possui 14 caracteres", () => {
    const CnpjInstance = new CpfCnpj("30.208.494/0001-65");
    expect(CnpjInstance.tipo).toBe("CNPJ");
  });

  it("deve retornar tipo null quando não possui 14 ou 11 caracteres", () => {
    const CnpjInstance = new CpfCnpj("1234567891234");
    expect(CnpjInstance.tipo).toBe(null);
  });

  it("verificando validação feita no construtor", () => {
    const CnpjInstance = new CpfCnpj("sjdhsjhd");
    expect(CnpjInstance.ehValido).toBe(true);
  });

  it("deve formatar corretamente", () => {
    const CnpjInstance = new CpfCnpj("3003");
    expect(CnpjInstance.valor).toBe("300.3");
    CnpjInstance.valor = "3003003";
    expect(CnpjInstance.valor).toBe("300.300.3");
    CnpjInstance.valor = "3003003003";
    expect(CnpjInstance.valor).toBe("300.300.300-3");
    CnpjInstance.valor = "300300300300";
    expect(CnpjInstance.valor).toBe("30.030.030/0300");
    CnpjInstance.valor = "3003003003003";
    expect(CnpjInstance.valor).toBe("30.030.030/0300-3");
    CnpjInstance.valor = "3003003003";
    expect(CnpjInstance.valor).toBe("300.300.300-3");
  });
});
