import Cpf from "@/valueObjects/Cpf";

describe("Validar valueObject CPF", () => {
  it("deve inicializar com um CPF válido", () => {
    const CpfInstance = new Cpf("300.300.300-30");
    expect(CpfInstance.valor).toBe("300.300.300-30");
    expect(CpfInstance.ehValido).toBe(true);
  });

  it("deve rejeitar CPF com menos de 11 dígitos", () => {
    const CpfInstance = new Cpf("123.456.789");
    expect(CpfInstance.ehValido).toBe("CPF inválido");
  });

  it("deve rejeitar CPF com sequência de números repetidos", () => {
    const CpfInstance = new Cpf("111.111.111-11");
    expect(CpfInstance.ehValido).toBe("CPF inválido");
  });

  it("deve rejeitar CPF com dígitos verificadores incorretos", () => {
    const CpfInstance = new Cpf("123.456.789-00");
    expect(CpfInstance.ehValido).toBe("CPF inválido");
  });

  it("deve aceitar um CPF válido via setter", () => {
    const CpfInstance = new Cpf("300.300.300-30");
    CpfInstance.valor = "218.289.060-26";
    expect(CpfInstance.valor).toBe("218.289.060-26");
    expect(CpfInstance.ehValido).toBe(true);
  });

  it("deve rejeitar CPF inválido via setter", () => {
    const CpfInstance = new Cpf("300.300.300-30");
    CpfInstance.valor = "192.837.465-00";
    expect(CpfInstance.ehValido).toBe("CPF inválido");
  });

  it("deve remover caracteres especiais e letras", () => {
    const CpfInstance = new Cpf("3ab.3@#.300-30");
    expect(CpfInstance.valor).toBe("333.003.0");
  });

  it("deve ser válido se um CPF inválido for alterado para vazio", () => {
    const CpfInstance = new Cpf("123.456.789-00");
    expect(CpfInstance.ehValido).toBe("CPF inválido");
    CpfInstance.valor = "";
    expect(CpfInstance.ehValido).toBe(true);
  });

  it("deve retornar valor formatado caso realize a instância de um cpf", () => {
    const CpfInstance = new Cpf("30030030030");
    expect(CpfInstance.valor).toBe("300.300.300-30");
  });

  it("deve retornar valor formatado caso altere um cpf", () => {
    const CpfInstance = new Cpf("300.300.300-30");
    CpfInstance.valor = "21828906026";
    expect(CpfInstance.valor).toBe("218.289.060-26");
  });

  it("deve retornar valor sem formatação", () => {
    const CpfInstance = new Cpf("300.300.300-30");
    expect(CpfInstance.valueOf()).toBe("30030030030");
  });

  it("deve permitir apenas 11 números", () => {
    const CpfInstance = new Cpf("300.300.300-3065465465");
    expect(CpfInstance.valor).toBe("300.300.300-30");
  });

  it("verificando validação feita no construtor", () => {
    const CnpjInstance = new Cpf("sjdhsjhd");
    expect(CnpjInstance.ehValido).toBe(true);
  });

  it("deve formatar corretamente", () => {
    const CnpjInstance = new Cpf("3003");
    expect(CnpjInstance.valor).toBe("300.3");
    CnpjInstance.valor = "3003003";
    expect(CnpjInstance.valor).toBe("300.300.3");
    CnpjInstance.valor = "3003003003";
    expect(CnpjInstance.valor).toBe("300.300.300-3");
  });
});
