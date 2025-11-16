# 🎮 Sistema Global de Save + Achievements + VisualState
Guia direto, simples e completo de como usar o sistema de save automático com Proxy, achievements e controle visual.

---

## 📌 Introdução
Este sistema permite:
- Salvar e carregar automaticamente o estado do jogo (localStorage)
- Desbloquear achievements ao alterar valores
- Controlar elementos visuais pelo visualState
- Reaplicar tudo automaticamente ao carregar o jogo

Você apenas altera `gameData` e o sistema cuida do resto.

---

# 📦 Estrutura Básica

### Modificar valores persistentes
Use sempre:
`gameData.algumaCoisa = valor;`

Exemplos:
`gameData.itemMoeda = true;`
`gameData.dialogos.aiko = "capitulo2";`

O Proxy salva automaticamente e reaplica no load.

---

# 🖼️ VISUALSTATE — Como funciona
`visualState` controla elementos HTML automaticamente através de IDs específicos.

Exemplo original:
```
visualState: {
  npc1Visivel: true,
  portaAberta: false,
  bossDerrotado: false
}
```

### Efeitos aplicados pelo sistema:

### npc1Visivel
Elemento afetado: `<div id="npc1"></div>`
Efeito: mostrar/esconder
- `display: block` quando true  
- `display: none` quando false

---

### portaAberta
Elemento afetado: `<div id="porta"></div>`
Efeito:
- `rotateY(90deg)` quando true  
- `rotateY(0deg)` quando false

---

### bossDerrotado
Elemento afetado: `<div id="boss"></div>`
Efeito:
- `grayscale(1)` quando true  
- `none` quando false

---

# ➕ Criando Novos Efeitos Visuais

## 1️⃣ Adicione no visualState
```
visualState: {
  img1Trocar: false,
  btn1Visivel: true
}
```

## 2️⃣ Adicione no switch de aplicarMudancaVisual
```
case "img1Trocar":
  const img1 = document.getElementById("img1");
  if (img1) {
    img1.src = value
      ? "/assets/minhaOutraImagem.png"
      : "/assets/minhaImagemOriginal.png";
  }
  break;

case "btn1Visivel":
  const btn1 = document.getElementById("btn1");
  if (btn1) {
    btn1.style.display = value ? "block" : "none";
  }
  break;
```

## 3️⃣ Usar no jogo
```
gameData.visualState.img1Trocar = true;   // troca a imagem
gameData.visualState.btn1Visivel = false; // esconde o botão
```

O sistema salva, aplica e reaplica tudo no load.

---

# 🏆 Achievements

### Desbloqueio automático
`gameData.minigameWon = true;`

### Desbloqueio manual
`unlockAchievement("minigameWon");`

### Criar novo achievement
```
secretAchievements.push({
  id: "novoAch",
  title: "Conquista!",
  desc: "Você fez algo incrível!",
  iconUrl: "urlAqui",
  unlocked: false,
  condition: gs => gs.algumaVariavel === true
});
```

---

# 🔁 Resetar Save
`apagarSave();`
`location.reload();`

---

# 📝 Conclusão
- Alterar valores em `gameData` já salva automatica­mente  
- `visualState` controla elementos HTML por ID  
- Achievements são gerenciados automaticamente  
- Tudo volta igual ao reabrir o jogo  

O sistema é simples: **você mexe no `gameData`, ele faz o resto.**
