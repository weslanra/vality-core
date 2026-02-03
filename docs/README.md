# Documentação vality-core

## Objetivo do pacote

O **vality-core** é uma biblioteca de **value objects** e **validações** para formulários em aplicações TypeScript/JavaScript. O objetivo é centralizar regras de negócio e formatação para documentos e dados comuns no Brasil (CPF, CNPJ, e-mail, moeda, placa de veículo, nome completo, datas etc.), garantindo:

- **Validação** consistente (incluindo dígitos verificadores onde aplicável)
- **Formatação** automática (máscaras, separadores, locale)
- **Reuso** do mesmo modelo em qualquer front-end (Vue, React, Angular) ou Node

Assim, o vality-core atua como camada de domínio compartilhada entre projetos, reduzindo duplicação e erros em formulários.

---

## Open-source

Este projeto é **open-source**. O código está disponível no repositório do GitHub sob licença MIT. Contribuições, issues e sugestões são bem-vindas.

---

## Instalação

```bash
npm install vality-core
```

---

## Value Objects disponíveis

| Value Object   | Uso principal                          |
|----------------|----------------------------------------|
| **Cpf**        | CPF (validação + formatação)          |
| **Cnpj**       | CNPJ (validação + formatação)          |
| **CpfCnpj**    | CPF ou CNPJ (detecta pelo tamanho)     |
| **Email**      | E-mail (validação + sanitização)       |
| **Moeda**      | Valores monetários (ex.: R$ 1.234,56) |
| **Numero**     | Números com separador/decimal/casas    |
| **Placa**      | Placa de veículo (padrão Mercosul)    |
| **NomeCompleto** | Nome completo (ex.: nome + sobrenome) |
| **DatePicker** | Data/hora (locale pt-Br, formato configurável) |

Todos expõem: `valor` (string formatada), `ehValido` (`true` ou mensagem de erro), `valueOf()` (valor bruto para persistência/API) e métodos estáticos como `formatar` quando aplicável.

---

## Forma recomendada de uso

A melhor forma de usar os value objects é **manter uma única instância por campo** e **vincular o input à propriedade `valor`** da instância:

1. **Criar a instância** uma vez (no Vue: `ref(new Cpf(""))`, no React: `useState(() => new Cpf(""))`, no Angular: propriedade `cpf = new Cpf("")`).
2. **Ligar o campo ao `.valor`**: no Vue `v-model="cpf.valor"`, no Angular `[(ngModel)]="cpf.valor"`, no React `value={cpf.valor}` e `onChange` atribuindo a `cpf.valor`.
3. **Exibir validação** com `ehValido` (quando não for `true`, é a mensagem de erro).
4. **Enviar à API** com `valueOf()` (valor sem formatação).

Assim, validação e formatação ficam centralizadas no value object e o formulário só consome `valor`, `ehValido` e `valueOf()`.

---

## Exemplos por framework

Todos os exemplos seguem o padrão acima. Em **Vue 3**, o `ref` é desembrulhado no template, então `cpf` no template é a instância de `Cpf` e `v-model="cpf.valor"` funciona diretamente.

---

### Cpf

**Vue 3 (Composition API)**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { Cpf } from "vality-core";

const cpf = ref(new Cpf(""));

const cpfFormatado = computed(() => cpf.value.valor);
const cpfValido = computed(() => cpf.value.ehValido === true);
</script>

<template>
  <input
    v-model="cpf.valor"
    type="text"
    placeholder="CPF"
  />
  <span v-if="!cpfValido" class="erro">{{ cpf.ehValido }}</span>
  <p>Valor bruto (valueOf): {{ cpf.valueOf() }}</p>
</template>
```

**React**

```tsx
import { useState } from "react";
import { Cpf } from "vality-core";

export function FormCpf() {
  const [cpf] = useState(() => new Cpf(""));
  const ehValido = cpf.ehValido === true;

  return (
    <>
      <input
        value={cpf.valor}
        onChange={(e) => { cpf.valor = e.target.value; }}
        placeholder="CPF"
      />
      {!ehValido && <span className="erro">{cpf.ehValido}</span>}
      <p>Valor bruto: {cpf.valueOf()}</p>
    </>
  );
}
```

**Angular**

```ts
// cpf.component.ts
import { Component } from "@angular/core";
import { Cpf } from "vality-core";

