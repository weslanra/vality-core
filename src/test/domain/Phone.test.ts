import Phone, { FORMATO_TELEFONE_PADRAO_BR } from "@/valueObjects/Phone";

describe("Validar valueObject Phone", () => {
  it("deve inicializar com o formato brasileiro", () => {
    const telefone = new Phone("11987654321");
    expect(telefone.formato).toBe(FORMATO_TELEFONE_PADRAO_BR);
    expect(telefone.valor).toBe("(11) 9 8765-4321");
    expect(telefone.ehValido).toBe(true);
    expect(telefone.valueOf()).toBe("11987654321");
  });

  it("deve formatar parcialmente enquanto o usuário digita", () => {
    const telefone = new Phone("");

    telefone.valor = "11";
    expect(telefone.valor).toBe("(11");
    expect(telefone.ehValido).toBe("Telefone inválido");

    telefone.valor = "119";
    expect(telefone.valor).toBe("(11) 9");

    telefone.valor = "1198765";
    expect(telefone.valor).toBe("(11) 9 8765");

    telefone.valor = "11987654321";
    expect(telefone.valor).toBe("(11) 9 8765-4321");
    expect(telefone.ehValido).toBe(true);
  });

  it("deve aceitar valor já mascarado", () => {
    const telefone = new Phone("(11) 9 8765-4321");
    expect(telefone.valor).toBe("(11) 9 8765-4321");
    expect(telefone.valueOf()).toBe("11987654321");
  });

  it("deve remover letras e limitar à quantidade de # do formato", () => {
    const telefone = new Phone("11a98765-4321999");
    expect(telefone.valor).toBe("(11) 9 8765-4321");
    expect(telefone.valueOf()).toBe("11987654321");
  });

  it("deve ser válido quando vazio", () => {
    const telefone = new Phone("119");
    expect(telefone.ehValido).toBe("Telefone inválido");

    telefone.valor = "";
    expect(telefone.valor).toBe("");
    expect(telefone.ehValido).toBe(true);
    expect(telefone.valueOf()).toBe("");
  });

  it("deve formatar sem instância", () => {
    expect(Phone.formatar("11987654321")).toBe("(11) 9 8765-4321");
  });

  describe("formato de telefone fixo brasileiro (##) ####-####", () => {
    const formato = "(##) ####-####";

    it("deve formatar o número completo", () => {
      const telefone = new Phone("1123456789", formato);
      expect(telefone.formato).toBe(formato);
      expect(telefone.valor).toBe("(11) 2345-6789");
      expect(telefone.ehValido).toBe(true);
      expect(telefone.valueOf()).toBe("1123456789");
    });

    it("deve formatar parcialmente enquanto o usuário digita", () => {
      const telefone = new Phone("", formato);

      telefone.valor = "11";
      expect(telefone.valor).toBe("(11");
      expect(telefone.ehValido).toBe("Telefone inválido");

      telefone.valor = "112";
      expect(telefone.valor).toBe("(11) 2");

      telefone.valor = "112345";
      expect(telefone.valor).toBe("(11) 2345");

      telefone.valor = "1123456789";
      expect(telefone.valor).toBe("(11) 2345-6789");
      expect(telefone.ehValido).toBe(true);
    });

    it("deve aceitar valor já mascarado e descartar dígitos extras", () => {
      const telefone = new Phone("(11) 2345-678999", formato);
      expect(telefone.valor).toBe("(11) 2345-6789");
      expect(telefone.valueOf()).toBe("1123456789");
    });
  });

  describe("formato americano (###) ###-####", () => {
    const formato = "(###) ###-####";

    it("deve formatar o número completo", () => {
      const telefone = new Phone("2025550123", formato);
      expect(telefone.formato).toBe(formato);
      expect(telefone.valor).toBe("(202) 555-0123");
      expect(telefone.ehValido).toBe(true);
      expect(telefone.valueOf()).toBe("2025550123");
    });

    it("deve formatar parcialmente enquanto o usuário digita", () => {
      const telefone = new Phone("", formato);

      telefone.valor = "202";
      expect(telefone.valor).toBe("(202");
      expect(telefone.ehValido).toBe("Telefone inválido");

      telefone.valor = "2025";
      expect(telefone.valor).toBe("(202) 5");

      telefone.valor = "202555";
      expect(telefone.valor).toBe("(202) 555");

      telefone.valor = "2025550123";
      expect(telefone.valor).toBe("(202) 555-0123");
      expect(telefone.ehValido).toBe(true);
    });

    it("deve aceitar valor já mascarado e descartar dígitos extras", () => {
      const telefone = new Phone("(202) 555-012399", formato);
      expect(telefone.valor).toBe("(202) 555-0123");
      expect(telefone.valueOf()).toBe("2025550123");
      expect(Phone.formatar("2025550123", formato)).toBe("(202) 555-0123");
    });
  });
});
