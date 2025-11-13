### Sistema de Diálogo Dinâmico

##
📘 Descrição
- Sistema de diálogo estilo *visual novel* criado dinamicamente via JavaScript.
- Suporta múltiplos personagens, expressões e transições de cena.
- Permite chamadas simples, cutscenes encadeadas (com `await`) e callbacks após o término.


## Mudar falas (e salvar também)
```js
mudarCenario(personagens.aiko, 'depoisDoMinigame');
```


##
🎮 Formas de Chamar o Diálogo
-
**1. Click direto (event listener em imagem, botão ou elemento)**  
```js
document.getElementById("npcAiko").addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.aiko);
});
```

**2. Pelo Console do Navegador (para testes rápidos)**

```js
dialogo.abrir('aiko');
```

**3. Chamando de outro script (modo simples)**

```js

dialogo.abrir(personagens.czar, 'inicio');
```

**4. Usando callback (executa algo quando o diálogo termina)**

```js 
dialogo.abrir(personagens.aiko, 'introducao', () => {
  console.log('Aiko terminou de falar!');
});
``` 

**5. Usando await (modo cutscene / cenas encadeadas)**
```js
async function cenaTutorial() {
  await dialogo.abrirAsync(personagens.aiko, 'introducao');
  await dialogo.abrirAsync(personagens.czar, 'inicio');
  console.log('Cena finalizada!');
}
cenaTutorial();

ou

async function cutsceneTeste() {
  await dialogo.abrirAsync(personagens.aiko, "introducao");
  await dialogo.abrirAsync({ nome: "Narrador", texto: "Um vento frio percorre o laboratório..." });
  await esperar(500);
  await dialogo.abrirAsync(personagens.czar, "inicio");
  await dialogo.abrirAsync({ nome: "Narrador", texto: "E assim termina o primeiro ato." });
}

cutsceneTeste();