@Component({ selector: "app-cpf", templateUrl: "./cpf.component.html" })
export class CpfComponent {
  cpf = new Cpf("");

  get ehValido(): boolean {
    return this.cpf.ehValido === true;
  }
}
```

```html
<!-- cpf.component.html -->
<input [(ngModel)]="cpf.valor" placeholder="CPF" />
<span *ngIf="!ehValido" class="erro">{{ cpf.ehValido }}</span>
<p>Valor bruto: {{ cpf.valueOf() }}</p>
```

---

### Cnpj

**Vue 3**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { Cnpj } from "vality-core";

const cnpj = ref(new Cnpj(""));

const cnpjFormatado = computed(() => cnpj.value.valor);
const cnpjValido = computed(() => cnpj.value.ehValido === true);
</script>

<template>
  <input v-model="cnpj.valor" placeholder="CNPJ" />
  <span v-if="!cnpjValido" class="erro">{{ cnpj.ehValido }}</span>
  <p>Valor bruto (valueOf): {{ cnpj.valueOf() }}</p>
</template>
```

**React**

```tsx
import { useState } from "react";
import { Cnpj } from "vality-core";

export function FormCnpj() {
  const [cnpj] = useState(() => new Cnpj(""));
  return (
    <>
      <input
        value={cnpj.valor}
        onChange={(e) => { cnpj.valor = e.target.value; }}
        placeholder="CNPJ"
      />
      {cnpj.ehValido !== true && <span>{cnpj.ehValido}</span>}
      <p>Valor bruto: {cnpj.valueOf()}</p>
    </>
  );
}
```

**Angular**

```ts
cnpj = new Cnpj("");
```

```html
<input [(ngModel)]="cnpj.valor" placeholder="CNPJ" />
<span *ngIf="cnpj.ehValido !== true">{{ cnpj.ehValido }}</span>
<p>Valor bruto: {{ cnpj.valueOf() }}</p>
```

---

### CpfCnpj (CPF ou CNPJ)

**Vue 3**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { CpfCnpj } from "vality-core";

const cpfCnpj = ref(new CpfCnpj(""));

const cpfCnpjFormatado = computed(() => cpfCnpj.value.valor);
const cpfCnpjValido = computed(() => cpfCnpj.value.ehValido === true);
</script>

<template>
  <input v-model="cpfCnpj.valor" placeholder="CPF ou CNPJ" />
  <span v-if="!cpfCnpjValido" class="erro">{{ cpfCnpj.ehValido }}</span>
  <p>Tipo: {{ cpfCnpj.tipo }}</p>
  <p>Valor bruto (valueOf): {{ cpfCnpj.valueOf() }}</p>
</template>
```

**React**

```tsx
import { useState } from "react";
import { CpfCnpj } from "vality-core";

export function FormCpfCnpj() {
  const [cpfCnpj] = useState(() => new CpfCnpj(""));
  return (
    <>
      <input
        value={cpfCnpj.valor}
        onChange={(e) => { cpfCnpj.valor = e.target.value; }}
        placeholder="CPF ou CNPJ"
      />
      {cpfCnpj.ehValido !== true && <span>{cpfCnpj.ehValido}</span>}
      <p>Tipo: {cpfCnpj.tipo}</p>
      <p>Valor bruto: {cpfCnpj.valueOf()}</p>
    </>
  );
}
```

**Angular**

```ts
cpfCnpj = new CpfCnpj("");
```

```html
<input [(ngModel)]="cpfCnpj.valor" placeholder="CPF ou CNPJ" />
<span *ngIf="cpfCnpj.ehValido !== true">{{ cpfCnpj.ehValido }}</span>
<p>Tipo: {{ cpfCnpj.tipo }}</p>
<p>Valor bruto: {{ cpfCnpj.valueOf() }}</p>
```

---

### Email

**Vue 3**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { Email } from "vality-core";

const email = ref(new Email(""));

const emailFormatado = computed(() => email.value.valor);
const emailValido = computed(() => email.value.ehValido === true);
</script>

<template>
  <input v-model="email.valor" type="email" placeholder="E-mail" />
  <span v-if="!emailValido" class="erro">{{ email.ehValido }}</span>
  <p>Valor bruto (valueOf): {{ email.valueOf() }}</p>
</template>
```

**React**

