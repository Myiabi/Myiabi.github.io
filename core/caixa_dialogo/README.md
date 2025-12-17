### Sistema de Diálogo Dinâmico

##

📘 Descrição

- Sistema de diálogo estilo _visual novel_ criado dinamicamente via JavaScript.
- Suporta múltiplos personagens, expressões e transições de cena.
- Permite chamadas simples, cutscenes encadeadas (com `await`) e callbacks após o término.
- **Suporta formatação HTML** nas falas (negrito, itálico, cores, etc.)

---

## 🎨 Formatação de Texto nas Falas

Você pode usar tags HTML dentro do texto das falas para estilizar palavras ou trechos específicos:

| Tag                  | Efeito             | Exemplo                                                |
| -------------------- | ------------------ | ------------------------------------------------------ |
| `<b>` ou `<strong>`  | **Negrito**        | `"Isso é <b>importante</b>!"`                          |
| `<i>` ou `<em>`      | _Itálico_          | `"Ela disse <i>sussurrando</i>..."`                    |
| `<u>`                | Sublinhado         | `"<u>Nunca</u> esqueça disso."`                        |
| `<s>`                | ~~Riscado~~        | `"O preço era <s>100</s> 50 moedas."`                  |
| `<mark>`             | Destacado          | `"A palavra <mark>chave</mark> é..."`                  |
| `<span style="...">` | Estilo customizado | `"Texto <span style=\"color: red;\">vermelho</span>!"` |

### Exemplos no falas.js:

```js
falas: {
  inicio: [
    {
      texto: "Eu vim com minha esposa e <b>sêxtuplos</b> mas eles se <i>perderam</i>.",
      expressao: "normal",
    },
    {
      texto: "A palavra <span style=\"color: gold; font-size: 1.3em;\">LUA</span> é importante!",
      expressao: "pensativo",
    },
    {
      texto: "Cuidado com o <span style=\"color: red; text-shadow: 0 0 5px red;\">PERIGO</span>!",
      expressao: "normal",
    },
  ],
}
```

> ⚠️ **Nota:** O efeito de digitação (typewriter) funciona normalmente com a formatação!

---

## Mudar falas (e salvar também)

```js
mudarCenario(personagens.aiko, "depoisDoMinigame");
```

##

## 🎮 Formas de Chamar o Diálogo

**1. Click direto (event listener em imagem, botão ou elemento)**

```js
document.getElementById("npcAiko").addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.aiko);
});
```

**2. Pelo Console do Navegador (para testes rápidos)**

```js
dialogo.abrir("aiko");
```

**3. Chamando de outro script (modo simples)**

```js
dialogo.abrir(personagens.czar, "inicio");

dialogo.agendar(personagens.barman, "sus", 1000);
```

**4. Usando callback (executa algo quando o diálogo termina)**

```js
dialogo.abrir(personagens.aiko, "introducao", () => {
  console.log("Aiko terminou de falar!");
});
```

**5. Usando await (modo cutscene / cenas encadeadas)**

```js

async function cenaTutorial() {

  await dialogo.abrirAsync({ nome: "Narrador", texto: "Tudo congelou...." });

  // O código espera a fala terminar para ir para a próxima linha
  await dialogo.abrirAsync(personagens.wayway, 'final');

  // Espera de tempo simples (com tela liberada)
  await esperar(1000);

  await dialogo.abrirAsync(personagens.wendigo, 'final');


  console.log('Cena finalizada!');
}

cenaTutorial();


---


async function cenaIntro() {

  await dialogo.abrirAsync({ nome: "", texto: "..." });

  // O código espera a fala terminar para ir para a próxima linha
  await dialogo.abrirAsync(personagens.aiko, 'intro');

  // Espera de tempo simples (com tela liberada)
  await esperar(200);

  await dialogo.abrirAsync(personagens.nana, 'intro');
  // Espera de tempo simples (com tela liberada)
  await esperar(200);

  await dialogo.abrirAsync(personagens.nodata, 'intro');

  await esperar(200);

  await dialogo.abrirAsync(personagens.aiko, 'intro2');

  await esperar(200);

  await dialogo.abrirAsync(personagens.nana, 'intro2');

  await esperar(200);

  await dialogo.abrirAsync(personagens.nodata, 'intro2');

  await esperar(200);

  await dialogo.abrirAsync(personagens.aiko, 'intro3');


  console.log('Cena finalizada!');
  location.href = "/cenarios/templo/index.html";
}

cenaIntro();

```
