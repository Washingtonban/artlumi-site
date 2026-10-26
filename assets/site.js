const CONFIG = {
  instagram: "",
  tiktok: "",
  youtube: "",
  whatsapp: "",
  email: "contato@artlumi.com.br"
};

const socialNetworks = ["instagram", "tiktok", "youtube"];
const whatsappMessage = "Olá! Vim pelo site da Artlumi e quero fazer uma encomenda.";

document.querySelectorAll("[data-config]").forEach((link) => {
  const key = link.dataset.config;
  const value = (CONFIG[key] || "").trim();

  if (!value) {
    link.hidden = true;
    return;
  }

  if (key === "whatsapp") {
    const number = value.replace(/\D/g, "");
    if (!number) return;
    link.href = `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage)}`;
  } else if (key === "email") {
    link.href = `mailto:${value}`;
    link.firstChild.textContent = `${value} `;
  } else if (socialNetworks.includes(key)) {
    link.href = value;
  }

  link.hidden = false;
});

document.getElementById("redes-em-breve").hidden = socialNetworks.some((key) =>
  Boolean((CONFIG[key] || "").trim())
);

const menuButton = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu-principal");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  menu.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  menu.classList.toggle("is-open", !isOpen);
});

menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
