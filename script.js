const navButtons = document.querySelectorAll(".bottom-nav button");
const screens = document.querySelectorAll(".app-screen");
const openScreenButtons = document.querySelectorAll("[data-open-screen]");
const appContent = document.querySelector(".app-content");
const languageSelect = document.querySelector("#languageSelect");
const addCartButtons = document.querySelectorAll(".add-cart");
const cartCount = document.querySelector("#cartCount");
const toast = document.querySelector("#toast");
const plannerChat = document.querySelector("#plannerChat");
const plannerOptions = document.querySelector("#plannerOptions");
const plannerProgress = document.querySelector("#plannerProgress");
const plannerProposal = document.querySelector("#plannerProposal");
const plannerReset = document.querySelector("#plannerReset");
const plannerSummaryItems = document.querySelectorAll("[data-summary]");
const guideOptions = document.querySelectorAll(".guide-option");
const guideChat = document.querySelector("#guideChat");
const guidePrompts = document.querySelectorAll(".guide-prompts button");
const selectedGuideAvatar = document.querySelector("#selectedGuideAvatar");
const selectedGuideName = document.querySelector("#selectedGuideName");
const selectedGuideTone = document.querySelector("#selectedGuideTone");
const chipButtons = document.querySelectorAll(".chip");
const mypageForm = document.querySelector("#mypageForm");

let cartItems = 0;
let toastTimer;
let plannerStep = 0;
let activeGuide = "anime";
const plannerAnswers = {};

const plannerQuestions = [
  { key: "guests", prompt: "ありがとうございます。次に、旅の好みを教えてください。", options: ["1名", "2名", "3〜4名", "家族・グループ"] },
  { key: "preference", prompt: "行きたい都市を選んでください。複数都市を含む候補も選べます。", options: ["伝統文化", "美食中心", "アート・建築", "温泉・癒し"] },
  { key: "cities", prompt: "食べたい日本美食のジャンルを教えてください。", options: ["東京・京都", "東京・京都・直島", "北海道・東京", "九州・瀬戸内"] },
  { key: "cuisine", prompt: "最後に、ご予算感を選んでください。", options: ["寿司", "懐石料理", "和牛・鉄板焼き", "日本酒・バー"] },
  { key: "budget", prompt: "ありがとうございます。内容をもとにプランを提案します。", options: ["¥100万〜", "¥300万〜", "¥500万〜", "完全オーダーメイド"] },
];

const summaryLabels = {
  guests: "人数",
  preference: "旅の好み",
  cities: "行きたい都市",
  cuisine: "日本美食",
  budget: "予算",
};

const guideProfiles = {
  anime: {
    avatar: "萌",
    className: "anime",
    name: "萌え系アニメガイド・Momo",
    shortName: "Momo",
    tone: "明るく、親しみやすく、写真映えポイントも交えて説明します。",
    style: "かわいくテンポよく",
  },
  student: {
    avatar: "紬",
    className: "student",
    name: "女子大学生ガイド・Tsumugi",
    shortName: "Tsumugi",
    tone: "友達のように親しみやすく、最新のカフェや散策ルートも提案します。",
    style: "親しみやすく等身大に",
  },
  scholar: {
    avatar: "匠",
    className: "scholar",
    name: "博識なおじさんガイド・Takumi",
    shortName: "Takumi",
    tone: "歴史、宗教、美術の背景まで、深く落ち着いた語り口で説明します。",
    style: "文化背景を丁寧に",
  },
  traveler: {
    avatar: "航",
    className: "traveler",
    name: "旅行好き30代男性ガイド・Ko",
    shortName: "Ko",
    tone: "実用情報、移動のコツ、現地での楽しみ方をテンポよく案内します。",
    style: "実用的で軽快に",
  },
};

const guideAnswers = {
  fushimi: "伏見稲荷は、千本鳥居が山道に連なる京都屈指の名所です。朝の早い時間は人が少なく、朱色の鳥居と木漏れ日のコントラストが美しく、写真にも向いています。稲荷信仰は商売繁盛と五穀豊穣に関わるため、富裕層ゲストには日本の祈りと商いの文化として説明すると深く楽しめます。",
  kinkakuji: "金閣寺は正式には鹿苑寺といい、足利義満の山荘を起源とします。金箔の建築そのものだけでなく、池に映る姿、庭園の余白、室町文化の美意識が見どころです。晴天だけでなく、雨の日のしっとりした金閣も非常に上品です。",
  gion: "祇園は花街文化が残るエリアで、夕方から夜にかけて石畳と町家の雰囲気が際立ちます。舞妓さんを見かけても追いかけず、距離を保って楽しむのが大切です。個室の懐石やバーを組み合わせると、落ち着いた大人の京都体験になります。",
  naoshima: "直島は瀬戸内海の自然と現代アートが融合する島です。作品を単体で見るだけでなく、海、光、建築、移動時間まで含めて体験するのが魅力です。安藤忠雄建築や地中美術館は、静けさの中で作品と向き合う贅沢な時間を提供します。",
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
};

