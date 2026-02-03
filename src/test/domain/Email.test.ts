import Email from "@/valueObjects/Email";

describe("Validar valueObject Email", () => {
  it("deve inicializar com um email válido", () => {
    const emailInstance = new Email("teste@teste.teste");
    expect(emailInstance.valor).toBe("teste@teste.teste");
    expect(emailInstance.ehValido).toBe(true);
  });

  it("deve invalidar um formato de email incorreto", () => {
    const emailInstance = new Email("email-invalido");
    expect(emailInstance.ehValido).toBe(
      "O campo Email deve ser um email válido"
    );
  });

  it("deve atualizar para um email válido", () => {
    const emailInstance = new Email("teste@teste.teste");

    emailInstance.valor = "novoteste@novoteste.novoteste";
    expect(emailInstance.valor).toBe("novoteste@novoteste.novoteste");
    expect(emailInstance.ehValido).toBe(true);
  });

  it("deve ser inválido se o email mudar para um formato inválido", () => {
    const emailInstance = new Email("teste@teste.teste");
    emailInstance.valor = "email-invalido";
    expect(emailInstance.ehValido).toBe(
      "O campo Email deve ser um email válido"
    );
  });

  it("deve ser válido se um email inválido for alterado para vazio", () => {
    const emailInstance = new Email("teste@teste");
    expect(emailInstance.ehValido).toBe(
      "O campo Email deve ser um email válido"
    );
    emailInstance.valor = "";
    expect(emailInstance.ehValido).toBe(true);
  });

  it("deve sanitizar o email removendo espaços", () => {
    const emailInstance = new Email("teste@teste.teste");
    emailInstance.valor = "espaço teste@teste.teste";
    expect(emailInstance.valor).toBe("espacoteste@teste.teste");
    expect(emailInstance.ehValido).toBe(true);
  });

  it("deve remover acentos do email na inicialização", () => {
    const emailInstance = new Email("josé@exemplo.com");
    expect(emailInstance.valor).toBe("jose@exemplo.com");
    expect(emailInstance.ehValido).toBe(true);
  });

  it("deve remover acentos ao atualizar o valor do email", () => {
    const emailInstance = new Email("teste@teste.teste");
    emailInstance.valor = "mária@exemplo.com.br";
    expect(emailInstance.valor).toBe("maria@exemplo.com.br");
    expect(emailInstance.ehValido).toBe(true);
  });

  it("deve remover múltiplos tipos de acentos do email", () => {
    const emailInstance = new Email("josé.mãríâ@exemplo.com");
    expect(emailInstance.valor).toBe("jose.maria@exemplo.com");
    expect(emailInstance.ehValido).toBe(true);
  });

  it("deve remover acentos de todas as vogais acentuadas", () => {
    const emailInstance = new Email("áéíóú@exemplo.com");
    expect(emailInstance.valor).toBe("aeiou@exemplo.com");
    expect(emailInstance.ehValido).toBe(true);
  });

  it("deve remover cedilha (ç) do email", () => {
    const emailInstance = new Email("frança@exemplo.com");
    expect(emailInstance.valor).toBe("franca@exemplo.com");
    expect(emailInstance.ehValido).toBe(true);
  });

  it("deve remover acentos e espaços simultaneamente", () => {
    const emailInstance = new Email("josé maria@exémplo.com");
    expect(emailInstance.valor).toBe("josemaria@exemplo.com");
    expect(emailInstance.ehValido).toBe(true);
  });
});
