// ==UserScript==
// @name         Detect Bootstrap Version and Breakpoints
// @namespace    https://github.com/tihhgoncalves/tampermonkey-scripts
// @version      1.0
// @description  Detecta a versão do Bootstrap na página e registra o breakpoint ativo com base no tamanho da janela (resultado é mostrado no console).
// @author       Tihh Gonçalves
// @supportURL   https://tihhgoncalves.com.br
// @updateURL    https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/detect-bootstrap-version.js
// @downloadURL  https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/detect-bootstrap-version.js
// @icon         https://raw.githubusercontent.com/tihhgoncalves/tampermonkey-scripts/main/detect-bootstrap-version.png
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  /**
   * Detecta a versão do Bootstrap na página.
   * @returns {string|null} Versão do Bootstrap ou null se não detectado.
   */
  function detectBootstrap() {
    if (typeof $().modal === "function") {
      const bootstrapVersion =
        $.fn.tooltip?.Constructor?.VERSION || "Desconhecida";
      console.log(`[Bootstrap]: Detectado. Versão: ${bootstrapVersion}`);
      return bootstrapVersion;
    } else {
      console.warn("[Bootstrap]: Não detectado nesta página.");
      return null;
    }
  }

  /**
   * Determina o breakpoint atual do Bootstrap com base no tamanho da janela.
   * @param {string} version Versão do Bootstrap detectada.
   */
  function detectBreakpoint(version) {
    const width = window.innerWidth;
    let breakpoint = "";

    if (version.startsWith("3")) {
      if (width < 768) breakpoint = "Extra Small (xs)";
      else if (width < 992) breakpoint = "Small (sm)";
      else if (width < 1200) breakpoint = "Medium (md)";
      else breakpoint = "Large (lg)";
    } else if (version.startsWith("4") || version.startsWith("5")) {
      if (width < 576) breakpoint = "Extra Small (xs)";
      else if (width < 768) breakpoint = "Small (sm)";
      else if (width < 992) breakpoint = "Medium (md)";
      else if (width < 1200) breakpoint = "Large (lg)";
      else if (version.startsWith("5") && width < 1400)
        breakpoint = "Extra Large (xl)";
      else if (version.startsWith("5")) breakpoint = "Extra Extra Large (xxl)";
      else breakpoint = "Extra Large (xl)";
    } else {
      console.warn(
        `[Bootstrap]: Breakpoints para versão ${version} desconhecidos.`
      );
      return;
    }

    console.log(
      `[Bootstrap]: Breakpoint atual: ${breakpoint} (Largura: ${width}px)`
    );
  }

  // Detecta a versão do Bootstrap na página
  const version = detectBootstrap();

  // Se o Bootstrap for detectado, monitora alterações no tamanho da janela
  if (version) {
    detectBreakpoint(version);
    window.addEventListener("resize", () => detectBreakpoint(version));
  }
})();