```tsx
import { useState } from "react";
import { Email } from "vality-core";

export function FormEmail() {
  const [email] = useState(() => new Email(""));
  return (
    <>
      <input
        value={email.valor}
        onChange={(e) => { email.valor = e.target.value; }}
        type="email"
        placeholder="E-mail"
      />
      {email.ehValido !== true && <span>{email.ehValido}</span>}
      <p>Valor bruto: {email.valueOf()}</p>
    </>
  );
}
```

**Angular**

```ts
email = new Email("");
```

```html
<input [(ngModel)]="email.valor" type="email" placeholder="E-mail" />
<span *ngIf="email.ehValido !== true">{{ email.ehValido }}</span>
<p>Valor bruto: {{ email.valueOf() }}</p>
```

---

### Moeda

**Vue 3**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { Moeda } from "vality-core";

const valor = ref(new Moeda(0));

const valorFormatado = computed(() => valor.value.valor);
const valorValido = computed(() => valor.value.ehValido === true);
</script>

<template>
  <input v-model="valor.valor" placeholder="Valor (R$)" />
  <span v-if="!valorValido" class="erro">{{ valor.ehValido }}</span>
  <p>Numérico (valueOf): {{ valor.valueOf() }}</p>
</template>
```

**React**

```tsx
import { useState } from "react";
import { Moeda } from "vality-core";

export function FormMoeda() {
  const [valor] = useState(() => new Moeda(0));
  return (
    <>
      <input
        value={valor.valor}
        onChange={(e) => { valor.valor = e.target.value; }}
        placeholder="Valor (R$)"
      />
      {valor.ehValido !== true && <span>{valor.ehValido}</span>}
      <p>Numérico: {valor.valueOf()}</p>
    </>
  );
}
```

**Angular**

```ts
valor = new Moeda(0);
```

```html
<input [(ngModel)]="valor.valor" placeholder="Valor (R$)" />
<span *ngIf="valor.ehValido !== true">{{ valor.ehValido }}</span>
<p>Numérico: {{ valor.valueOf() }}</p>
```

---

### Numero

**Vue 3**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { Numero, FORMATO_PADRAO } from "vality-core";

const numero = ref(new Numero(null, { ...FORMATO_PADRAO, precision: 2 }));

const numeroFormatado = computed(() => numero.value.valor);
const numeroValido = computed(() => numero.value.ehValido === true);
</script>

<template>
  <input v-model="numero.valor" placeholder="Número" />
  <span v-if="!numeroValido" class="erro">{{ numero.ehValido }}</span>
  <p>valueOf: {{ numero.valueOf() }}</p>
</template>
```

**React**

```tsx
import { useState } from "react";
import { Numero, FORMATO_PADRAO } from "vality-core";

export function FormNumero() {
  const [numero] = useState(() => new Numero(null, { ...FORMATO_PADRAO, precision: 2 }));
  return (
    <>
      <input
        value={numero.valor}
        onChange={(e) => { numero.valor = e.target.value; }}
        placeholder="Número"
      />
      {numero.ehValido !== true && <span>{numero.ehValido}</span>}
      <p>valueOf: {numero.valueOf()}</p>
    </>
  );
}
```

**Angular**

```ts
import { FORMATO_PADRAO } from "vality-core";
numero = new Numero(null, { ...FORMATO_PADRAO, precision: 2 });
```

```html
<input [(ngModel)]="numero.valor" placeholder="Número" />
<span *ngIf="numero.ehValido !== true">{{ numero.ehValido }}</span>
<p>valueOf: {{ numero.valueOf() }}</p>
```

---

### Placa

**Vue 3**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { Placa } from "vality-core";

const placa = ref(new Placa(""));

const placaFormatada = computed(() => placa.value.valor);
const placaValida = computed(() => placa.value.ehValido === true);
</script>

<template>
  <input v-model="placa.valor" placeholder="Placa (ABC1D23)" />
  <span v-if="!placaValida" class="erro">{{ placa.ehValido }}</span>
  <p>Valor bruto (valueOf): {{ placa.valueOf() }}</p>
</template>
```

**React**

```tsx
import { useState } from "react";
import { Placa } from "vality-core";

