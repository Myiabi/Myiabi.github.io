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


dialogo.agendar(personagens.barman, 'sus', 1000);
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

