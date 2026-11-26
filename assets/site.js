(() => {
  const root = document.documentElement;
  const storageKey = "battleline-legal-language";

  function preferredLanguage() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "ko" || saved === "en") return saved;
    } catch (_) {}
    return (navigator.language || "ko").toLowerCase().startsWith("ko") ? "ko" : "en";
  }

  function setLanguage(language) {
    root.dataset.language = language;
    root.lang = language;
    document.querySelectorAll("[data-set-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.setLanguage === language));
    });
    try { localStorage.setItem(storageKey, language); } catch (_) {}
  }

  async function copyText(button) {
    const target = document.getElementById(button.dataset.copyTarget || "");
    if (!target) return;
    const text = target.textContent.trim();
    const status = button.parentElement?.querySelector(".status");
    try {
      await navigator.clipboard.writeText(text);
      if (status) status.textContent = root.dataset.language === "ko" ? "복사했습니다." : "Copied.";
    } catch (_) {
      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      if (status) status.textContent = root.dataset.language === "ko" ? "텍스트를 선택했습니다. 직접 복사해 주세요." : "Text selected. Copy it manually.";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setLanguage(preferredLanguage());
    document.querySelectorAll("[data-set-language]").forEach((button) => {
      button.addEventListener("click", () => setLanguage(button.dataset.setLanguage));
    });
    document.querySelectorAll("[data-copy-target]").forEach((button) => {
      button.addEventListener("click", () => copyText(button));
    });
  });
})();
