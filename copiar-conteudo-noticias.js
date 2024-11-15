// ==UserScript==
// @name         Copiar Conteúdo de Notícias
// @namespace    https://github.com/tihhgoncalves/tampermonkey-scripts
// @version      1.0
// @description  Adiciona um botão flutuante para copiar o conteúdo de notícias ou artigos diretamente para a área de transferência.
// @author       Tihh Gonçalves
// @supportURL   https://tihhgoncalves.com.br
// @updateURL    https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/copiar-conteudo-noticias.js
// @downloadURL  https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/copiar-conteudo-noticias.js
// @icon         https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/assets/favico.png
// @match        *://*/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  "use strict";

  let content = "";

  // Função para obter o conteúdo principal da página
  function getMainContent() {
    // Usar Readability.js, se disponível
    try {
      const article = new Readability(document.cloneNode(true)).parse();
      if (article) return article.textContent.trim();
    } catch (e) {
      console.warn("Readability.js não está disponível ou falhou:", e);
    }

    // Algoritmo alternativo para encontrar o maior bloco de texto
    const blocks = document.querySelectorAll("article, main, div, section");
    let largestBlock = null;
    let maxTextLength = 0;

    blocks.forEach((block) => {
      const text = block.innerText.trim();
      // Ignorar anúncios e elementos pequenos
      if (
        text.length > maxTextLength &&
        !block.className.includes("ad") &&
        !block.className.includes("promo")
      ) {
        largestBlock = block;
        maxTextLength = text.length;
      }
    });

    return largestBlock ? largestBlock.innerText.trim() : "";
  }

  // Criação do botão flutuante
  const button = document.createElement("button");
  button.innerHTML = "📋 Copiar Conteúdo";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.left = "20px";
  button.style.padding = "10px";
  button.style.color = "#fff";
  button.style.backgroundColor = "#000";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.opacity = "0.1";
  button.style.zIndex = "1000";
  button.style.display = "none"; // O botão começa oculto

  button.onmouseover = function () {
    button.style.opacity = "1";
  };
  button.onmouseout = function () {
    button.style.opacity = "0.7";
  };

  button.onclick = function () {
    if (content) {
      GM_setClipboard(content);
      alert("Conteúdo copiado para a área de transferência!");
    } else {
      alert("Não foi possível encontrar conteúdo para copiar.");
    }
  };

  // Verifica o conteúdo da página
  function checkContent() {
    content = getMainContent();

    if (content) {
      document.body.appendChild(button);
      button.style.display = "block";
    }
  }

  // Verifica o conteúdo quando a página termina de carregar
  window.addEventListener("load", checkContent);
})();
