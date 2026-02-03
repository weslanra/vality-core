# vality-core

Value objects e validações para formulários (CPF, CNPJ, Email, Moeda, DatePicker, Placa, Nome, etc.) em TypeScript/JavaScript.

## 📖 Documentação completa

**Instalação, API, exemplos em Vue 3, React e Angular:**  
**[Documentação principal no GitHub →](https://github.com/seu-usuario/vality-core/blob/main/docs/README.md)**

## Instalação

```bash
npm install vality-core
```

## Uso rápido

```ts
import { Cpf, Cnpj, Email, Moeda, DatePicker } from "vality-core";

const cpf = new Cpf("123.456.789-09");
const email = new Email("usuario@exemplo.com");
const moeda = new Moeda(1000);
```

Antes de publicar no NPM, substitua `seu-usuario` na URL da documentação pelo seu usuário ou organização no GitHub.
