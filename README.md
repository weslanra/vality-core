# vality-core

Value objects de formulário para TypeScript e JavaScript. Cada classe guarda o texto de um campo, aplica a máscara enquanto o usuário digita, valida a regra e expõe o valor bruto para a API.

Cobre dados comuns no Brasil: CPF, CNPJ (numérico e alfanumérico), e-mail, moeda, número, placa de veículo, nome completo e data/hora.

Exemplos completos de Vue 3, React e Angular: [docs/README.md](./docs/README.md).

## Instalação

```bash
npm install vality-core
```

Requer Node.js 16 ou superior. O pacote publica JavaScript e as declarações de tipo.

```ts
import { Cpf, Cnpj, CpfCnpj, Email, Moeda, Numero, Placa, NomeCompleto, DatePicker } from "vality-core";
```

## Como uma instância funciona

Crie **uma instância por campo** e mantenha ela durante a vida do formulário. A instância é mutável: atribuir `valor` recalcula máscara e validação no mesmo objeto.

Cada atribuição, no construtor ou no setter, segue o mesmo ciclo:

1. **Sanitiza** — descarta o que não pertence ao campo (letras num CPF, símbolos numa placa).
2. **Formata** — aplica a máscara parcial, para o texto acompanhar a digitação.
3. **Valida** — grava `ehValido`.
4. **Guarda** o texto formatado em `valor`.

Entrada inválida permanece no objeto. A biblioteca registra a mensagem em `ehValido` e segue editável.

```ts
const cpf = new Cpf("");

cpf.ehValido; // true

cpf.valor = "30030030030";
cpf.valor;     // "300.300.300-30"
cpf.ehValido;  // true
cpf.valueOf(); // "30030030030"

cpf.valor = "123";
cpf.valor;    // "123"
cpf.ehValido; // "CPF inválido"
```

### Contrato

| Membro | Papel |
| --- | --- |
| `valor` | Texto formatado, pronto para o input. Ler e atribuir. |
| `ehValido` | `true` ou a mensagem de erro (`string`). Compare com `=== true`. |
| `valueOf()` | Valor para persistir ou enviar. Documentos e placa saem sem máscara; moeda e número saem como `number`. |

Campo vazio é válido. `ehValido === true` com `valor === ""` significa “ainda não há o que rejeitar”. A obrigatoriedade fica no formulário:

```ts
const obrigatorio = cpf.valor !== "" && cpf.ehValido === true;
const mensagem = cpf.valor === "" ? "Informe o CPF" : cpf.ehValido;
```

`Cpf`, `Cnpj`, `CpfCnpj`, `Placa`, `Numero` e `Moeda` também expõem `formatar` estático, quando só a máscara é necessária, sem instância e sem validação.

## Ligando ao input

O input lê e escreve `valor`. A mensagem aparece quando `ehValido` é string.

**Vue 3** — o `ref` desembrulha a instância no template:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Cpf } from "vality-core";

const cpf = ref(new Cpf(""));
</script>

<template>
  <input v-model="cpf.valor" placeholder="CPF" />
  <span v-if="cpf.ehValido !== true">{{ cpf.ehValido }}</span>
</template>
```

**Angular** — a propriedade da classe já é a instância:

```html
<input [(ngModel)]="cpf.valor" placeholder="CPF" />
<span *ngIf="cpf.ehValido !== true">{{ cpf.ehValido }}</span>
```

**React** — a mutação de `valor` altera o objeto e o React redesenha quando algum estado muda. Guarde a instância estável e force um render depois da atribuição:

```tsx
const [cpf] = useState(() => new Cpf(""));
const [, atualizar] = useState(0);

<input
  value={cpf.valor}
  onChange={(e) => {
    cpf.valor = e.target.value;
    atualizar((n) => n + 1);
  }}
/>
```

No envio, use `valueOf()` (em `NomeCompleto`, use `valor`):

```ts
await api.post("/clientes", {
  cpf: cpf.valueOf(),
  email: email.valueOf(),
  valor: moeda.valueOf(),
});
```

## Value objects

### Cpf

Máscara `000.000.000-00`, no máximo 11 dígitos. Pontuação entra conforme o tamanho: `300.3`, `300.300.3`, `300.300.300-30`.

`valueOf()` devolve só os dígitos.

Vazio é válido. Com conteúdo, a validação exige 11 dígitos, rejeita sequência repetida (`111.111.111-11`) e confere os dois dígitos verificadores. Mensagem: `"CPF inválido"`.

```ts
const cpf = new Cpf("300.300.300-30");
cpf.valueOf(); // "30030030030"

