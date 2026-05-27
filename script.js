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
const plannerConfirm = document.querySelector("#plannerConfirm");
const plannerQuestionHint = document.querySelector("#plannerQuestionHint");
const plannerProposal = document.querySelector("#plannerProposal");
const plannerProposalText = document.querySelector("#plannerProposalText");
const plannerReset = document.querySelector("#plannerReset");
const guideOptions = document.querySelectorAll(".guide-option");
const guideChat = document.querySelector("#guideChat");
const guidePrompts = document.querySelectorAll(".guide-prompts button");
const selectedGuideImage = document.querySelector("#selectedGuideImage");
const selectedGuideName = document.querySelector("#selectedGuideName");
const selectedGuideTone = document.querySelector("#selectedGuideTone");
const selectedGuideRole = document.querySelector("#selectedGuideRole");
const selectedGuideLook = document.querySelector("#selectedGuideLook");
const chipButtons = document.querySelectorAll(".chip");
const mypageForm = document.querySelector("#mypageForm");

let cartItems = 0;
let toastTimer;
let plannerStep = 0;
let activeGuide = "anime";
let currentMultiSelection = [];
const plannerAnswers = {};

const plannerQuestions = [
  {
    key: "guests",
    label: "人数",
    text: "ご旅行の人数を教えてください。",
    options: ["1名", "2名", "3〜4名", "家族・グループ"],
  },
  {
    key: "duration",
    label: "滞在日数",
    text: "日本には何日間滞在されますか？",
    options: ["3〜4日", "5〜7日", "8〜10日", "2週間以上"],
  },
  {
    key: "cities",
    label: "行きたい都市",
    text: "行きたい都市を複数選んでください。",
    multiple: true,
    options: ["東京", "京都", "大阪", "直島", "北海道", "金沢", "箱根", "沖縄"],
  },
  {
    key: "travelStyle",
    label: "旅の好み",
    text: "旅の好みを複数選んでください。",
    multiple: true,
    options: ["伝統文化", "美食", "アート・建築", "自然・温泉", "ショッピング", "家族向け", "ウェルネス", "ナイトライフ"],
  },
  {
    key: "cuisine",
    label: "日本美食",
    text: "食べたい日本美食のジャンルを複数選んでください。",
    multiple: true,
    options: ["寿司", "懐石料理", "和牛・鉄板焼き", "天ぷら", "日本酒・バー", "ラーメン", "精進料理", "スイーツ"],
  },
  {
    key: "foodRestrictions",
    label: "食事制限",
    text: "苦手な食材や食事制限があれば選んでください。",
    multiple: true,
    options: ["特になし", "甲殻類NG", "辛い料理NG", "ベジタリアン", "ハラール", "グルテンフリー", "ナッツアレルギー"],
  },
  {
    key: "hotel",
    label: "宿泊グレード",
    text: "ホテルの希望グレードを教えてください。",
    options: ["5つ星ホテル", "旅館スイート", "ヴィラ貸切", "コンシェルジュ提案"],
  },
  {
    key: "transport",
    label: "移動手段",
    text: "希望する移動手段を複数選んでください。",
    multiple: true,
    options: ["専用車", "新幹線グリーン車", "ヘリ移動", "徒歩散策", "空港VIP送迎"],
  },
  {
    key: "budget",
    label: "予算",
    text: "最後に、ご予算感を選んでください。",
    options: ["¥100万〜", "¥300万〜", "¥500万〜", "完全オーダーメイド"],
  },
];

