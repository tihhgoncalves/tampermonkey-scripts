// ==UserScript==
// @name         ChatGPT Send Content Page
// @namespace    https://github.com/tihhgoncalves/tampermonkey-scripts
// @version      1.0
// @description  Adiciona um botão flutuante para enviar o conteúdo principal de uma página ou artigo diretamente para o ChatGPT.
// @author       Tihh Gonçalves
// @supportURL   https://tihhgoncalves.com.br
// @updateURL    https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/chatgpt-send-content-page.js
// @downloadURL  https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/chatgpt-send-content-page.js
// @icon         https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/chatgpt-send-content-page.png
// @match        *://*/*
// @grant        GM_openInTab
// ==/UserScript==

(function () {
  "use strict";

  let content = "";

  // Function to get the main content of the page
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
        // Ignore small blocks, ads, and non-textual elements
        return (
          text.length > 50 && // Exclude very small blocks
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

  // Create a floating button
  const button = document.createElement("button");
  button.innerHTML = "🤖 Send to ChatGPT";
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
  button.style.display = "none"; // Button starts hidden

  button.onmouseover = function () {
    button.style.opacity = "1";
  };
  button.onmouseout = function () {
    button.style.opacity = "0.7";
  };

  button.onclick = function () {
    if (content) {
      const prompt = `Estou enviando a você um conteúdo selecionado do site \n${document.location.href}\n\n Por enquanto, apenas leia o conteúdo e, na próxima mensagem, enviarei mais instruções, ok? \n\nResponda sempre em PT-BR.\bAqui está o conteúdo: \n\nHere is the content:\n"""${content}"""`;

      // Open ChatGPT with the main content
      GM_openInTab(`https://chat.openai.com/?q=${encodeURIComponent(prompt)}`, {
        active: true,
      });
    } else {
      alert("Could not find content to send.");
    }
  };

  // Check the page content
  function checkContent() {
    content = getMainContent();

    if (content) {
      document.body.appendChild(button);
      button.style.display = "block";
    }
  }

  // Check the content when the page is fully loaded
  window.addEventListener("load", checkContent);
})();
