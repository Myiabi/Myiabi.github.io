// ======================================================
// 🧠 DEV MODE GLOBAL — compatível com sistema de SAVE
// ======================================================
(function () {
  if (window.__devPanelInit) return;
  window.__devPanelInit = true;

  function createDevPanel() {
    const panel = document.createElement("div");
    panel.id = "devPanel";

    Object.assign(panel.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "rgba(25, 25, 25, 0.95)",
      color: "#fff",
      padding: "10px 12px",
      borderRadius: "10px",
      fontFamily: "monospace",
      fontSize: "13px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
      zIndex: "999999999",
      cursor: "grab",
      userSelect: "none",
      pointerEvents: "auto",
      transition: "opacity 0.2s ease",
      minWidth: "260px"
    });

    const title = document.createElement("div");
    title.textContent = "⚙️ DEV MODE (Shift p/ esconder)";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "8px";
    panel.appendChild(title);

    const content = document.createElement("div");
    panel.appendChild(content);

    // -------------------------------------------
    // Renderizador dinâmico
    // -------------------------------------------
    function renderPanel() {
      content.innerHTML = "";

      const traverse = (obj, path = []) => {
        for (const key in obj) {
          const fullPath = [...path, key];
          const value = obj[key];

          if (typeof value === "object" && value !== null) {
            const group = document.createElement("div");
            group.style.marginTop = "6px";
            group.style.fontWeight = "bold";
            group.textContent = key + ":";
            content.appendChild(group);
            traverse(value, fullPath);
          } else {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.alignItems = "center";
            row.style.justifyContent = "space-between";
            row.style.marginBottom = "6px";

            const label = document.createElement("span");
            label.textContent = key;
            row.appendChild(label);

            const btn = document.createElement("devbutton");
            Object.assign(btn.style, {
              background: value ? "#2ecc71" : "#555",
              border: "none",
              color: "white",
              padding: "4px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "12px",
              transition: "0.15s"
            });
            btn.textContent = (typeof value === "boolean") ? (value ? "ON" : "OFF") : String(value);

            btn.addEventListener("click", () => {
              let target = window.gameData;
              for (let i = 0; i < fullPath.length - 1; i++) target = target[fullPath[i]];
              const last = fullPath[fullPath.length - 1];

              // 🔹 Se estivermos em dialogos
              if (fullPath[0] === "dialogos") {
                const personKey = last;
                const persona = window.personagens && (window.personagens[personKey] || window.personagens[personKey.toLowerCase()]);
                if (!persona || !persona.falas) {
                  alert("Personagem '" + personKey + "' não encontrado.");
                  return;
                }
                const cenarios = Object.keys(persona.falas);
                if (cenarios.length === 0) return;

                const atual = target[last];
                let idx = cenarios.indexOf(atual);
                if (idx === -1) idx = 0;
                const prox = cenarios[(idx + 1) % cenarios.length];
                target[last] = prox;
                console.log(`Dialogo de ${personKey} -> ${prox}`);
              }
              // 🔹 Boolean: toggle
              else if (typeof value === "boolean") {
                target[last] = !target[last];
              }
              // 🔹 Outros tipos: prompt
              else {
                const novo = prompt(`Editar ${fullPath.join('.')}:`, target[last]);
                if (novo === null) return;
                if (novo === "true") target[last] = true;
                else if (novo === "false") target[last] = false;
                else if (!isNaN(novo) && novo.trim() !== "") target[last] = Number(novo);
                else target[last] = novo;
              }

              renderPanel();
            });

            row.appendChild(btn);
            content.appendChild(row);
          }
        }
      };

      traverse(window.gameData);

      // 🔴 Botão Reset Save
      const resetBtn = document.createElement("devbutton");
      resetBtn.textContent = "🗑️ Apagar Save";
      Object.assign(resetBtn.style, {
        background: "#e74c3c",
        color: "white",
        border: "none",
        padding: "8px",
        borderRadius: "6px",
        marginTop: "10px",
        width: "100%",
        cursor: "pointer",
        fontWeight: "bold",
      });
      resetBtn.addEventListener("click", () => {
        if (confirm("Apagar o save inteiro?")) {
          if (window.apagarSave) window.apagarSave();
          else localStorage.removeItem("meuSaveDoJogo");
          location.reload();
        }
      });
      content.appendChild(resetBtn);
    }

    renderPanel();

    // ✅ injeta fora do body pra evitar bug do transform
    document.documentElement.appendChild(panel);

    // -------------------------------------------
    // Arrastar painel
    // -------------------------------------------
    let isDragging = false, offsetX = 0, offsetY = 0;
    panel.addEventListener("pointerdown", e => {
      if (e.target.tagName === "DEVBUTTON") return;
      isDragging = true;
      offsetX = e.clientX - panel.offsetLeft;
      offsetY = e.clientY - panel.offsetTop;
      panel.style.cursor = "grabbing";
    });
    window.addEventListener("pointermove", e => {
      if (!isDragging) return;
      panel.style.left = e.clientX - offsetX + "px";
      panel.style.top = e.clientY - offsetY + "px";
      panel.style.right = "auto";
    });
    window.addEventListener("pointerup", () => {
      isDragging = false;
      panel.style.cursor = "grab";
    });

    // -------------------------------------------
    // Shift → mostrar / esconder
    // -------------------------------------------
    let visible = true;
    window.addEventListener("keydown", e => {
      if (e.key === "Shift") {
        visible = !visible;
        panel.style.opacity = visible ? "1" : "0";
        panel.style.pointerEvents = visible ? "auto" : "none";
      }
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", createDevPanel);
  else
    createDevPanel();
})();
