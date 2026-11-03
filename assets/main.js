/* Tenas Digital — scripts do site */

// Número do WhatsApp (DDI + DDD + número, só dígitos)
const WHATSAPP_NUMBER = "5583991192672";

// E-mail que recebe os cadastros da lista de espera (via FormSubmit.co).
// No primeiro envio, o FormSubmit manda um e-mail de ativação: é só clicar em "Activate".
const FORM_EMAIL = "tenasdesign@gmail.com";
const WHATSAPP_DEFAULT_MSG = "Olá! Vim pelo site da Tenas Digital e quero saber mais sobre os serviços.";

function waLink(message) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message || WHATSAPP_DEFAULT_MSG);
}

document.addEventListener("DOMContentLoaded", function () {
  // Todos os links de WhatsApp usam o número configurado acima
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa") || "");
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Barra de navegação: borda ao rolar + menu mobile
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const toggle = nav.querySelector(".nav__toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  }

  // Fechar faixa de anúncio
  document.querySelectorAll(".announce__close").forEach(function (btn) {
    btn.addEventListener("click", function () { btn.closest(".announce").hidden = true; });
  });

  // Filtros de categoria na página de artigos
  const chips = document.querySelectorAll(".chip[data-filter]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      const f = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      document.querySelectorAll(".articles .card").forEach(function (card) {
        card.hidden = !(f === "todos" || card.getAttribute("data-cat") === f);
      });
    });
  });

  // Formulário da lista de espera: envio normal para o FormSubmit, que manda os dados
  // para o e-mail da Tenas. Depois do envio, a pessoa volta para a página /obrigado deste site.
  const form = document.getElementById("contact-form");
  if (form) {
    form.action = "https://formsubmit.co/" + FORM_EMAIL;
    const next = form.querySelector('input[name="_next"]');
    if (next && /^https?:/.test(location.origin)) next.value = location.origin + "/obrigado";
    form.addEventListener("submit", function () {
      const nome = form.querySelector('[name="nome"]').value;
      const prof = form.querySelector('[name="profissao"]').value;
      form.querySelector('input[name="_subject"]').value = "Nova inscrição na lista de espera: " + nome + " (" + prof + ")";
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      document.getElementById("form-status").textContent = "Enviando…";
    });
  }

  // Botões de compartilhar usam o endereço da página atual
  document.querySelectorAll("[data-share]").forEach(function (a) {
    const url = encodeURIComponent(location.href.split("#")[0]);
    const title = encodeURIComponent(document.title);
    a.href = a.getAttribute("data-share") === "whatsapp"
      ? "https://wa.me/?text=" + title + "%20" + url
      : "https://www.linkedin.com/sharing/share-offsite/?url=" + url;
  });

  // Ano no rodapé
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
});
