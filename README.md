# vality-core

Value objects e validações para formulários (CPF, CNPJ, Email, Moeda, DatePicker, Placa, Nome, etc.) em TypeScript/JavaScript.

## 📖 Documentação completa

**Instalação, API, exemplos em Vue 3, React e Angular:**  
**[Documentação principal →](https://github.com/weslanra/vality-core/tree/main/docs)**

## Instalação

```bash
npm install vality-core
```

## Uso rápido

```ts
import { Cpf, Cnpj, Email, Moeda, DatePicker } from "vality-core";

const cpf = new Cpf("123.456.789-09");
console.log(cpf.ehValido) // true

const email = new Email("usuario@exemplo.com");
console.log(email.ehValido) // true

const moeda = new Moeda(1000);
console.log(moeda.valor) // R$ 1000,00
```