const switchScreen = (screenName) => {
  screens.forEach((screen) => screen.classList.toggle("active", screen.dataset.screen === screenName));
  navButtons.forEach((button) => button.classList.toggle("active", button.dataset.screenTarget === screenName));
  appContent.scrollTo({ top: 0, behavior: "smooth" });
};

const addPlannerMessage = (type, speaker, text) => {
  const message = document.createElement("div");
  message.className = `ai-message ${type}`;
  message.innerHTML = `<span></span><p></p>`;
  message.querySelector("span").textContent = speaker;
  message.querySelector("p").textContent = text;
  plannerChat.append(message);
  message.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

const updatePlannerSummary = (key, value) => {
  const summaryItem = [...plannerSummaryItems].find((item) => item.dataset.summary === key);
  if (summaryItem) summaryItem.querySelector("strong").textContent = value;
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

const buildProposalText = () => `${plannerAnswers.guests}のお客様向けに、${plannerAnswers.cities}を巡る${plannerAnswers.preference}中心の旅程を作成しました。食体験は${plannerAnswers.cuisine}を軸に、予算は${plannerAnswers.budget}の想定で、専用車・AIガイド・帰国後配送まで含めます。`;

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
  plannerChat.innerHTML = '<div class="ai-message ai"><span>AI Concierge</span><p>ようこそ。まず、ご旅行の人数を教えてください。</p></div>';
  plannerSummaryItems.forEach((item) => { item.querySelector("strong").textContent = "未選択"; });
  plannerProposal.hidden = true;
  plannerReset.hidden = true;
  renderPlannerOptions();
  showToast("AIヒアリングを最初から開始します");
};

const updateSelectedGuide = (guideKey) => {
  activeGuide = guideKey;
  const guide = guideProfiles[guideKey];
  guideOptions.forEach((option) => option.classList.toggle("active", option.dataset.guide === guideKey));
  selectedGuideAvatar.textContent = guide.avatar;
  selectedGuideAvatar.className = `guide-avatar ${guide.className}`;
  selectedGuideName.textContent = guide.name;
  selectedGuideTone.textContent = guide.tone;
  guideChat.innerHTML = `<div class="guide-message guide"><span>${guide.shortName}</span><p>${guide.name}です。${guide.tone}知りたい観光地を選んでください。</p></div>`;
  showToast(`${guide.name}を選択しました`);
};

const askGuide = (topicKey, promptLabel) => {
  const guide = guideProfiles[activeGuide];
  const userMessage = document.createElement("div");
  userMessage.className = "guide-message user";
  userMessage.innerHTML = `<span>You</span><p>${promptLabel || "観光地について教えて"}</p>`;

  const guideMessage = document.createElement("div");
  guideMessage.className = "guide-message guide";
  guideMessage.innerHTML = `<span>${guide.shortName}</span><p>${guide.style}ご案内します。${guideAnswers[topicKey]}</p>`;

  guideChat.append(userMessage, guideMessage);
  guideMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

navButtons.forEach((button) => button.addEventListener("click", () => switchScreen(button.dataset.screenTarget)));
openScreenButtons.forEach((button) => button.addEventListener("click", () => switchScreen(button.dataset.openScreen)));

languageSelect.addEventListener("change", () => {
  const label = languageSelect.options[languageSelect.selectedIndex].textContent;
  showToast(label === "日本語" ? "日本語で表示中です" : `${label}への切り替え導線です。モック本文は日本語表示です。`);
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

guideOptions.forEach((option) => option.addEventListener("click", () => updateSelectedGuide(option.dataset.guide)));
guidePrompts.forEach((button) => button.addEventListener("click", () => askGuide(button.dataset.topic, button.textContent)));
chipButtons.forEach((button) => button.addEventListener("click", () => button.classList.toggle("active")));
mypageForm.addEventListener("submit", (event) => { event.preventDefault(); showToast("MyPageのお客様情報を保存しました"); });
plannerReset.addEventListener("click", resetPlanner);
renderPlannerOptions();
switchScreen("home");
