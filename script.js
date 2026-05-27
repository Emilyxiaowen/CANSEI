const navLinks = document.querySelectorAll(".nav-link");
const sections = [...document.querySelectorAll("section[id]")];
const choices = document.querySelectorAll(".choice");
const quickActions = document.querySelectorAll(".quick-actions button");
const addCartButtons = document.querySelectorAll(".add-cart");
const chatWindow = document.querySelector("#chatWindow");
const cartCount = document.querySelector("#cartCount");

let cartItems = 0;

const setActiveNav = () => {
  const activeSection = sections
    .slice()
    .reverse()
    .find((section) => window.scrollY >= section.offsetTop - 140);

  if (!activeSection) {
    return;
  }

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeSection.id}`);
  });
};

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    choices.forEach((item) => item.classList.remove("active"));
    choice.classList.add("active");
  });
});

quickActions.forEach((action) => {
  action.addEventListener("click", () => {
    const guestMessage = document.createElement("div");
    guestMessage.className = "message guest";
    guestMessage.innerHTML = `<span>You</span><p>${action.dataset.message}</p>`;

    const conciergeReply = document.createElement("div");
    conciergeReply.className = "message concierge";
    conciergeReply.innerHTML =
      "<span>Concierge</span><p>Understood. I will confirm the best available option shortly.</p>";

    chatWindow.append(guestMessage, conciergeReply);
    conciergeReply.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

addCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cartItems += 1;
    cartCount.textContent = `${cartItems} ${cartItems === 1 ? "item" : "items"}`;
    button.textContent = "Added";
    button.disabled = true;
  });
});

window.addEventListener("scroll", setActiveNav, { passive: true });
setActiveNav();
