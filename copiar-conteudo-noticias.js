// ==UserScript==
// @name         Copiar Conteúdo de Notícias
// @namespace    https://github.com/tihhgoncalves/tampermonkey-scripts
// @version      1.3
// @description  Adiciona um botão flutuante para copiar o conteúdo de notícias ou artigos diretamente para a área de transferência.
// @author       Tihh Gonçalves
// @supportURL   https://tihhgoncalves.com.br
// @updateURL    https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/copiar-conteudo-noticias.js
// @downloadURL  https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/copiar-conteudo-noticias.js
// @icon         https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/copiar-conteudo-noticias.png
// @match        *://*/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  "use strict";

  let content = "";

  // Função para obter o conteúdo principal da página
  function getMainContent() {
    const elements = document.querySelectorAll(
      "article, main, p, h1, h2, h3, li"
    );
    let largestBlock = null;
    let maxTextLength = 0;

    Array.from(elements)
      .filter((block) => {
        const tagName = block.tagName.toLowerCase();
        const className = block.className.toLowerCase();
        const text = block.innerText.trim();
        // Ignorar blocos pequenos, anúncios e elementos não textuais
        return (
          text.length > 50 && // Excluir blocos muito pequenos
          tagName !== "style" &&
          tagName !== "script" &&
          !className.includes("ad") &&
          !className.includes("promo")
        );
      })
      .forEach((block) => {
        const text = block.innerText.trim();
        if (text.length > maxTextLength) {
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
