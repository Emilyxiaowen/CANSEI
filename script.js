const navLinks = document.querySelectorAll(".bottom-nav a");
const sections = [...document.querySelectorAll("section[id]")];
const appContent = document.querySelector(".app-content");
const languageOptions = document.querySelectorAll(".language-option");
const quickActions = document.querySelectorAll(".quick-actions button");
const addCartButtons = document.querySelectorAll(".add-cart");
const chatWindow = document.querySelector("#chatWindow");
const cartCount = document.querySelector("#cartCount");
const toast = document.querySelector("#toast");
const plannerChat = document.querySelector("#plannerChat");
const plannerOptions = document.querySelector("#plannerOptions");
const plannerProgress = document.querySelector("#plannerProgress");
const plannerProposal = document.querySelector("#plannerProposal");
const plannerReset = document.querySelector("#plannerReset");
const plannerSummaryItems = document.querySelectorAll("[data-summary]");

let cartItems = 0;
let toastTimer;
let plannerStep = 0;
const plannerAnswers = {};

const plannerQuestions = [
  {
    key: "guests",
    prompt: "ありがとうございます。次に、旅の好みを教えてください。",
    options: ["1名", "2名", "3〜4名", "家族・グループ"],
  },
  {
    key: "preference",
    prompt: "行きたい都市を選んでください。複数都市を含む候補も選べます。",
    options: ["伝統文化", "美食中心", "アート・建築", "温泉・癒し"],
  },
  {
    key: "cities",
    prompt: "食べたい日本美食のジャンルを教えてください。",
    options: ["東京・京都", "東京・京都・直島", "北海道・東京", "九州・瀬戸内"],
  },
  {
    key: "cuisine",
    prompt: "最後に、ご予算感を選んでください。",
    options: ["寿司", "懐石料理", "和牛・鉄板焼き", "日本酒・バー"],
  },
  {
    key: "budget",
    prompt: "ありがとうございます。内容をもとにプランを提案します。",
    options: ["¥100万〜", "¥300万〜", "¥500万〜", "完全オーダーメイド"],
  },
];

const summaryLabels = {
  guests: "人数",
  preference: "旅の好み",
  cities: "行きたい都市",
  cuisine: "日本美食",
  budget: "予算",
};

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

const addPlannerMessage = (type, speaker, text) => {
  const message = document.createElement("div");
  message.className = `ai-message ${type}`;

  const label = document.createElement("span");
  label.textContent = speaker;

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  message.append(label, paragraph);
  plannerChat.append(message);
  message.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

const updatePlannerSummary = (key, value) => {
  const summaryItem = [...plannerSummaryItems].find((item) => item.dataset.summary === key);
  if (!summaryItem) {
    return;
  }

  summaryItem.querySelector("strong").textContent = value;
};

const renderPlannerOptions = () => {
  const question = plannerQuestions[plannerStep];
  plannerOptions.innerHTML = "";
  plannerProgress.textContent = `${plannerStep + 1}/${plannerQuestions.length}`;

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ai-option";
    button.textContent = option;
    button.addEventListener("click", () => selectPlannerOption(option));
    plannerOptions.append(button);
  });
};

const buildProposalText = () => {
  const guests = plannerAnswers.guests;
  const preference = plannerAnswers.preference;
  const cities = plannerAnswers.cities;
  const cuisine = plannerAnswers.cuisine;
  const budget = plannerAnswers.budget;

  return `${guests}のお客様向けに、${cities}を巡る${preference}中心の旅程を作成しました。食体験は${cuisine}を軸に、予算は${budget}の想定で、専用車・専属ガイド・帰国後配送まで含めます。`;
};

const showPlannerProposal = () => {
  plannerOptions.innerHTML = "";
  plannerProgress.textContent = "提案";
  addPlannerMessage("ai", "AI Concierge", buildProposalText());
  plannerProposal.hidden = false;
  plannerReset.hidden = false;
  showToast("AI提案プランを作成しました");
};

const selectPlannerOption = (option) => {
  const question = plannerQuestions[plannerStep];
  plannerAnswers[question.key] = option;
  updatePlannerSummary(question.key, option);
  addPlannerMessage("user", "You", `${summaryLabels[question.key]}：${option}`);

  if (plannerStep === plannerQuestions.length - 1) {
    addPlannerMessage("ai", "AI Concierge", question.prompt);
    showPlannerProposal();
    return;
  }

  plannerStep += 1;
  addPlannerMessage("ai", "AI Concierge", question.prompt);
  renderPlannerOptions();
};

const resetPlanner = () => {
  plannerStep = 0;
  Object.keys(plannerAnswers).forEach((key) => delete plannerAnswers[key]);
  plannerChat.innerHTML = `
    <div class="ai-message ai">
      <span>AI Concierge</span>
      <p>ようこそ。まず、ご旅行の人数を教えてください。</p>
    </div>
  `;
  plannerSummaryItems.forEach((item) => {
    item.querySelector("strong").textContent = "未選択";
  });
  plannerProposal.hidden = true;
  plannerReset.hidden = true;
  renderPlannerOptions();
  showToast("AIヒアリングを最初から開始します");
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

plannerReset.addEventListener("click", resetPlanner);
appContent.addEventListener("scroll", setActiveNav, { passive: true });
renderPlannerOptions();
setActiveNav();