Cpf.formatar("30030030030"); // "300.300.300-30"
```

### Cnpj

Máscara `00.000.000/0000-00`, 14 posições. Aceita o CNPJ alfanumérico da Receita Federal: as 12 primeiras posições são `A–Z` ou dígito, as duas últimas são os dígitos verificadores. Letras são gravadas em maiúsculas. O cálculo do DV usa o valor ASCII do caractere menos 48, como na especificação da Receita.

`valueOf()` devolve os 14 caracteres sem máscara (`"19JA2KO8Z00151"`).

Mensagem: `"Insira um CNPJ válido"`.

```ts
const cnpj = new Cnpj("19.JA2.KO8/Z001-51");
cnpj.ehValido;  // true
cnpj.valueOf(); // "19JA2KO8Z00151"
```

### CpfCnpj

Um campo só, que escolhe a máscara pelo conteúdo sanitizado:

- até 11 caracteres e sem letra nas nove primeiras posições: máscara de CPF;
- acima de 11 caracteres, ou com letra nessas posições: máscara de CNPJ.

`tipo` reflete essa escolha:

| Situação | `tipo` |
| --- | --- |
| 11 dígitos, sem letra no início | `"CPF"` |
| mais de 11 caracteres, ou letra nas nove primeiras posições | `"CNPJ"` |
| ainda curto e numérico | `null` |

Com 11 dígitos, a validação é a do `Cpf` (`"CPF inválido"`). Com letra ou com 12 a 14 caracteres, a validação é a do `Cnpj`. Fora isso, a mensagem é `"Insira um CPF ou CNPJ válido"`.

```ts
const doc = new CpfCnpj("30030030030");
doc.tipo;      // "CPF"
doc.valor;     // "300.300.300-30"

doc.valor = "30208494000165";
doc.tipo;      // "CNPJ"
doc.valor;     // "30.208.494/0001-65"
```

### Email

Remove espaços e acentos (`josé@exemplo.com` vira `jose@exemplo.com`) e valida o formato `local@domínio`. `valor` e `valueOf()` são a mesma string sanitizada.

Mensagem: `"O campo Email deve ser um email válido"`.

### Moeda

Especialização de `Numero` para dinheiro. O padrão brasileiro está em `FORMATO_MOEDA_PADRAO_BR`:

| Opção | Padrão |
| --- | --- |
| `prefix` | `"R$ "` |
| `decimal` | `","` |
| `separator` | `"."` |
| `precision` | `2` |
| `min` | `0` |

Um `number` é o valor já em reais. Uma `string` passa pela máscara: os últimos `precision` dígitos são os centavos. Por isso `new Moeda(1000)` exibe `"R$ 1.000,00"` e `new Moeda("1000")` exibe `"R$ 10,00"`.

Valor abaixo de `min` ou acima de `max` é **ajustado ao limite**, com o texto reescrito. O padrão `min: 0` transforma negativo em zero. Para permitir negativo, passe `min` menor que zero.

```ts
const preco = new Moeda(1000);
preco.valor;     // "R$ 1.000,00"
preco.valueOf(); // 1000

preco.valor = "123456";
preco.valor;     // "R$ 1.234,56"
preco.valueOf(); // 1234.56

const dolar = new Moeda(1234.56, {
  prefix: "$ ",
  decimal: ".",
  separator: ",",
  precision: 2,
});
dolar.valor; // "$ 1,234.56"
```

`ehValido` permanece `true`: o intervalo é aplicado no valor, e a mensagem de erro fica a cargo da tela.

### Numero

O mesmo ciclo de `Moeda`, com formato configurável. `FORMATO_NUMERO_PADRAO` usa vírgula decimal, ponto de milhar e `precision: 0` (inteiro).

```ts
interface NumeroOptions {
  prefix?: string;
  suffix?: string;
  separator: string;
  decimal: string;
  precision?: number;
  min?: number;
  max?: number;
}
```

`null` ou `""` limpam o campo (`valor === ""`, `valueOf() === null`). Texto sem dígitos também faz `valueOf()` devolver `null`. Os demais valores viram número e, se caírem fora de `min` ou `max`, são reescritos no limite. Sem `min` explícito, o piso usado nesse ajuste é `0`.

```ts
const quantidade = new Numero(1234.5, { decimal: ",", separator: ".", precision: 2 });
quantidade.valor;     // "1.234,50"
quantidade.valueOf(); // 1234.5

