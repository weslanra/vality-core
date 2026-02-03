import Placa from "@/valueObjects/Placa";

describe("Validar valueObject Placa", () => {
  it("deve inicializar com uma Placa válida", () => {
    const instance = new Placa("QQQ-1A23");
    expect(instance.valor).toBe("QQQ-1A23");
    expect(instance.ehValido).toBe(true);
  });

  it("deve rejeitar Placa com menos de 6 dígitos", () => {
    const instance = new Placa("QQQ-1A2");
    expect(instance.ehValido).toBe("Placa inválida");
  });

  it("deve aceitar uma Placa válido via setter", () => {
    const instance = new Placa("QQQ-1A23");
    instance.valor = "QQQ-1B24";
    expect(instance.valor).toBe("QQQ-1B24");
    expect(instance.ehValido).toBe(true);
  });

  it("deve rejeitar Placa inválido via setter", () => {
    const instance = new Placa("QQQ-1A23");
    instance.valor = "QQQ-1A2";
    expect(instance.ehValido).toBe("Placa inválida");
  });

  it("deve remover caracteres especiais e letras", () => {
    const instance = new Placa("aba@#3003");
    expect(instance.valor).toBe("ABA-3003");
  });

  it("deve ser válido se uma Placa inválido for alterado para vazio", () => {
    const instance = new Placa("QQQ-1A2");
    expect(instance.ehValido).toBe("Placa inválida");
    instance.valor = "";
    expect(instance.ehValido).toBe(true);
  });

  it("deve retornar valor formatado caso realize a instância de uma Placa", () => {
    const instance = new Placa("QQQ1A23");
    expect(instance.valor).toBe("QQQ-1A23");
  });

  it("deve retornar valor formatado caso altere uma placa", () => {
    const instance = new Placa("QQQ-1A23");
    instance.valor = "ABA1B24";
    expect(instance.valor).toBe("ABA-1B24");
  });

  it("deve retornar valor sem formatação", () => {
    const instance = new Placa("QQQ-1A23");
    expect(instance.valueOf()).toBe("QQQ1A23");
  });

  it("deve permitir apenas 8 caracteres", () => {
    const instance = new Placa("QQQ-1A23212313141");
    expect(instance.valor).toBe("QQQ-1A23");
  });

  it("verificando validação feita no construtor", () => {
    const instance = new Placa("sjdhsjhd");
    expect(instance.ehValido).toBe("Placa inválida");
  });

  it("deve formatar corretamente", () => {
    const instance = new Placa("ABA3");
    expect(instance.valor).toBe("ABA-3");
    instance.valor = "ABA-3546";
    expect(instance.valor).toBe("ABA-3546");
  });
});
