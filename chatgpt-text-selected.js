// ==UserScript==
// @name         ChatGPT Text Selected
// @namespace    https://github.com/tihhgoncalves/tampermonkey-scripts
// @version      1.0
// @description  Selecione qualquer texto e envie para uma nova conversa no ChatGPT com somente 1 clique.
// @author       Tihh Gonçalves
// @supportURL   https://tihhgoncalves.com.br
// @icon         https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/chatgpt-text-selected.png
// @updateURL    https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/chatgpt-text-selected.js
// @downloadURL  https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/chatgpt-text-selected.js
// @match        *://*/*
// @grant        GM_openInTab
// ==/UserScript==

(function () {
  "use strict";

  let bubble;

  // Função para criar a bolinha e posicioná-la ao lado do texto selecionado
  function createBubble(x, y, selectedText) {
    // Remove a bolinha anterior, se existir
    if (bubble) {
      bubble.remove();
    }

    // Cria a bolinha
    bubble = document.createElement("div");
    bubble.id = "chatGPTBubble"; // Adiciona um id ao bubble
    bubble.style.position = "absolute";
    bubble.style.width = "24px";
    bubble.style.height = "24px";
    bubble.style.borderRadius = "50%";
    bubble.style.display = "flex";
    bubble.style.alignItems = "center";
    bubble.style.justifyContent = "center";
    bubble.style.cursor = "pointer";
    bubble.style.zIndex = "1000";
    bubble.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";

    // Define o ícone como imagem de fundo
    bubble.style.backgroundImage =
      "https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/chatgpt-text-selected.png";
    bubble.style.backgroundSize = "cover";

    // Posiciona a bolinha próxima ao texto selecionado
    bubble.style.top = `${y + window.scrollY}px`;
    bubble.style.left = `${x + 10}px`;

    // Adiciona evento de clique na bolinha
    bubble.onclick = function () {
      const prompt = `Estou te enviando um conteúdo que selecionei em um site. Por enquanto, somente leia o conteúdo e na próxima mensagem te enviarei instruções, ok? \n\nSegue o conteúdo:\n"""${selectedText}"""`;

      // Abre o ChatGPT com o prompt
      GM_openInTab(`https://chat.openai.com/?q=${encodeURIComponent(prompt)}`, {
        active: true,
        insert: true,
      });

      // Remove a bolinha após o clique
      bubble.remove();
    };

    // Adiciona a bolinha ao corpo do documento
    document.body.appendChild(bubble);
  }

  // Evento para detectar o texto selecionado e criar a bolinha ao lado dele
  document.addEventListener("mouseup", (event) => {
    setTimeout(() => {
      // Usando setTimeout para capturar o texto selecionado após o mouseup
      const selectedText = window.getSelection().toString().trim();
      if (selectedText) {
        const x = event.pageX;
        const y = event.pageY;
        createBubble(x, y, selectedText);
      } else if (bubble) {
        bubble.remove(); // Remove a bolinha se nenhum texto estiver selecionado
      }
    }, 10);
  });

  // Remove a bolinha se clicar fora dela
  document.addEventListener("click", (event) => {
    if (bubble && !bubble.contains(event.target)) {
      bubble.remove();
    }
  });
})();
