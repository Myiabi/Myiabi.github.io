// Encapsula o módulo para evitar poluir o escopo global
(function (global) {
  // ------------------ Função Drag & Drop ------------------
  function dragMoveListener(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  }

  function onDragEnter(event) {
    const draggableElement = event.relatedTarget;
    const dropzoneElement = event.target;
    dropzoneElement.classList.add("drop-target");
    draggableElement.classList.add("can-drop");
  }

  function onDragLeave(event) {
    if (event.target) event.target.classList.remove("drop-target");
    if (event.relatedTarget) {
      event.relatedTarget.classList.remove("can-drop");
      event.relatedTarget.dataset.placed = "false";
    }
  }

  function onDrop(event) {
    if (event.target) event.target.classList.remove("drop-target");

    const dropzone = event.target;
    const item = event.relatedTarget;
    if (!dropzone || !item) return;

    if (
      (dropzone.id === "dropzoneA" && item.classList.contains("itemA")) ||
      (dropzone.id === "dropzoneB" && item.classList.contains("itemB"))
    ) {
      item.dataset.placed = "true";
    }

    checkAllPlaced();
  }

  function checkAllPlaced() {
    const allA = document.querySelectorAll(".itemA");
    const allB = document.querySelectorAll(".itemB");

    const allPlaced = [...allA, ...allB].every(
      (item) => item.dataset.placed === "true"
    );

    if (allPlaced) {
      alert("🎉 Todos os itens estão no lugar certo!");
      document
        .querySelectorAll(".draggable")
        .forEach((d) => (d.style.pointerEvents = "none"));
    }
  }

  // Inicializa Interact.js e configura drag/drop
  function init() {
    if (typeof interact === "undefined") {
      console.error(
        "interact.js não está disponível. Certifique-se de incluir a biblioteca antes."
      );
      return;
    }

    // Expor a função de movimento no namespace e, para compatibilidade, definir global somente se não existir
    const namespace = (global.DragOrganize = global.DragOrganize || {});
    namespace.dragMoveListener = dragMoveListener;

    interact("#dropzoneA").dropzone({
      accept: ".itemA",
      overlap: 0.75,
      ondragenter: onDragEnter,
      ondragleave: onDragLeave,
      ondrop: onDrop,
    });

    interact("#dropzoneB").dropzone({
      accept: ".itemB",
      overlap: 0.75,
      ondragenter: onDragEnter,
      ondragleave: onDragLeave,
      ondrop: onDrop,
    });

    interact(".draggable").draggable({
      inertia: true,
      autoScroll: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
      listeners: { move: dragMoveListener },
    });
  }

  // Expor API pública mínima
  const api = {
    dragMoveListener,
  };
  global.DragOrganize = Object.assign(global.DragOrganize || {}, api);

  // Compatibilidade: só define globals se não houver conflito (não sobrescreve)
  if (!global.dragMoveListener) global.dragMoveListener = dragMoveListener;

  // Garante que init rode mesmo se o script for injetado após o DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // DOM já pronto -- inicializa imediatamente
    init();
  }
})(window);