export function FormPlaca() {
  const [placa] = useState(() => new Placa(""));
  return (
    <>
      <input
        value={placa.valor}
        onChange={(e) => { placa.valor = e.target.value; }}
        placeholder="Placa (ABC1D23)"
      />
      {placa.ehValido !== true && <span>{placa.ehValido}</span>}
      <p>Valor bruto: {placa.valueOf()}</p>
    </>
  );
}
```

**Angular**

```ts
placa = new Placa("");
```

```html
<input [(ngModel)]="placa.valor" placeholder="Placa (ABC1D23)" />
<span *ngIf="placa.ehValido !== true">{{ placa.ehValido }}</span>
<p>Valor bruto: {{ placa.valueOf() }}</p>
```

---

### NomeCompleto

**Vue 3**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { NomeCompleto } from "vality-core";

const nome = ref(new NomeCompleto(""));

const nomeFormatado = computed(() => nome.value.valor);
const nomeValido = computed(() => nome.value.ehValido === true);
</script>

<template>
  <input v-model="nome.valor" placeholder="Nome completo" />
  <span v-if="!nomeValido" class="erro">{{ nome.ehValido }}</span>
</template>
```

**React**

```tsx
import { useState } from "react";
import { NomeCompleto } from "vality-core";

export function FormNomeCompleto() {
  const [nome] = useState(() => new NomeCompleto(""));
  return (
    <>
      <input
        value={nome.valor}
        onChange={(e) => { nome.valor = e.target.value; }}
        placeholder="Nome completo"
      />
      {nome.ehValido !== true && <span>{nome.ehValido}</span>}
    </>
  );
}
```

**Angular**

```ts
nome = new NomeCompleto("");
```

```html
<input [(ngModel)]="nome.valor" placeholder="Nome completo" />
<span *ngIf="nome.ehValido !== true">{{ nome.ehValido }}</span>
```

---

### DatePicker

**Vue 3**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { DatePicker } from "vality-core";

const data = ref(new DatePicker("", "pt-br", { type: "date" }));

const dataFormatada = computed(() => data.value.valor);
const dataValida = computed(() => data.value.ehValido === true);
</script>

<template>
  <input v-model="data.valor" placeholder="dd/mm/aaaa" />
  <span v-if="!dataValida" class="erro">{{ data.ehValido }}</span>
  <p>Formato: {{ data.dateFormat }}</p>
  <p>Timestamp (valueOf): {{ data.valueOf() }}</p>
</template>
```

**React**

```tsx
import { useState } from "react";
import { DatePicker } from "vality-core";

export function FormDatePicker() {
  const [data] = useState(() => new DatePicker("", "pt-br", { type: "date" }));
  return (
    <>
      <input
        value={data.valor}
        onChange={(e) => { data.valor = e.target.value; }}
        placeholder="dd/mm/aaaa"
      />
      {data.ehValido !== true && <span>{data.ehValido}</span>}
      <p>Formato: {data.dateFormat}</p>
      <p>Timestamp: {data.valueOf()}</p>
    </>
  );
}
```

**Angular**

```ts
data = new DatePicker("", "pt-br", { type: "date" });
```

```html
<input [(ngModel)]="data.valor" placeholder="dd/mm/aaaa" />
<span *ngIf="data.ehValido !== true">{{ data.ehValido }}</span>
<p>Formato: {{ data.dateFormat }}</p>
<p>Timestamp: {{ data.valueOf() }}</p>
```

---

## Exemplo de uso em projeto Vue (vue-example-usage)

O repositório inclui a pasta **vue-example-usage** com um projeto Vue 3 que usa vality-core em formulários reais (perfil, operações, wizard, etc.), sempre no padrão: `ref(new ValueObject())` e `v-model="campo.valor"`. Você pode rodar esse projeto localmente para ver todos os value objects integrados a campos, validações e máscaras.

---

## API resumida

- **Cpf**, **Cnpj**, **CpfCnpj**: `valor`, `ehValido`, `valueOf()`, `formatar(valor)`
- **Email**: `valor`, `ehValido`, `valueOf()`
- **Moeda**, **Numero**: `valor`, `ehValido`, `valueOf()`, opções de formatação (decimal, separator, precision, prefix, suffix)
- **Placa**: `valor`, `ehValido`, `valueOf()`, `formatar(valor)`
- **NomeCompleto**: `valor`, `ehValido`, `validar(valor)`
- **DatePicker**: `valor`, `ehValido`, `locale`, `options`, `dateFormat`, `valueOf()`, `toISOString()`, `formatar(valor)`, `validar(valor)`

Tipos e interfaces estão exportados para uso em TypeScript.
