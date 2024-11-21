// ==UserScript==
// @name         Ocultar Tweets Promovidos
// @namespace    https://github.com/tihhgoncalves/tampermonkey-scripts
// @version      1.2
// @description  Oculta automaticamente tweets promovidos no X.com (antigo Twitter) e informa no console.
// @author       Tihh Gonçalves
// @supportURL   https://tihhgoncalves.com.br
// @updateURL    https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/ocultar-tweets-promovidos.js
// @downloadURL  https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/ocultar-tweets-promovidos.js
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Função para ocultar tweets promovidos
  function ocultarTweetsPromovidos() {
    // Selecionar todos os tweets visíveis
    const tweets = document.querySelectorAll("article");

    tweets.forEach((tweet) => {
      // Verificar se o tweet contém o texto "Promovido"
      const spans = tweet.querySelectorAll("div[dir='ltr'] span");
      const isPromovido = Array.from(spans).some((span) =>
        span.textContent.includes("Promovido")
      );

      if (isPromovido) {
        tweet.style.display = "none"; // Ocultar o tweet promovido
        //tweet.style.backgroundColor = "red"; // Marca o tweet de vermelho
        console.log("Tweet PROMOVIDO ocultado:", tweet);
      }
    });
  }

  // Observar mudanças dinâmicas no feed
  const observer = new MutationObserver(() => {
    ocultarTweetsPromovidos();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Executar no carregamento inicial
  window.addEventListener("load", ocultarTweetsPromovidos);
})();
