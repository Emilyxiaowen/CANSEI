const navLinks = document.querySelectorAll(".bottom-nav a");
const sections = [...document.querySelectorAll("section[id]")];
const appContent = document.querySelector(".app-content");
const choices = document.querySelectorAll(".choice");
const languageOptions = document.querySelectorAll(".language-option");
const quickActions = document.querySelectorAll(".quick-actions button");
const addCartButtons = document.querySelectorAll(".add-cart");
const chatWindow = document.querySelector("#chatWindow");
const cartCount = document.querySelector("#cartCount");
const toast = document.querySelector("#toast");

let cartItems = 0;
let toastTimer;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
};

const setActiveNav = () => {
  const currentScroll = appContent.scrollTop;
  const activeSection = sections
    .slice()
    .reverse()
    .find((section) => currentScroll >= section.offsetTop - appContent.offsetTop - 120);

  if (!activeSection) {
    return;
  }

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeSection.id}`);
  });
};

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    choices.forEach((item) => item.classList.remove("active"));
    choice.classList.add("active");
    showToast(`${choice.textContent}を選択しました`);
  });
});

languageOptions.forEach((option) => {
  option.addEventListener("click", () => {
    languageOptions.forEach((item) => item.classList.remove("active"));
    option.classList.add("active");

    if (option.dataset.language === "日本語") {
      showToast("日本語で表示中です");
      return;
    }

    showToast(`${option.dataset.language}への切り替え導線です。モック本文は日本語表示です。`);
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
      "<span>Concierge</span><p>承知しました。最適な候補を確認し、すぐにご案内します。</p>";

    chatWindow.append(guestMessage, conciergeReply);
    conciergeReply.scrollIntoView({ behavior: "smooth", block: "nearest" });
    showToast("コンシェルジェに送信しました");
  });
});

addCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cartItems += 1;
    cartCount.textContent = `${cartItems}点`;
    button.textContent = "追加済";
    button.disabled = true;
    showToast("カートに追加しました");
  });
});

appContent.addEventListener("scroll", setActiveNav, { passive: true });
setActiveNav();