const guideProfiles = {
  anime: {
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    name: "Luna Grace",
    role: "萌え系アニメガイド",
    shortName: "Luna",
    look: "外観：20代前半の明るい女性。ロングのダークブラウンヘア、淡いピンクのスカーフ、上品な白ジャケット。表情は柔らかく、ポップカルチャーにも詳しい雰囲気。",
    tone: "明るく、親しみやすく、写真映えポイントも交えて説明します。",
    style: "かわいくテンポよく",
  },
  student: {
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    name: "Emma Reed",
    role: "若い女子大学生ガイド",
    shortName: "Emma",
    look: "外観：親しみやすい大学生風の女性。ナチュラルなボブヘア、アイボリーのニット、チェックストール。清潔感があり、話しかけやすい印象。",
    tone: "友達のように親しみやすく、最新のカフェや散策ルートも提案します。",
    style: "親しみやすく等身大に",
  },
  scholar: {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    name: "Arthur Blake",
    role: "博識なおじさんガイド",
    shortName: "Arthur",
    look: "外観：50代の落ち着いた男性。シルバーグレーの髪、丸眼鏡、ネイビージャケット、革の手帳。文化史を深く語る知的な雰囲気。",
    tone: "歴史、宗教、美術の背景まで、深く落ち着いた語り口で説明します。",
    style: "文化背景を丁寧に",
  },
  traveler: {
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    name: "Kai Bennett",
    role: "旅行大好き30代男性ガイド",
    shortName: "Kai",
    look: "外観：30代のアクティブな男性。短い黒髪、カーキのトラベルジャケット、レザーカメラストラップ。移動やローカル情報に強い印象。",
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
  message.className = `line-message ${type}`;
  message.innerHTML = "<span></span><p></p>";
  message.querySelector("span").textContent = speaker;
  message.querySelector("p").textContent = text;
  plannerChat.append(message);
  message.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

const formatAnswer = (answer) => Array.isArray(answer) ? answer.join("、") : answer;

const renderPlannerOptions = () => {
  const question = plannerQuestions[plannerStep];
  currentMultiSelection = [];
  plannerOptions.innerHTML = "";
  plannerConfirm.hidden = !question.multiple;
  plannerProgress.textContent = `${plannerStep + 1}/${plannerQuestions.length}`;
  plannerQuestionHint.textContent = question.multiple ? "複数選択できます" : "1つ選んでください";

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "line-reply-chip";
    button.textContent = option;

    if (question.multiple) {
      button.addEventListener("click", () => {
        if (option === "特になし") {
          currentMultiSelection = [option];
          plannerOptions.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
          return;
        }

        currentMultiSelection = currentMultiSelection.filter((item) => item !== "特になし");
        const selected = currentMultiSelection.includes(option);
        currentMultiSelection = selected
          ? currentMultiSelection.filter((item) => item !== option)
          : [...currentMultiSelection, option];
        button.classList.toggle("active", !selected);
        plannerOptions.querySelectorAll("button").forEach((item) => {
          if (item.textContent === "特になし") item.classList.remove("active");
        });
      });
    } else {
      button.addEventListener("click", () => advancePlanner(option));
    }

    plannerOptions.append(button);
  });
};

const advancePlanner = (answer) => {
  const question = plannerQuestions[plannerStep];
  plannerAnswers[question.key] = answer;
  addPlannerMessage("user", "You", `${question.label}：${formatAnswer(answer)}`);

  if (plannerStep === plannerQuestions.length - 1) {
    addPlannerMessage("ai", "AI Concierge", "ありがとうございます。いただいた内容をもとに、富裕層向けの上質な日本滞在プランを提案します。");
    showPlannerProposal();
    return;
  }

  plannerStep += 1;
  addPlannerMessage("ai", "AI Concierge", plannerQuestions[plannerStep].text);
  renderPlannerOptions();
};

const buildProposalText = () => {
  const answer = (key) => formatAnswer(plannerAnswers[key] || "未選択");
  return `${answer("guests")}・${answer("duration")}の滞在として、${answer("cities")}を中心に、${answer("travelStyle")}を重視した旅程を設計します。食体験は${answer("cuisine")}を軸に、${answer("foodRestrictions")}を反映。宿泊は${answer("hotel")}、移動は${answer("transport")}、予算は${answer("budget")}で、AIガイドとコンシェルジェサポートを組み合わせます。`;
};

const showPlannerProposal = () => {
  plannerOptions.innerHTML = "";
  plannerConfirm.hidden = true;
  plannerQuestionHint.textContent = "提案プランが完成しました";
  plannerProgress.textContent = "提案";
  plannerProposalText.textContent = buildProposalText();
  plannerProposal.hidden = false;
  plannerReset.hidden = false;
  showToast("AI提案プランを作成しました");
};

const resetPlanner = () => {
  plannerStep = 0;
  currentMultiSelection = [];
  Object.keys(plannerAnswers).forEach((key) => delete plannerAnswers[key]);
  plannerChat.innerHTML = '<div class="line-message ai"><span>AI Concierge</span><p>こんにちは。LINEのように会話しながら、上質な日本滞在プランを設計します。まず、ご旅行の人数を教えてください。</p></div>';
  plannerProposal.hidden = true;
  plannerReset.hidden = true;
  renderPlannerOptions();
  showToast("AIヒアリングを最初から開始します");
};

const updateSelectedGuide = (guideKey) => {
  activeGuide = guideKey;
  const guide = guideProfiles[guideKey];
  guideOptions.forEach((option) => option.classList.toggle("active", option.dataset.guide === guideKey));
  selectedGuideImage.src = guide.image;
  selectedGuideImage.alt = `${guide.name}の選択中ポートレート`;
  selectedGuideName.textContent = guide.name;
  selectedGuideRole.textContent = guide.role;
  selectedGuideTone.textContent = guide.tone;
  selectedGuideLook.textContent = guide.look;
  guideChat.innerHTML = `<div class="guide-message guide"><span>${guide.shortName}</span><p>${guide.name}です。${guide.role}として、${guide.tone}知りたい観光地を選んでください。</p></div>`;
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

plannerConfirm.addEventListener("click", () => {
  if (currentMultiSelection.length === 0) {
    showToast("1つ以上選択してください");
    return;
  }
  advancePlanner([...currentMultiSelection]);
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