const percentual = new Numero(15, { decimal: ",", separator: ".", precision: 2, suffix: "%" });
percentual.valor; // "15,00%"
```

`formatador` devolve as opções efetivas. `setValor` é o mesmo que atribuir `valor`.

### Placa

Máscara `AAA-0A00` (hífen depois da terceira letra), no máximo 7 caracteres alfanuméricos. Enquanto há até 3 caracteres, só letras são mantidas.

O padrão aceito é Mercosul e a placa antiga: três letras, um dígito, um dígito ou letra, dois dígitos (`QQQ1A23`, `ABA3546`).

`valueOf()` devolve a placa sem hífen. Mensagem: `"Placa inválida"`.

```ts
const placa = new Placa("qqq1a23");
placa.valor;     // "QQQ-1A23"
placa.valueOf(); // "QQQ1A23"
```

### NomeCompleto

Mantém letras (com acento) e espaços. Números e símbolos saem fora.

Com texto, exige nome e sobrenome: pelo menos duas palavras separadas por espaço. Mensagem padrão: `"O nome deve possuir um sobrenome"`. O segundo argumento troca a palavra “nome” na frase.

Não há `valueOf()`. O texto a persistir é `valor`.

```ts
const nome = new NomeCompleto("Gabriel123 Teste@#$");
nome.valor; // "Gabriel Teste"

const cliente = new NomeCompleto("Ana", "nome do cliente");
cliente.ehValido; // "O nome do cliente deve possuir um sobrenome"
```

### DatePicker

Data e hora em pt-BR, com máscara progressiva. O locale informado fica disponível em `locale`; a formatação implementada é a pt-BR.

```ts
new DatePicker(data?: string, locale?: string, options?: DatePickerOptions)
```

`type` define máscara, `dateFormat` e o que `valueOf()` devolve:

| `type` | Enquanto digita | Completo | `dateFormat` | `valueOf()` |
| --- | --- | --- | --- | --- |
| `"date"` (padrão) | `15` → `15/0` → `15/08/2` | `15/08/2021` | `d/m/Y` | timestamp à meia-noite local |
| `"time"` | `15` → `15:0` | `15:08` | `H:i` | segundos desde meia-noite (`10:15` → `36900`) |
| `"datetime"` | data, depois hora | `15/08/2021 às 10:15` | `d/m/Y às H:i` | timestamp local |

O separador de data e hora padrão é `" às "`. `separator` troca esse trecho e entra no `dateFormat`.

Dia acima de 31 vira 31, dia 0 vira 01, mês acima de 12 vira 12, hora acima de 23 vira 23, minuto acima de 59 vira 59.

Dois pares de limites, com efeitos diferentes:

- **`minDateLimit` / `maxDateLimit`** reescrevem o texto. O padrão é 01/01/1900 e **a data de hoje**. Uma data futura digitada vira o dia atual. Para aceitar futuro, passe um `maxDateLimit` posterior. O mesmo vale para `minTimeLimit` e `maxTimeLimit` (`{ hour, minute }`).
- **`minDate` / `maxDate`** preservam o texto e falham a validação. A forma é `{ valor: Date, campo?: string }`. Sem `campo`, a mensagem cita a data (`"Deve ser superior à 01/01/2021"`). Com `campo`, cita o nome (`"Deve ser superior à data de nascimento"`). `minTime` e `maxTime` geram `"Hora mínima HH:MM"` e `"Hora máxima HH:MM"`.

Mensagens de formato incompleto: `"Data inválida"`, `"Hora inválida"`, `"Data e hora inválida"`.

`valueOf()` devolve `NaN` quando `ehValido` não é `true`. `toISOString()` devolve a data em ISO; em `type: "time"`, devolve `"HH:MM:00Z"`. Data impossível de converter lança `Error("Data inválida")`.

```ts
const nascimento = new DatePicker("", "pt-br", {
  type: "date",
  maxDateLimit: new Date(2100, 11, 31),
  maxDate: { valor: new Date(), campo: "hoje" },
});

nascimento.valor = "15082021";
nascimento.valor;    // "15/08/2021"
nascimento.valueOf(); // timestamp
```

## Utilitário exportado

`isEmpty` trata `null`, `undefined`, `""` e array vazio como vazio. Os value objects usam essa regra para aceitar campo em branco.

Também são exportados os tipos `ICpf`, `ICnpj`, `ICpfCnpj`, `IEmail`, `IMoeda`, `INumero`, `IPlaca`, `INome`, `IDatePicker`, `DatePickerOptions`, `MoedaOptions`, `NumeroOptions` e a classe base `ValueObjects`.

## Licença

MIT.
