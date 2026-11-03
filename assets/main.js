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

  // Formulário da lista de espera: envia os dados para o e-mail da Tenas
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const status = document.getElementById("form-status");
      const btn = form.querySelector('button[type="submit"]');
      const data = Object.fromEntries(new FormData(form).entries());
      if (data._honey) return;
      data._subject = "Nova inscrição na lista de espera: " + data.nome + " (" + data.profissao + ")";
      data._template = "table";
      btn.disabled = true;
      status.textContent = "Enviando…";
      fetch("https://formsubmit.co/ajax/" + FORM_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function () {
          form.hidden = true;
          document.getElementById("form-success").hidden = false;
        })
        .catch(function () {
          btn.disabled = false;
          status.innerHTML = 'Não conseguimos enviar agora. Tente de novo ou <a data-fallback href="' +
            waLink("Olá! Quero entrar na lista de espera. Sou " + data.nome + ", " + data.profissao + ".") +
            '" target="_blank" rel="noopener">fale pelo WhatsApp</a>.';
        });
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
