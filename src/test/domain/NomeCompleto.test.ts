import NomeCompleto from "@/valueObjects/NomeCompleto";

describe("NomeCompleto", () => {
  it("Deve criar uma instância de nome válida", () => {
    const nameInstance = new NomeCompleto("Gabriel Reis");
    expect(nameInstance.ehValido).toBe(true);
  });

  it("Deve retornar criar uma instância de nome e retornar o value correspondente ao nome para todos os nomes passados", () => {
    const nameInstance = new NomeCompleto("Alice Santos");
    expect(nameInstance.valor).toBe("Alice Santos");

    nameInstance.valor = "Carlos Lima";

    expect(nameInstance.valor).toBe("Carlos Lima");
  });

  it("Deve setar uma mensagem no isValid dizendo que o nome precisar ter um sobrenome e atribuir, exatamente o mesmo, valor passado ao name.valor", () => {
    const name = new NomeCompleto("Gabriel");
    expect(name.ehValido).toBe("O nome deve possuir um sobrenome");
  });

  it("Deve considerar ehValido true quando o nome foi vazio", () => {
    const name = new NomeCompleto("");
    expect(name.ehValido).toBe(true);
  });

  it("Deve remover caracteres especiais e números caso seja instânciado", () => {
    const name = new NomeCompleto("Gabriel123 Teste@#$");
    expect(name.valor).toBe("Gabriel Teste");
  });

  it("Deve remover caracteres especiais e números caso seja alterado a informação", () => {
    const name = new NomeCompleto("Gabriel Teste");
    name.valor = "Novo123 Nome@#$";
    expect(name.valor).toBe("Novo Nome");
  });

  it("Deve setar uma mensagem no isValid contendo o valor do parametro 'nomeDoCampo' passado no construtor da classe", () => {
    const name = new NomeCompleto("Gabriel", "nome do cliente");
    expect(name.ehValido).toBe("O nome do cliente deve possuir um sobrenome");
  });
});
