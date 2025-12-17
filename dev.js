// ======================================================
// 🛠️ DEV MODE - PAINEL DE DEBUG
// ======================================================

(function () {
  // Evita duplicação
  if (window.__devModeLoaded) return;
  window.__devModeLoaded = true;

  // ========================
  // 🎨 ESTILOS DO PAINEL
  // ========================
  const styles = document.createElement("style");
  styles.textContent = `
    #dev-panel {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80vw;
      height: 80vh;
      background: linear-gradient(145deg, #1a1a2e, #16213e);
      border: 3px solid #0f3460;
      border-radius: 20px;
      box-shadow: 0 0 40px rgba(0, 243, 255, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5);
      z-index: 99999;
      display: none;
      flex-direction: column;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    #dev-panel.active {
      display: flex;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    #dev-panel-header {
      background: linear-gradient(90deg, #0f3460, #533483);
      padding: 15px 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #00f3ff;
    }

    #dev-panel-header h1 {
      margin: 0;
      color: #00f3ff;
      font-size: 1.5em;
      text-shadow: 0 0 10px #00f3ff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    #dev-panel-header h1::before {
      content: "🛠️";
    }

    #dev-panel-tabs {
      display: flex;
      gap: 5px;
    }

    .dev-tab {
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 10px 10px 0 0;
      color: #aaa;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.9em;
    }

    .dev-tab:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }

    .dev-tab.active {
      background: #533483;
      color: #00f3ff;
      box-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
    }

    #dev-panel-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    #dev-panel-content::-webkit-scrollbar {
      width: 10px;
    }

    #dev-panel-content::-webkit-scrollbar-track {
      background: #1a1a2e;
    }

    #dev-panel-content::-webkit-scrollbar-thumb {
      background: #533483;
      border-radius: 5px;
    }

    .dev-section {
      display: none;
    }

    .dev-section.active {
      display: block;
    }

    .dev-section-title {
      color: #e94560;
      font-size: 1.2em;
      margin: 20px 0 10px 0;
      padding-bottom: 5px;
      border-bottom: 1px solid #e94560;
    }

    .dev-section-title:first-child {
      margin-top: 0;
    }

    .dev-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
    }

    .dev-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      transition: all 0.3s;
    }

    .dev-toggle:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .dev-toggle-label {
      color: #fff;
      font-size: 0.9em;
      flex: 1;
    }

    .dev-toggle-switch {
      position: relative;
      width: 50px;
      height: 26px;
      background: #333;
      border-radius: 13px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .dev-toggle-switch.on {
      background: linear-gradient(90deg, #00f3ff, #533483);
      box-shadow: 0 0 15px rgba(0, 243, 255, 0.5);
    }

    .dev-toggle-switch::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 50%;
      transition: all 0.3s;
    }

    .dev-toggle-switch.on::after {
      left: 27px;
    }

    /* FALAS SECTION */
    .dev-character-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 15px;
      padding: 15px;
      margin-bottom: 15px;
    }

    .dev-character-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dev-character-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      border: 2px solid #533483;
    }

    .dev-character-name {
      color: #00f3ff;
      font-size: 1.2em;
      font-weight: bold;
    }

    .dev-scenario-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .dev-scenario-btn {
      padding: 8px 15px;
      background: rgba(83, 52, 131, 0.5);
      border: 1px solid #533483;
      border-radius: 8px;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.85em;
    }

    .dev-scenario-btn:hover {
      background: #533483;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(83, 52, 131, 0.5);
    }

    .dev-scenario-btn.active {
      background: #e94560;
      border-color: #e94560;
    }

    /* FOOTER */
    #dev-panel-footer {
      padding: 15px 25px;
      background: rgba(0, 0, 0, 0.3);
      border-top: 1px solid #0f3460;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dev-footer-info {
      color: #666;
      font-size: 0.8em;
    }

    .dev-footer-actions {
      display: flex;
      gap: 10px;
    }

    .dev-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s;
    }

    .dev-btn-danger {
      background: linear-gradient(90deg, #e94560, #c73659);
      color: #fff;
    }

    .dev-btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(233, 69, 96, 0.5);
    }

    .dev-btn-success {
      background: linear-gradient(90deg, #00f3ff, #00b894);
      color: #1a1a2e;
    }

    .dev-btn-success:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 243, 255, 0.5);
    }

    /* Indicador TAB */
    #dev-indicator {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 15px;
      background: rgba(83, 52, 131, 0.8);
      border-radius: 10px;
      color: #00f3ff;
      font-family: 'Segoe UI', sans-serif;
      font-size: 0.8em;
      z-index: 99998;
      pointer-events: none;
      opacity: 0.7;
    }

    /* Overlay */
    #dev-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      z-index: 99998;
      display: none;
      backdrop-filter: blur(5px);
    }

    #dev-overlay.active {
      display: block;
    }

    /* Search */
    #dev-search {
      width: 100%;
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid #0f3460;
      border-radius: 10px;
      color: #fff;
      font-size: 1em;
      margin-bottom: 20px;
      outline: none;
      transition: all 0.3s;
    }

    #dev-search:focus {
      border-color: #00f3ff;
      box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
    }

    #dev-search::placeholder {
      color: #666;
    }

    /* BOTÕES ESPECIAIS SOL/LUA */
    #dev-special-buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-bottom: 25px;
      padding: 20px;
      background: linear-gradient(135deg, rgba(15, 52, 96, 0.5), rgba(83, 52, 131, 0.3));
      border-radius: 15px;
      border: 2px solid rgba(255, 255, 255, 0.1);
    }

    .dev-special-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px 40px;
      border: 3px solid;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s;
      min-width: 150px;
    }

    .dev-special-btn .icon {
      font-size: 3em;
      transition: all 0.3s;
    }

    .dev-special-btn .label {
      font-size: 1.1em;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .dev-special-btn .status {
      font-size: 0.8em;
      opacity: 0.7;
    }

    /* SOL */
    .dev-special-btn.sol {
      background: linear-gradient(145deg, rgba(255, 165, 0, 0.2), rgba(255, 69, 0, 0.1));
      border-color: #ffa500;
      color: #ffd700;
    }

    .dev-special-btn.sol:hover {
      background: linear-gradient(145deg, rgba(255, 165, 0, 0.4), rgba(255, 69, 0, 0.3));
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(255, 165, 0, 0.4);
    }

    .dev-special-btn.sol.active {
      background: linear-gradient(145deg, rgba(255, 200, 0, 0.6), rgba(255, 140, 0, 0.5));
      box-shadow: 0 0 40px rgba(255, 200, 0, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2);
    }

    .dev-special-btn.sol.active .icon {
      animation: pulse-sol 1.5s ease-in-out infinite;
      text-shadow: 0 0 20px #ffd700;
    }

    @keyframes pulse-sol {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    /* LUA */
    .dev-special-btn.lua {
      background: linear-gradient(145deg, rgba(138, 43, 226, 0.2), rgba(75, 0, 130, 0.1));
      border-color: #9370db;
      color: #e6e6fa;
    }

    .dev-special-btn.lua:hover {
      background: linear-gradient(145deg, rgba(138, 43, 226, 0.4), rgba(75, 0, 130, 0.3));
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(138, 43, 226, 0.4);
    }

    .dev-special-btn.lua.active {
      background: linear-gradient(145deg, rgba(180, 150, 255, 0.6), rgba(138, 43, 226, 0.5));
      box-shadow: 0 0 40px rgba(180, 150, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2);
    }

    .dev-special-btn.lua.active .icon {
      animation: pulse-lua 2s ease-in-out infinite;
      text-shadow: 0 0 20px #e6e6fa;
    }

    @keyframes pulse-lua {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(5deg); }
    }
  `;
  document.head.appendChild(styles);

  // ========================
  // 🏗️ ESTRUTURA DO PAINEL
  // ========================
  const overlay = document.createElement("div");
  overlay.id = "dev-overlay";
  document.body.appendChild(overlay);

  const panel = document.createElement("div");
  panel.id = "dev-panel";
  panel.innerHTML = `
    <div id="dev-panel-header">
      <h1>DEV MODE</h1>
      <div id="dev-panel-tabs">
        <button class="dev-tab active" data-tab="variables">📊 Variáveis</button>
        <button class="dev-tab" data-tab="falas">💬 Falas</button>
      </div>
    </div>
    <div id="dev-panel-content">
      <div class="dev-section active" id="section-variables">
        <div id="dev-special-buttons">
          <div class="dev-special-btn sol" id="btn-sol">
            <span class="icon">☀️</span>
            <span class="label">Sol</span>
            <span class="status">OFF</span>
          </div>
          <div class="dev-special-btn lua" id="btn-lua">
            <span class="icon">🌙</span>
            <span class="label">Lua</span>
            <span class="status">OFF</span>
          </div>
        </div>
        <input type="text" id="dev-search" placeholder="🔍 Buscar variável...">
        <div id="variables-container"></div>
      </div>
      <div class="dev-section" id="section-falas">
        <div id="falas-container"></div>
      </div>
    </div>
    <div id="dev-panel-footer">
      <span class="dev-footer-info">Pressione TAB para fechar | Alterações resetam a página</span>
      <div class="dev-footer-actions">
        <button class="dev-btn dev-btn-danger" id="dev-clear-save">🗑️ Apagar Save</button>
        <button class="dev-btn dev-btn-success" id="dev-reload">🔄 Recarregar</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  const indicator = document.createElement("div");
  indicator.id = "dev-indicator";
  indicator.textContent = "";
  document.body.appendChild(indicator);

  // ========================
  // 🎛️ FUNÇÕES DO PAINEL
  // ========================

  let isPanelOpen = false;

  function togglePanel() {
    isPanelOpen = !isPanelOpen;
    panel.classList.toggle("active", isPanelOpen);
    overlay.classList.toggle("active", isPanelOpen);

    if (isPanelOpen) {
      updateSpecialButtons();
      renderVariables();
      renderFalas();
    }
  }

  // TAB para abrir/fechar
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      togglePanel();
    }
  });

  // Clique no overlay fecha
  overlay.addEventListener("click", togglePanel);

  // Tabs
  panel.querySelectorAll(".dev-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      panel
        .querySelectorAll(".dev-tab")
        .forEach((t) => t.classList.remove("active"));
      panel
        .querySelectorAll(".dev-section")
        .forEach((s) => s.classList.remove("active"));
      tab.classList.add("active");
      document
        .getElementById(`section-${tab.dataset.tab}`)
        .classList.add("active");
    });
  });

  // Botões footer
  document.getElementById("dev-clear-save").addEventListener("click", () => {
    if (confirm("Tem certeza que quer apagar o save?")) {
      localStorage.removeItem("meuSaveDoJogo");
      localStorage.removeItem("wendigo_completo");
      localStorage.removeItem("dropmoon_completo");
      localStorage.removeItem("intro_completo");
      sessionStorage.clear();
      location.reload(true);
    }
  });

  document.getElementById("dev-reload").addEventListener("click", () => {
    location.reload(true);
  });

  // ========================
  // ☀️🌙 BOTÕES ESPECIAIS SOL/LUA
  // ========================

  function updateSpecialButtons() {
    if (typeof gameData === "undefined") return;

    const btnSol = document.getElementById("btn-sol");
    const btnLua = document.getElementById("btn-lua");

    const solON = gameData.visualState?.solON || false;
    const luaON = gameData.visualState?.luaON || false;

    if (btnSol) {
      btnSol.classList.toggle("active", solON);
      btnSol.querySelector(".status").textContent = solON ? "ON" : "OFF";
    }

    if (btnLua) {
      btnLua.classList.toggle("active", luaON);
      btnLua.querySelector(".status").textContent = luaON ? "ON" : "OFF";
    }
  }

  document.getElementById("btn-sol").addEventListener("click", () => {
    if (typeof gameData === "undefined" || !gameData.visualState) return;

    gameData.visualState.solON = !gameData.visualState.solON;

    if (typeof salvarJogo === "function") {
      salvarJogo();
    } else {
      localStorage.setItem("meuSaveDoJogo", JSON.stringify(gameData));
    }

    location.reload(true);
  });

  document.getElementById("btn-lua").addEventListener("click", () => {
    if (typeof gameData === "undefined" || !gameData.visualState) return;

    gameData.visualState.luaON = !gameData.visualState.luaON;

    if (typeof salvarJogo === "function") {
      salvarJogo();
    } else {
      localStorage.setItem("meuSaveDoJogo", JSON.stringify(gameData));
    }

    location.reload(true);
  });

  // ========================
  // 📊 RENDERIZAÇÃO DE VARIÁVEIS
  // ========================

  function renderVariables() {
    const container = document.getElementById("variables-container");
    container.innerHTML = "";

    if (typeof gameData === "undefined") {
      container.innerHTML =
        '<p style="color: #e94560;">gameData não encontrado!</p>';
      return;
    }

    const categories = {
      "🎮 Principais": [],
      "🔬 Incubadora": [],
      "👁️ Visual State": [],
      "🎣 Fishing": [],
      "🪑 Mesas": [],
      "🌿 Jardim": [],
      "🏆 Outros": [],
    };

    // Categoriza as variáveis
    function processObject(obj, prefix = "", category = "🏆 Outros") {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === "boolean") {
          categories[category].push({ key: fullKey, value, obj, prop: key });
        } else if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          let subCategory = category;
          if (key === "incubadora") subCategory = "🔬 Incubadora";
          else if (key === "visualState") subCategory = "👁️ Visual State";
          else if (key === "fishing") subCategory = "🎣 Fishing";
          else if (key === "mesas") subCategory = "🪑 Mesas";
          else if (key === "itensJardim") subCategory = "🌿 Jardim";

          processObject(value, fullKey, subCategory);
        }
      }
    }

    // Variáveis principais (primeiro nível booleanos)
    for (const [key, value] of Object.entries(gameData)) {
      if (typeof value === "boolean") {
        categories["🎮 Principais"].push({
          key,
          value,
          obj: gameData,
          prop: key,
        });
      }
    }

    // Objetos aninhados
    if (gameData.incubadora)
      processObject(gameData.incubadora, "incubadora", "🔬 Incubadora");
    if (gameData.visualState)
      processObject(gameData.visualState, "visualState", "👁️ Visual State");
    if (gameData.mesas) processObject(gameData.mesas, "mesas", "🪑 Mesas");
    if (gameData.fishing?.uniqueItems)
      processObject(
        gameData.fishing.uniqueItems,
        "fishing.uniqueItems",
        "🎣 Fishing"
      );
    if (gameData.itensJardim)
      processObject(gameData.itensJardim, "itensJardim", "🌿 Jardim");

    // Renderiza cada categoria
    for (const [category, items] of Object.entries(categories)) {
      if (items.length === 0) continue;

      const title = document.createElement("h3");
      title.className = "dev-section-title";
      title.textContent = `${category} (${items.length})`;
      container.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "dev-grid";

      for (const item of items) {
        const toggle = document.createElement("div");
        toggle.className = "dev-toggle";
        toggle.dataset.key = item.key;
        toggle.innerHTML = `
          <span class="dev-toggle-label">${item.key}</span>
          <div class="dev-toggle-switch ${item.value ? "on" : ""}" data-key="${
          item.key
        }"></div>
        `;
        grid.appendChild(toggle);

        toggle
          .querySelector(".dev-toggle-switch")
          .addEventListener("click", () => {
            toggleVariable(item.key);
          });
      }

      container.appendChild(grid);
    }

    // Search functionality
    document.getElementById("dev-search").addEventListener("input", (e) => {
      const search = e.target.value.toLowerCase();
      container.querySelectorAll(".dev-toggle").forEach((toggle) => {
        const key = toggle.dataset.key.toLowerCase();
        toggle.style.display = key.includes(search) ? "flex" : "none";
      });
    });
  }

  function toggleVariable(fullKey) {
    const keys = fullKey.split(".");
    let obj = gameData;

    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    obj[lastKey] = !obj[lastKey];

    // Salva e recarrega
    if (typeof salvarJogo === "function") {
      salvarJogo();
    } else {
      localStorage.setItem("meuSaveDoJogo", JSON.stringify(gameData));
    }

    // Ctrl+F5 (hard reload)
    location.reload(true);
  }

  // ========================
  // 💬 RENDERIZAÇÃO DE FALAS
  // ========================

  function renderFalas() {
    const container = document.getElementById("falas-container");
    container.innerHTML = "";

    if (typeof window.personagens === "undefined") {
      container.innerHTML =
        '<p style="color: #e94560;">personagens não encontrado!</p>';
      return;
    }

    for (const [charKey, character] of Object.entries(window.personagens)) {
      if (!character.falas) continue;

      const card = document.createElement("div");
      card.className = "dev-character-card";

      // Avatar
      let avatarStyle = "";
      if (character.expressoes?.normal) {
        const urlMatch = character.expressoes.normal.match(
          /url\(['"]?([^'"]+)['"]?\)/
        );
        if (urlMatch) {
          avatarStyle = `background-image: url('${urlMatch[1]}');`;
        }
      }

      card.innerHTML = `
        <div class="dev-character-header">
          <div class="dev-character-avatar" style="${avatarStyle}"></div>
          <span class="dev-character-name">${character.nome || charKey}</span>
        </div>
        <div class="dev-scenario-buttons" data-char="${charKey}"></div>
      `;

      const buttonsContainer = card.querySelector(".dev-scenario-buttons");

      for (const scenarioKey of Object.keys(character.falas)) {
        const btn = document.createElement("button");
        btn.className = "dev-scenario-btn";
        btn.textContent = scenarioKey;
        btn.addEventListener("click", () => {
          changeScenario(charKey, scenarioKey);
          // Visual feedback
          buttonsContainer
            .querySelectorAll(".dev-scenario-btn")
            .forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
        });
        buttonsContainer.appendChild(btn);
      }

      container.appendChild(card);
    }
  }

  function changeScenario(charKey, scenarioKey) {
    if (
      typeof window.personagens === "undefined" ||
      typeof mudarCenario !== "function"
    ) {
      alert("Sistema de falas não disponível nesta página!");
      return;
    }

    const character = window.personagens[charKey];
    if (!character) {
      alert(`Personagem "${charKey}" não encontrado!`);
      return;
    }

    // Chama mudarCenario
    mudarCenario(character, scenarioKey);

    // Fecha o painel para ver o diálogo
    togglePanel();
  }

  // Log inicial
  console.log(
    "%c🛠️ DEV MODE ATIVO %c Pressione TAB para abrir o painel",
    "background: #533483; color: #00f3ff; padding: 5px 10px; border-radius: 5px;",
    "color: #aaa;"
  );
})();
