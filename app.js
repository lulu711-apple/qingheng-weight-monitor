const STORAGE_KEY = "qingheng-monitor-v1";
const APP_VERSION = 1;
const DAY_MS = 24 * 60 * 60 * 1000;

const FOODS = [
  { id: "rice", name: "米饭", unit: "1碗", carbs: 50, protein: 5, fat: 1 },
  { id: "noodles", name: "面条", unit: "1碗", carbs: 55, protein: 9, fat: 3 },
  { id: "corn", name: "玉米", unit: "1根", carbs: 28, protein: 4, fat: 2 },
  { id: "sweet-potato", name: "红薯", unit: "1个", carbs: 35, protein: 2, fat: 0 },
  { id: "egg", name: "鸡蛋", unit: "1个", carbs: 1, protein: 6, fat: 5 },
  { id: "chicken", name: "鸡胸肉", unit: "100g", carbs: 0, protein: 31, fat: 4 },
  { id: "beef", name: "瘦牛肉", unit: "100g", carbs: 0, protein: 26, fat: 8 },
  { id: "fish", name: "鱼虾", unit: "100g", carbs: 0, protein: 21, fat: 5 },
  { id: "tofu", name: "豆腐", unit: "100g", carbs: 3, protein: 10, fat: 5 },
  { id: "greens", name: "绿叶菜", unit: "1盘", carbs: 8, protein: 3, fat: 1 },
  { id: "apple", name: "苹果", unit: "1个", carbs: 25, protein: 1, fat: 0 },
  { id: "banana", name: "香蕉", unit: "1根", carbs: 23, protein: 1, fat: 0 },
  { id: "milk", name: "牛奶", unit: "250ml", carbs: 12, protein: 8, fat: 8 },
  { id: "yogurt", name: "原味酸奶", unit: "1杯", carbs: 15, protein: 8, fat: 3 },
  { id: "nuts", name: "坚果", unit: "1小把", carbs: 6, protein: 6, fat: 15 }
].map(function (food) {
  return Object.assign({}, food, {
    source: "常用食物参考值",
    confidence: "中",
    calories: Math.round(food.carbs * 4 + food.protein * 4 + food.fat * 9)
  });
});

const HEALTHY_SWAPS = [
  {
    id: "fried-chicken",
    label: "炸鸡",
    keywords: ["炸鸡", "鸡翅", "鸡腿", "鸡米花", "炸物"],
    options: [
      {
        name: "空气炸脆皮鸡腿配酸奶芥末酱",
        taste: "薄脆外壳、嫩滑鸡肉和酸香蘸酱都保留，用空气炸减少吸油。",
        ingredients: "去皮鸡腿、全麦脆片、无糖酸奶、芥末、烤蔬菜",
        carbs: 20, protein: 38, fat: 13
      },
      {
        name: "香煎鸡胸配番茄辣酱",
        taste: "焦香表面和酸辣酱汁补足炸鸡的咸香刺激，鸡胸保持多汁。",
        ingredients: "鸡胸、番茄、辣椒粉、彩椒、西兰花",
        carbs: 18, protein: 40, fat: 10
      }
    ]
  },
  {
    id: "burger",
    label: "汉堡",
    keywords: ["汉堡", "牛肉堡", "鸡腿堡", "堡"],
    options: [
      {
        name: "全麦鸡胸双层蔬菜堡",
        taste: "保留麦香面包、厚实肉感和酱汁，用双层鸡胸提升咀嚼满足感。",
        ingredients: "全麦胚、鸡胸肉饼、生菜、番茄、洋葱、酸奶芥末酱",
        carbs: 42, protein: 35, fat: 12
      },
      {
        name: "生菜双层瘦牛肉堡",
        taste: "瘦牛肉和焦糖洋葱保留浓郁肉香，减少厚面包与高脂酱料。",
        ingredients: "全麦小汉堡胚、瘦牛肉、生菜、番茄、焦糖洋葱",
        carbs: 25, protein: 32, fat: 18
      }
    ]
  },
  {
    id: "milk-tea",
    label: "奶茶或甜饮",
    keywords: ["奶茶", "珍珠", "奶盖", "甜饮", "饮料", "拿铁"],
    options: [
      {
        name: "无糖鲜奶茶配低糖波霸",
        taste: "奶香和咀嚼珍珠的满足感都在，用鲜奶与少量低糖波霸替代奶精。",
        ingredients: "无糖乌龙茶、鲜奶、少量低糖波霸",
        carbs: 12, protein: 8, fat: 6
      },
      {
        name: "冷泡乌龙豆乳",
        taste: "豆乳提供顺滑浓郁感，冷泡茶保留清香，不加奶盖也有厚实口感。",
        ingredients: "冷泡乌龙茶、无糖豆乳、冰块",
        carbs: 8, protein: 7, fat: 4
      }
    ]
  },
  {
    id: "hotpot",
    label: "火锅或麻辣烫",
    keywords: ["火锅", "麻辣烫", "麻辣锅", "涮锅"],
    options: [
      {
        name: "番茄清汤瘦牛肉蔬菜锅",
        taste: "番茄酸甜浓郁，蒜香醋蘸料保留辣味和火锅氛围。",
        ingredients: "番茄锅底、瘦牛肉、豆腐、菌菇、绿叶菜、蒜蓉醋",
        carbs: 35, protein: 38, fat: 15
      },
      {
        name: "菌菇鸡汤鱼片锅",
        taste: "菌菇与鸡汤鲜味充足，鱼片嫩滑，小米辣保留刺激感。",
        ingredients: "菌菇鸡汤、鱼片、虾滑、豆腐、娃娃菜、小米辣",
        carbs: 40, protein: 42, fat: 12
      }
    ]
  },
  {
    id: "bbq",
    label: "烧烤",
    keywords: ["烧烤", "烤串", "串串", "烤肉"],
    options: [
      {
        name: "孜然鸡胸蔬菜烤串",
        taste: "孜然、辣椒和焦香保留，用鸡胸与蔬菜减少肥肉和刷油。",
        ingredients: "鸡胸、蘑菇、彩椒、洋葱、孜然、辣椒粉",
        carbs: 25, protein: 40, fat: 12
      },
      {
        name: "蒜香虾仁菌菇锡纸烧",
        taste: "蒜香和焦烤风味突出，虾仁弹嫩、菌菇吸汁。",
        ingredients: "虾仁、金针菇、口蘑、蒜末、小米辣、少量橄榄油",
        carbs: 20, protein: 32, fat: 10
      }
    ]
  },
  {
    id: "fries",
    label: "薯条",
    keywords: ["薯条", "薯片", "油炸", "炸薯"],
    options: [
      {
        name: "空气炸红薯条",
        taste: "外层微脆、内部软糯，用海盐和黑胡椒保留薯条式满足感。",
        ingredients: "红薯、少量玉米淀粉、海盐、黑胡椒",
        carbs: 38, protein: 3, fat: 4
      },
      {
        name: "烤南瓜鹰嘴豆小食",
        taste: "南瓜软甜、鹰嘴豆外脆，辣椒孜然带来炸物式咸香。",
        ingredients: "南瓜、鹰嘴豆、辣椒粉、孜然、少量橄榄油",
        carbs: 35, protein: 10, fat: 8
      }
    ]
  },
  {
    id: "dessert",
    label: "蛋糕或甜品",
    keywords: ["蛋糕", "甜品", "饼干", "巧克力", "冰淇淋", "雪糕"],
    options: [
      {
        name: "希腊酸奶莓果燕麦杯",
        taste: "浓稠酸奶模拟奶油口感，莓果和燕麦脆片保留甜品层次。",
        ingredients: "无糖希腊酸奶、草莓、蓝莓、燕麦、少量蜂蜜",
        carbs: 25, protein: 15, fat: 7
      },
      {
        name: "香蕉可可燕麦软杯",
        taste: "香蕉自然甜、无糖可可提供巧克力风味，口感像湿润软蛋糕。",
        ingredients: "香蕉、燕麦、无糖可可粉、鸡蛋、少量牛奶",
        carbs: 38, protein: 10, fat: 7
      }
    ]
  },
  {
    id: "noodles",
    label: "泡面或重口面",
    keywords: ["泡面", "方便面", "拉面", "速食面"],
    options: [
      {
        name: "荞麦鸡丝蔬菜汤面",
        taste: "保留热汤面和吸溜口感，用荞麦面、鸡丝和蔬菜补足饱腹与鲜味。",
        ingredients: "荞麦面、鸡丝、青菜、香菇、鸡蛋、低盐汤底",
        carbs: 48, protein: 30, fat: 10
      },
      {
        name: "番茄鸡蛋豆腐面",
        taste: "番茄汤底酸甜开胃，鸡蛋和豆腐让汤面更有满足感。",
        ingredients: "全麦面、番茄、鸡蛋、嫩豆腐、青菜",
        carbs: 44, protein: 24, fat: 12
      }
    ]
  }
];

const ACTIVITY_LEVELS = [
  { value: "1.2", label: "久坐为主" },
  { value: "1.375", label: "每周轻度运动1—3次" },
  { value: "1.55", label: "每周中等运动3—5次" },
  { value: "1.725", label: "每周高强度运动6—7次" }
];

let state = loadState();
let sessionUserId = null;
let currentView = "home";
let selectedRecordDate = dateKey();
let trendDays = 7;
let hiddenAt = 0;
let toastTimer = null;

const authView = document.getElementById("auth-view");
const appView = document.getElementById("app-view");
const viewRoot = document.getElementById("view-root");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");

document.addEventListener("click", handleGlobalClick);
document.getElementById("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", function (event) {
  if (event.target === modal) closeModal();
});

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    hiddenAt = Date.now();
    return;
  }
  if (hiddenAt && Date.now() - hiddenAt >= 2 * 60 * 1000 && sessionUserId) lockApp();
});

init();

function init() {
  renderAuth("login");
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./service-worker.js").catch(function () {});
    });
  }
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {});
}

function defaultState() {
  return {
    version: APP_VERSION,
    users: [],
    entries: {},
    lastUsername: ""
  };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const next = Object.assign(defaultState(), parsed || {});
    if (!Array.isArray(next.users)) next.users = [];
    if (!next.entries || typeof next.entries !== "object") next.entries = {};
    return next;
  } catch (error) {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function activeUser() {
  return state.users.find(function (user) { return user.id === sessionUserId; }) || null;
}

function userStore(userId) {
  if (!state.entries[userId]) state.entries[userId] = { days: {} };
  if (!state.entries[userId].days) state.entries[userId].days = {};
  return state.entries[userId];
}

function dateKey(date) {
  const value = date || new Date();
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function dateFromKey(key) {
  return new Date(key + "T00:00:00");
}

function shiftDate(key, days) {
  const date = dateFromKey(key);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}

function shortDate(key) {
  const date = dateFromKey(key);
  return (date.getMonth() + 1) + "/" + date.getDate();
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeUsername(value) {
  return String(value || "").trim().toLocaleLowerCase("zh-CN");
}

function usernameKey(value) {
  return normalizeUsername(value);
}

function randomHex(length) {
  const bytes = new Uint8Array(length);
  if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes);
  else {
    for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes).map(function (value) { return value.toString(16).padStart(2, "0"); }).join("");
}

async function hashPassword(password, salt) {
  const text = salt + ":" + password;
  if (window.crypto && window.crypto.subtle) {
    const data = new TextEncoder().encode(text);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest)).map(function (value) {
      return value.toString(16).padStart(2, "0");
    }).join("");
  }
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return "fallback-" + (hash >>> 0).toString(16);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2300);
}

function renderAuth(mode) {
  document.getElementById("app-view").hidden = true;
  authView.hidden = false;
  const loginMode = mode !== "register";
  const lastUsername = state.lastUsername || "";
  document.getElementById("auth-card").innerHTML = loginMode ? `
    <h2>登录轻衡</h2>
    <p class="auth-copy">输入用户名和密码，继续查看自己的体重与健康记录。</p>
    <form id="login-form">
      <div class="field">
        <label for="login-username">用户名</label>
        <input id="login-username" autocomplete="username" maxlength="16" value="${escapeHtml(lastUsername)}" placeholder="输入用户名">
      </div>
      <div class="field">
        <label for="login-password">密码</label>
        <input id="login-password" type="password" autocomplete="current-password" maxlength="64" placeholder="输入密码">
      </div>
      <p class="text-error" id="auth-error"></p>
      <button class="primary" type="submit">进入轻衡</button>
    </form>
    <div class="button-stack">
      <button class="secondary" type="button" id="show-register">创建新用户</button>
    </div>
  ` : `
    <h2>创建本地用户</h2>
    <p class="auth-copy">每位用户的数据独立保存在当前浏览器，不上传服务器。</p>
    <form id="register-form">
      <div class="form-grid">
        <div class="field full">
          <label for="register-username">用户名</label>
          <input id="register-username" autocomplete="username" maxlength="16" placeholder="2—16个字符">
        </div>
        <div class="field full">
          <label for="register-password">密码</label>
          <input id="register-password" type="password" autocomplete="new-password" maxlength="64" placeholder="至少6位">
        </div>
        <div class="field">
          <label for="register-sex">生理性别</label>
          <select id="register-sex"><option value="female">女</option><option value="male">男</option></select>
        </div>
        <div class="field">
          <label for="register-age">年龄</label>
          <input id="register-age" inputmode="numeric" placeholder="岁">
        </div>
        <div class="field">
          <label for="register-height">身高（cm）</label>
          <input id="register-height" inputmode="decimal" placeholder="例如165">
        </div>
        <div class="field">
          <label for="register-activity">活动水平</label>
          <select id="register-activity">${activityOptions("1.375")}</select>
        </div>
        <div class="field">
          <label for="register-weight">当前体重（kg）</label>
          <input id="register-weight" inputmode="decimal" placeholder="例如65">
        </div>
        <div class="field">
          <label for="register-target">目标体重（kg）</label>
          <input id="register-target" inputmode="decimal" placeholder="例如58">
        </div>
        <div class="field full">
          <label for="register-weeks">计划周期（周）</label>
          <input id="register-weeks" inputmode="numeric" value="16">
        </div>
      </div>
      <p class="text-error" id="auth-error"></p>
      <button class="primary" type="submit">创建并进入</button>
    </form>
    <div class="button-stack">
      <button class="secondary" type="button" id="show-login">已有用户，去登录</button>
    </div>
  `;

  if (loginMode) {
    document.getElementById("show-register").addEventListener("click", function () { renderAuth("register"); });
    document.getElementById("login-form").addEventListener("submit", handleLogin);
    const password = document.getElementById("login-password");
    const username = document.getElementById("login-username");
    setTimeout(function () {
      if (!username.value) username.focus();
      else password.focus();
    }, 40);
  } else {
    document.getElementById("show-login").addEventListener("click", function () { renderAuth("login"); });
    document.getElementById("register-form").addEventListener("submit", handleRegister);
    setTimeout(function () { document.getElementById("register-username").focus(); }, 40);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const error = document.getElementById("auth-error");
  const user = state.users.find(function (item) {
    return normalizeUsername(item.username) === normalizeUsername(username);
  });
  if (!username) {
    error.textContent = "请输入用户名";
    return;
  }
  if (!user) {
    error.textContent = "用户名不存在";
    return;
  }
  if (!password) {
    error.textContent = "请输入密码";
    return;
  }
  error.textContent = "正在验证…";
  const passwordHash = await hashPassword(password, user.salt);
  if (passwordHash !== user.passwordHash) {
    error.textContent = "密码不正确";
    return;
  }
  state.lastUsername = user.username;
  saveState();
  startSession(user);
}

async function handleRegister(event) {
  event.preventDefault();
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value;
  const sex = document.getElementById("register-sex").value;
  const age = Number(document.getElementById("register-age").value);
  const height = Number(document.getElementById("register-height").value);
  const activity = Number(document.getElementById("register-activity").value);
  const currentWeight = Number(document.getElementById("register-weight").value);
  const targetWeight = Number(document.getElementById("register-target").value);
  const planWeeks = Number(document.getElementById("register-weeks").value);
  const error = document.getElementById("auth-error");
  const validation = validateProfileValues(username, age, height, currentWeight, targetWeight, planWeeks);
  if (validation) {
    error.textContent = validation;
    return;
  }
  if (state.users.some(function (user) { return usernameKey(user.username) === usernameKey(username); })) {
    error.textContent = "这个用户名已经存在";
    return;
  }
  if (password.length < 6) {
    error.textContent = "密码至少需要6位";
    return;
  }
  error.textContent = "正在创建…";
  const salt = randomHex(16);
  const user = {
    id: "user-" + Date.now().toString(36) + "-" + randomHex(3),
    username: username,
    salt: salt,
    passwordHash: await hashPassword(password, salt),
    sex: sex,
    age: age,
    height: height,
    activity: activity,
    currentWeight: currentWeight,
    startWeight: currentWeight,
    targetWeight: targetWeight,
    planWeeks: planWeeks,
    startedAt: dateKey(),
    createdAt: new Date().toISOString()
  };
  state.users.push(user);
  userStore(user.id);
  const today = dayRecordForUser(user.id, dateKey(), true);
  today.weight = currentWeight;
  state.lastUsername = username;
  saveState();
  startSession(user);
  showToast("用户已创建");
}

function validateProfileValues(username, age, height, currentWeight, targetWeight, planWeeks) {
  if (username.length < 2 || username.length > 16) return "用户名请输入2—16个字符";
  if (!Number.isFinite(age) || age < 18 || age > 90) return "年龄请输入18—90岁";
  if (!Number.isFinite(height) || height < 120 || height > 230) return "身高请输入120—230厘米";
  if (!Number.isFinite(currentWeight) || currentWeight < 25 || currentWeight > 300) return "当前体重请输入25—300公斤";
  if (!Number.isFinite(targetWeight) || targetWeight < 25 || targetWeight > 300) return "目标体重请输入25—300公斤";
  if (targetWeight >= currentWeight) return "目标体重需要低于当前体重";
  if (!Number.isFinite(planWeeks) || planWeeks < 2 || planWeeks > 104) return "计划周期请输入2—104周";
  return "";
}

function dayRecordForUser(userId, date, create) {
  const store = userStore(userId);
  if (!store.days[date] && create) {
    const user = state.users.find(function (item) { return item.id === userId; });
    store.days[date] = {
      weight: user ? user.currentWeight : null,
      water: [],
      meals: [],
      sleep: null,
      exercises: []
    };
  }
  const record = store.days[date] || null;
  if (record) {
    if (!Array.isArray(record.water)) record.water = [];
    if (!Array.isArray(record.meals)) record.meals = [];
    if (!Array.isArray(record.exercises)) record.exercises = [];
  }
  return record;
}

function startSession(user) {
  sessionUserId = user.id;
  authView.hidden = true;
  appView.hidden = false;
  currentView = "home";
  selectedRecordDate = dateKey();
  updateHeader();
  renderCurrentView();
}

function lockApp() {
  sessionUserId = null;
  closeModal();
  renderAuth("login");
}

function updateHeader() {
  const user = activeUser();
  if (!user) return;
  const now = new Date();
  document.getElementById("today-label").textContent = now.toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long"
  });
  document.getElementById("greeting").textContent = "你好，" + user.username;
  document.getElementById("user-initial").textContent = user.username.slice(0, 1);
  document.getElementById("user-name-chip").textContent = user.username;
}

function activityOptions(selected) {
  return ACTIVITY_LEVELS.map(function (item) {
    return '<option value="' + item.value + '"' + (String(item.value) === String(selected) ? " selected" : "") + ">" + item.label + "</option>";
  }).join("");
}

function renderCurrentView() {
  if (!activeUser()) return;
  document.querySelectorAll(".nav-item").forEach(function (button) {
    button.classList.toggle("is-active", button.dataset.view === currentView);
  });
  if (currentView === "home") renderHome();
  if (currentView === "records") renderRecords();
  if (currentView === "trends") renderTrends();
  if (currentView === "settings") renderSettings();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderHome() {
  const user = activeUser();
  const record = dayRecord(dateKey(), true);
  const weight = Number(record.weight || user.currentWeight);
  user.currentWeight = weight;
  const totalGoal = Math.max(.1, Number(user.startWeight) - Number(user.targetWeight));
  const progress = clamp((Number(user.startWeight) - weight) / totalGoal * 100, 0, 100);
  const calories = recordCalories(record);
  const water = recordWater(record);
  const sleep = sleepHours(record.sleep);
  const exercise = recordExercise(record);
  const target = caloriePlan(user, record);
  const insights = dailyInsights(user, record, target);
  viewRoot.innerHTML = `
    <article class="card hero">
      <div class="section-head">
        <div><p class="eyebrow">CURRENT WEIGHT</p><h2>当前体重</h2></div>
        <span class="pill">目标 ${Number(user.targetWeight).toFixed(1)} kg</span>
      </div>
      <div class="weight-main"><strong>${weight.toFixed(1)}</strong><span>kg</span></div>
      <div class="weight-meta">
        <span>起始 <b>${Number(user.startWeight).toFixed(1)} kg</b></span>
        <span>已完成 <b>${Math.round(progress)}%</b></span>
      </div>
      <div class="progress"><i style="width:${progress}%"></i></div>
      <button class="secondary" type="button" data-action="weight">更新体重</button>
    </article>

    <section class="card">
      <div class="section-head">
        <div><p class="eyebrow">QUICK CHECK-IN</p><h2>今天记一笔</h2></div>
        <span class="pill">${todayCompletion(record)}/5 已完成</span>
      </div>
      <div class="quick-grid">
        <button class="quick-button" type="button" data-action="weight"><span>↕</span><small>体重</small></button>
        <button class="quick-button" type="button" data-action="meal"><span>◒</span><small>饮食</small></button>
        <button class="quick-button" type="button" data-action="water"><span>◌</span><small>饮水</small></button>
        <button class="quick-button" type="button" data-action="sleep"><span>☾</span><small>睡眠</small></button>
        <button class="quick-button" type="button" data-action="exercise"><span>↗</span><small>运动</small></button>
      </div>
    </section>

    <section class="card">
      <div class="section-head">
        <div><p class="eyebrow">TODAY SUMMARY</p><h2>今日汇总</h2></div>
        <span class="pill">${target.complete ? "建议 " + target.lower + "—" + target.upper + " kcal" : "完善资料后计算热量"}</span>
      </div>
      <div class="stat-grid">
        <div class="stat"><small>饮食摄入</small><strong>${calories}</strong><small>kcal</small></div>
        <div class="stat"><small>饮水</small><strong>${water}</strong><small>ml / 1800 ml</small></div>
        <div class="stat"><small>睡眠</small><strong>${sleep ? sleep.toFixed(1) : "--"}</strong><small>小时</small></div>
        <div class="stat"><small>运动</small><strong>${exercise.minutes}</strong><small>分钟</small></div>
      </div>
    </section>

    <section class="card">
      <div class="section-head">
        <div><p class="eyebrow">SMALL NEXT STEP</p><h2>今天的建议</h2></div>
      </div>
      ${insights.map(function (item) {
        return '<article class="advice-card"><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.body) + '</p></article>';
      }).join("")}
    </section>
  `;
}

function todayCompletion(record) {
  return [
    Boolean(record && Number(record.weight)),
    Boolean(record && record.meals && record.meals.length),
    Boolean(record && recordWater(record) >= 1800),
    Boolean(record && record.sleep),
    Boolean(record && record.exercises && record.exercises.length)
  ].filter(Boolean).length;
}

function renderRecords() {
  const record = dayRecord(selectedRecordDate, false);
  const meals = record ? record.meals : [];
  const water = record ? record.water : [];
  const exercises = record ? record.exercises : [];
  viewRoot.innerHTML = `
    <section class="card">
      <div class="date-bar">
        <div><p class="eyebrow">DAILY LOG</p><h2>${selectedRecordDate === dateKey() ? "今日记录" : "历史记录"}</h2></div>
        <input type="date" id="record-date" value="${selectedRecordDate}" max="${dateKey()}">
      </div>
      <div class="quick-grid">
        <button class="quick-button" type="button" data-action="weight"><span>↕</span><small>体重</small></button>
        <button class="quick-button" type="button" data-action="meal"><span>◒</span><small>饮食</small></button>
        <button class="quick-button" type="button" data-action="water"><span>◌</span><small>饮水</small></button>
        <button class="quick-button" type="button" data-action="sleep"><span>☾</span><small>睡眠</small></button>
        <button class="quick-button" type="button" data-action="exercise"><span>↗</span><small>运动</small></button>
      </div>
    </section>

    <section class="card">
      <div class="section-head"><div><h2>体重</h2></div><span class="pill">${record && record.weight ? Number(record.weight).toFixed(1) + " kg" : "未记录"}</span></div>
      ${record && record.weight ? '<div class="record-row"><div><strong>' + Number(record.weight).toFixed(1) + ' kg</strong><small>当日体重记录</small></div><div class="record-actions"><button class="mini-button" data-edit-record="weight">修改</button></div></div>' : '<div class="empty">还没有记录这一天的体重。</div>'}
    </section>

    <section class="card">
      <div class="section-head"><div><h2>饮食</h2></div><span class="pill">${meals.length} 餐</span></div>
      <div class="record-list">${meals.length ? meals.map(function (meal) {
        return '<div class="record-row"><div><strong>' + escapeHtml(meal.mealType) + ' · ' + mealCalories(meal) + ' kcal</strong><small>' + escapeHtml(meal.foods.map(function (food) { return food.name; }).join("、")) + '</small></div><div class="record-actions"><button class="mini-button danger" data-delete-record="meal" data-id="' + meal.id + '">删除</button></div></div>';
      }).join("") : '<div class="empty">还没有饮食记录。</div>'}</div>
    </section>

    <section class="card">
      <div class="section-head"><div><h2>饮水</h2></div><span class="pill">${water.reduce(function (sum, item) { return sum + Number(item.amount || 0); }, 0)} ml</span></div>
      <div class="record-list">${water.length ? water.map(function (item) {
        return '<div class="record-row"><div><strong>' + escapeHtml(item.type || "白水") + ' · ' + Number(item.amount) + ' ml</strong><small>' + escapeHtml(item.time || "") + '</small></div><div class="record-actions"><button class="mini-button danger" data-delete-record="water" data-id="' + item.id + '">删除</button></div></div>';
      }).join("") : '<div class="empty">还没有饮水记录。</div>'}</div>
    </section>

    <section class="card">
      <div class="section-head"><div><h2>睡眠</h2></div><span class="pill">${sleepHours(record && record.sleep) ? sleepHours(record.sleep).toFixed(1) + " 小时" : "未记录"}</span></div>
      ${record && record.sleep ? '<div class="record-row"><div><strong>' + escapeHtml(record.sleep.duration) + '</strong><small>主观感受：' + escapeHtml(record.sleep.quality) + '</small></div><div class="record-actions"><button class="mini-button" data-edit-record="sleep">修改</button></div></div>' : '<div class="empty">还没有睡眠记录。</div>'}
    </section>

    <section class="card">
      <div class="section-head"><div><h2>运动</h2></div><span class="pill">${exercises.length} 次</span></div>
      <div class="record-list">${exercises.length ? exercises.map(function (item) {
        return '<div class="record-row"><div><strong>' + escapeHtml(item.type) + ' · ' + Number(item.duration) + ' 分钟</strong><small>' + escapeHtml(item.intensity) + (item.feeling ? " · " + escapeHtml(item.feeling) : "") + '</small></div><div class="record-actions"><button class="mini-button danger" data-delete-record="exercise" data-id="' + item.id + '">删除</button></div></div>';
      }).join("") : '<div class="empty">还没有运动记录。</div>'}</div>
    </section>
  `;
  document.getElementById("record-date").addEventListener("change", function (event) {
    selectedRecordDate = event.target.value || dateKey();
    renderRecords();
  });
}

function renderTrends() {
  const user = activeUser();
  const dates = periodDates(trendDays);
  const weights = dates.map(function (date) {
    const record = dayRecord(date, false);
    return record && record.weight ? { date: date, weight: Number(record.weight) } : null;
  }).filter(Boolean);
  const firstWeight = weights.length ? weights[0].weight : null;
  const lastWeight = weights.length ? weights[weights.length - 1].weight : null;
  const change = firstWeight && lastWeight ? lastWeight - firstWeight : null;
  const averageWater = average(dates.map(function (date) {
    const record = dayRecord(date, false);
    return record ? recordWater(record) : null;
  }));
  const averageExercise = average(dates.map(function (date) {
    const record = dayRecord(date, false);
    return record ? recordExercise(record).minutes : null;
  }));
  const averageSleep = average(dates.map(function (date) {
    const record = dayRecord(date, false);
    return record ? sleepHours(record.sleep) : null;
  }));
  viewRoot.innerHTML = `
    <section class="card">
      <div class="section-head">
        <div><p class="eyebrow">PROGRESS</p><h2>体重趋势</h2></div>
        <div class="tab-row"><button class="tab-button ${trendDays === 7 ? "is-active" : ""}" data-range="7">7天</button><button class="tab-button ${trendDays === 30 ? "is-active" : ""}" data-range="30">30天</button></div>
      </div>
      ${buildWeightChart(dates, weights)}
      <div class="stat-grid" style="margin-top:14px">
        <div class="stat"><small>体重变化</small><strong>${change == null ? "--" : (change > 0 ? "+" : "") + change.toFixed(1)}</strong><small>kg</small></div>
        <div class="stat"><small>当前目标</small><strong>${Number(user.targetWeight).toFixed(1)}</strong><small>kg</small></div>
      </div>
    </section>
    <section class="card">
      <div class="section-head"><div><p class="eyebrow">HABITS</p><h2>习惯概览</h2></div></div>
      <div class="stat-grid">
        <div class="stat"><small>平均饮水</small><strong>${averageWater == null ? "--" : Math.round(averageWater)}</strong><small>ml / 天</small></div>
        <div class="stat"><small>平均运动</small><strong>${averageExercise == null ? "--" : Math.round(averageExercise)}</strong><small>分钟 / 天</small></div>
        <div class="stat"><small>平均睡眠</small><strong>${averageSleep == null ? "--" : averageSleep.toFixed(1)}</strong><small>小时 / 天</small></div>
        <div class="stat"><small>有效记录</small><strong>${dates.filter(function (date) { const record = dayRecord(date, false); return record && recordHasData(record); }).length}</strong><small>天 / ${trendDays}天</small></div>
      </div>
    </section>
    <section class="card">
      <div class="section-head"><div><h2>周期建议</h2></div></div>
      ${trendAdvice(user, { change: change, averageWater: averageWater, averageExercise: averageExercise, averageSleep: averageSleep }).map(function (item) {
        return '<article class="advice-card"><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.body) + '</p></article>';
      }).join("")}
    </section>
  `;
  viewRoot.querySelectorAll("[data-range]").forEach(function (button) {
    button.addEventListener("click", function () {
      trendDays = Number(button.dataset.range);
      renderTrends();
    });
  });
}

function renderSettings() {
  const user = activeUser();
  viewRoot.innerHTML = `
    <section class="card">
      <div class="section-head"><div><p class="eyebrow">LOCAL ACCOUNT</p><h2>${escapeHtml(user.username)}</h2><p>数据仅保存在当前浏览器</p></div><span class="pill">本地用户</span></div>
      <div class="profile-grid">
        <div><strong>${user.age}</strong><small>年龄</small></div>
        <div><strong>${Number(user.height).toFixed(0)}</strong><small>身高cm</small></div>
        <div><strong>${Number(user.currentWeight).toFixed(1)}</strong><small>当前kg</small></div>
      </div>
      <button class="primary" style="margin-top:13px" type="button" data-action="edit-profile">编辑个人资料</button>
    </section>
    <section class="card">
      <div class="section-head"><div><h2>数据与安全</h2><p>建议定期导出备份</p></div></div>
      <div class="settings-list">
        <button class="settings-button" type="button" data-action="export-json"><span><b>导出全部备份</b><small>保存所有本地用户和记录</small></span><span>›</span></button>
        <button class="settings-button" type="button" data-action="export-csv"><span><b>导出研究数据</b><small>导出当前用户的每日汇总CSV</small></span><span>›</span></button>
        <button class="settings-button" type="button" data-action="import-json"><span><b>恢复备份</b><small>从JSON文件恢复本地数据</small></span><span>›</span></button>
        <button class="settings-button" type="button" data-action="change-password"><span><b>修改密码</b><small>密码仅用于当前设备上的本地账号</small></span><span>›</span></button>
      </div>
    </section>
    <section class="card">
      <div class="info-note">轻衡提供体重与生活方式管理参考，不进行疾病诊断，也不能替代医生或营养师建议。出现明显不适、慢性病或特殊生理阶段时，应咨询专业人员。</div>
      <div class="button-stack">
        <button class="secondary" type="button" data-action="lock">锁定应用</button>
        <button class="danger-button" type="button" data-action="logout">退出当前用户</button>
      </div>
    </section>
  `;
}

function buildWeightChart(dates, weights) {
  if (weights.length < 2) {
    return '<div class="empty">至少记录2次体重后显示趋势曲线。</div>';
  }
  const width = 360;
  const height = 180;
  const pad = 24;
  const values = weights.map(function (item) { return item.weight; });
  const min = Math.min.apply(null, values) - .5;
  const max = Math.max.apply(null, values) + .5;
  const range = Math.max(.5, max - min);
  const points = weights.map(function (item, index) {
    const x = pad + (width - pad * 2) * index / Math.max(1, weights.length - 1);
    const y = pad + (height - pad * 2) * (max - item.weight) / range;
    return { x: x, y: y, date: item.date, weight: item.weight };
  });
  const line = points.map(function (point, index) {
    return (index ? "L" : "M") + point.x.toFixed(1) + " " + point.y.toFixed(1);
  }).join(" ");
  const area = line + " L" + points[points.length - 1].x.toFixed(1) + " " + (height - pad) + " L" + points[0].x.toFixed(1) + " " + (height - pad) + " Z";
  return '<div class="chart-wrap"><svg class="chart" viewBox="0 0 360 180" role="img" aria-label="体重趋势图"><defs><linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2e806b" stop-opacity=".22"></stop><stop offset="1" stop-color="#2e806b" stop-opacity="0"></stop></linearGradient></defs><path class="chart-area" d="' + area + '"></path><path class="chart-line" d="' + line + '"></path>' + points.map(function (point, index) {
    return '<circle class="chart-dot" cx="' + point.x.toFixed(1) + '" cy="' + point.y.toFixed(1) + '" r="4"><title>' + point.date + " " + point.weight.toFixed(1) + 'kg</title></circle>' + (index === 0 || index === points.length - 1 || weights.length <= 7 ? '<text class="chart-label" x="' + point.x.toFixed(1) + '" y="' + Math.min(height - 7, point.y + 17).toFixed(1) + '" text-anchor="middle">' + shortDate(point.date) + '</text>' : "");
  }).join("") + "</svg></div>";
}

function dailyInsights(user, record, target) {
  const result = [];
  const water = recordWater(record);
  const calories = recordCalories(record);
  const sleep = sleepHours(record.sleep);
  const exercise = recordExercise(record);
  if (!record.weight) result.push({ title: "先记录今天体重", body: "体重受水分和作息影响，建议在相近时间、相近状态下测量，并更多观察7天平均值。" });
  if (water < 1200) result.push({ title: "补水分段完成", body: "今天饮水还偏少，可以接下来每小时补充200—300毫升，晚餐前达到目标的70%。" });
  if (sleep && sleep < 7) result.push({ title: "今晚优先把睡眠补足", body: "当前记录睡眠为" + sleep.toFixed(1) + "小时。睡眠不足会影响食欲和恢复，先尝试提前20—30分钟入睡。" });
  if (target.complete && calories > target.upper) result.push({ title: "今天摄入高于建议范围", body: "不需要通过极端节食补偿，下一餐优先选择蔬菜和优质蛋白，并恢复日常节奏。" });
  if (!exercise.minutes) result.push({ title: "安排一段轻量活动", body: "今天还没有运动记录，可以安排20—30分钟快走，或用短时力量训练替代长时间高强度运动。" });
  if (!result.length) result.push({ title: "今天的基础节奏不错", body: "继续保持规律记录，不需要频繁大幅调整计划。观察7天平均体重、腰围和精力变化更可靠。" });
  return result.slice(0, 3);
}

function trendAdvice(user, values) {
  const result = [];
  if (values.change != null && values.change > .5) result.push({ title: "体重出现回升", body: "短期波动常与盐分、水分和排便有关。先观察7天平均值，不建议因单次数据大幅减少饮食。" });
  if (values.change != null && values.change < -1.5) result.push({ title: "近期下降速度偏快", body: "如果这是短期变化，先排除水分波动；若连续两周都过快，应考虑提高摄入或降低运动量。" });
  if (values.averageWater != null && values.averageWater < 1400) result.push({ title: "饮水连续性需要提升", body: "把饮水拆成起床后、午餐前和下午三个固定时点，比睡前一次补足更容易坚持。" });
  if (values.averageSleep != null && values.averageSleep < 7) result.push({ title: "睡眠是近期优先项", body: "睡眠不足会放大饥饿感和体重波动。先稳定入睡时间，再考虑进一步调整热量。" });
  if (values.averageExercise != null && values.averageExercise < 20) result.push({ title: "先提高运动频率", body: "每周累计达到150分钟中等强度活动是实用起点，不必一开始追求很高强度。" });
  if (!result.length) result.push({ title: "保持当前节奏", body: "当前记录量已足够观察趋势。接下来重点是连续记录、稳定饮食结构和规律作息。" });
  return result.slice(0, 3);
}

function handleGlobalClick(event) {
  const nav = event.target.closest("[data-view]");
  if (nav) {
    currentView = nav.dataset.view;
    renderCurrentView();
    return;
  }
  const action = event.target.closest("[data-action]");
  if (action) {
    const type = action.dataset.action;
    if (type === "weight") openWeightModal();
    if (type === "meal") openMealModal();
    if (type === "water") openWaterModal();
    if (type === "sleep") openSleepModal();
    if (type === "exercise") openExerciseModal();
    if (type === "edit-profile") openProfileModal();
    if (type === "export-json") exportJson();
    if (type === "export-csv") exportCsv();
    if (type === "import-json") openImportPicker();
    if (type === "change-password") openPasswordModal();
    if (type === "lock") lockApp();
    if (type === "logout") logout();
    return;
  }
  const edit = event.target.closest("[data-edit-record]");
  if (edit) {
    if (edit.dataset.editRecord === "weight") openWeightModal();
    if (edit.dataset.editRecord === "sleep") openSleepModal();
    return;
  }
  const remove = event.target.closest("[data-delete-record]");
  if (remove) {
    deleteRecord(remove.dataset.deleteRecord, remove.dataset.id);
  }
}

document.getElementById("user-menu").addEventListener("click", function () {
  currentView = "settings";
  renderCurrentView();
});

function openModal(title, kicker, content) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-kicker").textContent = kicker;
  modalBody.innerHTML = content;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

function openWeightModal() {
  const record = dayRecord(selectedRecordDate, true);
  openModal("记录体重", "WEIGHT CHECK-IN", `
    <form id="weight-form">
      <div class="form-grid">
        <div class="field full"><label>日期</label><input type="date" id="weight-date" value="${selectedRecordDate}" max="${dateKey()}"></div>
        <div class="field full"><label>体重（kg）</label><input id="weight-value" inputmode="decimal" value="${record.weight || ""}" placeholder="例如65.0"></div>
      </div>
      <p class="text-error" id="weight-error"></p>
      <button class="primary" type="submit">保存体重</button>
    </form>
  `);
  document.getElementById("weight-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const date = document.getElementById("weight-date").value || dateKey();
    const value = Number(document.getElementById("weight-value").value);
    if (!value || value < 25 || value > 300) {
      document.getElementById("weight-error").textContent = "请输入25—300公斤之间的合理体重";
      return;
    }
    const target = dayRecordForUser(activeUser().id, date, true);
    target.weight = value;
    selectedRecordDate = date;
    if (date === dateKey()) activeUser().currentWeight = value;
    saveState();
    closeModal();
    renderCurrentView();
    showToast("体重已保存");
  });
}

function openWaterModal() {
  const record = dayRecord(selectedRecordDate, true);
  let selectedType = "白水";
  let selectedAmount = 300;
  openModal("记录饮水", "HYDRATION", `
    <div class="choice-grid">${["白水", "无糖茶", "黑咖啡", "牛奶", "无糖饮料", "其他"].map(function (name, index) {
      return '<button class="choice-button ' + (index === 0 ? "is-active" : "") + '" type="button" data-water-type="' + name + '">' + name + '</button>';
    }).join("")}</div>
    <div class="choice-grid">${[200, 300, 500].map(function (amount, index) {
      return '<button class="choice-button ' + (index === 1 ? "is-active" : "") + '" type="button" data-water-amount="' + amount + '">' + amount + ' ml</button>';
    }).join("")}</div>
    <div class="field"><label>自定义容量（ml）</label><input id="water-amount" inputmode="numeric" value="300"></div>
    <button class="primary" type="button" id="save-water">保存饮水</button>
  `);
  modalBody.querySelectorAll("[data-water-type]").forEach(function (button) {
    button.addEventListener("click", function () {
      selectedType = button.dataset.waterType;
      modalBody.querySelectorAll("[data-water-type]").forEach(function (item) { item.classList.remove("is-active"); });
      button.classList.add("is-active");
    });
  });
  modalBody.querySelectorAll("[data-water-amount]").forEach(function (button) {
    button.addEventListener("click", function () {
      selectedAmount = Number(button.dataset.waterAmount);
      document.getElementById("water-amount").value = selectedAmount;
      modalBody.querySelectorAll("[data-water-amount]").forEach(function (item) { item.classList.remove("is-active"); });
      button.classList.add("is-active");
    });
  });
  document.getElementById("save-water").addEventListener("click", function () {
    const amount = Number(document.getElementById("water-amount").value);
    if (!amount || amount < 50 || amount > 3000) {
      showToast("请输入50—3000毫升");
      return;
    }
    record.water.push({ id: "water-" + Date.now(), type: selectedType, amount: amount, time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) });
    saveState();
    closeModal();
    renderCurrentView();
    showToast("饮水已记录");
  });
}

function openSleepModal() {
  const record = dayRecord(selectedRecordDate, true);
  const current = record.sleep || { start: "23:20", end: "07:00", quality: "一般" };
  openModal("记录睡眠", "SLEEP CHECK-IN", `
    <div class="form-grid">
      <div class="field"><label>入睡时间</label><input type="time" id="sleep-start" value="${current.start}"></div>
      <div class="field"><label>起床时间</label><input type="time" id="sleep-end" value="${current.end}"></div>
      <div class="field full"><label>主观感受</label><select id="sleep-quality"><option ${current.quality === "好" ? "selected" : ""}>好</option><option ${current.quality === "一般" ? "selected" : ""}>一般</option><option ${current.quality === "差" ? "selected" : ""}>差</option></select></div>
    </div>
    <button class="primary" type="button" id="save-sleep">保存睡眠</button>
  `);
  document.getElementById("save-sleep").addEventListener("click", function () {
    const start = document.getElementById("sleep-start").value;
    const end = document.getElementById("sleep-end").value;
    if (!start || !end) {
      showToast("请填写入睡和起床时间");
      return;
    }
    record.sleep = {
      start: start,
      end: end,
      quality: document.getElementById("sleep-quality").value,
      duration: formatSleep(start, end)
    };
    saveState();
    closeModal();
    renderCurrentView();
    showToast("睡眠已记录");
  });
}

function openExerciseModal() {
  const record = dayRecord(selectedRecordDate, true);
  openModal("记录运动", "MOVEMENT", `
    <div class="form-grid">
      <div class="field full"><label>运动类型</label><select id="exercise-type"><option>快走</option><option>跑步</option><option>骑行</option><option>力量训练</option><option>游泳</option><option>瑜伽</option><option>球类</option><option>其他</option></select></div>
      <div class="field"><label>时长（分钟）</label><input id="exercise-duration" inputmode="numeric" value="30"></div>
      <div class="field"><label>强度</label><select id="exercise-intensity"><option>轻度</option><option selected>中等</option><option>高强度</option></select></div>
      <div class="field"><label>距离（km，可选）</label><input id="exercise-distance" inputmode="decimal" placeholder="例如3.5"></div>
      <div class="field"><label>身体感受</label><select id="exercise-feeling"><option>轻松</option><option selected>刚好</option><option>吃力</option></select></div>
    </div>
    <div class="info-note">运动记录用于观察习惯和恢复，不自动把消耗换算成额外可吃热量。</div>
    <div class="button-stack"><button class="primary" type="button" id="save-exercise">保存运动</button></div>
  `);
  document.getElementById("save-exercise").addEventListener("click", function () {
    const duration = Number(document.getElementById("exercise-duration").value);
    const distance = document.getElementById("exercise-distance").value.trim();
    if (!duration || duration < 5 || duration > 600) {
      showToast("运动时长请输入5—600分钟");
      return;
    }
    record.exercises.push({
      id: "exercise-" + Date.now(),
      type: document.getElementById("exercise-type").value,
      duration: duration,
      intensity: document.getElementById("exercise-intensity").value,
      distance: distance,
      feeling: document.getElementById("exercise-feeling").value
    });
    saveState();
    closeModal();
    renderCurrentView();
    showToast("运动已记录");
  });
}

function openMealModal() {
  const record = dayRecord(selectedRecordDate, true);
  let selectedFoods = [];
  let selectedMealType = "午餐";
  openModal("记录饮食", "MEAL & SMART SWAP", `
    <div class="swap-panel">
      <p class="eyebrow">SMART FOOD SWAP</p>
      <h3>想吃，但想更健康？</h3>
      <p style="margin:7px 0 0;color:#657069;font-size:10px;line-height:1.6">输入想吃的食物，帮你保留口感并调整烹饪方式。</p>
      <div class="swap-search"><input id="swap-input" maxlength="24" placeholder="例如炸鸡、汉堡、奶茶"><button type="button" id="swap-search-button">推荐</button></div>
      <div class="swap-chips">${["炸鸡", "汉堡", "奶茶", "火锅", "烧烤", "薯条"].map(function (item) {
        return '<button class="swap-chip" type="button" data-swap-chip="' + item + '">' + item + "</button>";
      }).join("")}</div>
      <div id="swap-results"></div>
    </div>
    <div class="choice-grid">${["早餐", "午餐", "晚餐", "加餐"].map(function (name) {
      return '<button class="choice-button ' + (name === selectedMealType ? "is-active" : "") + '" type="button" data-meal-type="' + name + '">' + name + '</button>';
    }).join("")}</div>
    <div class="section-head"><div><h3>常见食物</h3><p>点击添加一份</p></div></div>
    <div class="food-grid">${FOODS.map(function (food) {
      return '<button class="food-button" type="button" data-food-id="' + food.id + '"><b>' + food.name + '</b><small>' + food.unit + " · " + foodCalories(food) + " kcal</small></button>";
    }).join("")}</div>
    <div class="section-head" style="margin-top:16px"><div><h3>自定义食物</h3><p>有包装标签时填写四项营养值</p></div></div>
    <div class="field"><label>食物名称</label><input id="custom-food-name" maxlength="24" placeholder="例如番茄牛肉盖饭"></div>
    <div class="form-grid">
      <div class="field"><label>热量 kcal</label><input id="custom-calories" inputmode="decimal" placeholder="可选"></div>
      <div class="field"><label>碳水 g</label><input id="custom-carbs" inputmode="decimal" placeholder="可选"></div>
      <div class="field"><label>蛋白质 g</label><input id="custom-protein" inputmode="decimal" placeholder="可选"></div>
      <div class="field"><label>脂肪 g</label><input id="custom-fat" inputmode="decimal" placeholder="可选"></div>
    </div>
    <button class="secondary" type="button" id="add-custom-food">添加自定义食物</button>
    <div class="section-head" style="margin-top:18px"><div><h3>本餐已选</h3></div></div>
    <div class="selected-foods" id="selected-foods"></div>
    <div class="button-stack"><button class="primary" type="button" id="save-meal">保存本餐</button></div>
  `);

  function renderSelectedFoods() {
    const container = document.getElementById("selected-foods");
    container.innerHTML = selectedFoods.length ? selectedFoods.map(function (food, index) {
      return '<div class="selected-food"><span><b>' + escapeHtml(food.name) + '</b><small>' + escapeHtml(food.unit || "1份") + " · " + escapeHtml(food.source || "参考值") + '</small></span><strong>' + foodCalories(food) + ' kcal</strong><button class="remove-entry" type="button" data-remove-food="' + index + '">×</button></div>';
    }).join("") : '<div class="empty">还没有选择食物。</div>';
    container.querySelectorAll("[data-remove-food]").forEach(function (button) {
      button.addEventListener("click", function () {
        selectedFoods.splice(Number(button.dataset.removeFood), 1);
        renderSelectedFoods();
      });
    });
  }

  function renderSwapResults(craving) {
    const results = recommendSwaps(craving);
    document.getElementById("swap-results").innerHTML = '<p style="margin:11px 0 0;color:#657069;font-size:9px">匹配口味：<b>' + escapeHtml(results.label) + '</b></p>' + results.options.map(function (option, index) {
      const food = swapToFood(option, results.label + "智能替代" + index);
      return '<article class="swap-result"><h4>' + escapeHtml(option.name) + '</h4><p><b>口感保留：</b>' + escapeHtml(option.taste) + '</p><p><b>建议搭配：</b>' + escapeHtml(option.ingredients) + '</p><div class="swap-meta"><span>碳水 ' + option.carbs + 'g</span><span>蛋白质 ' + option.protein + 'g</span><span>脂肪 ' + option.fat + 'g</span><span>' + foodCalories(food) + ' kcal</span></div><button class="swap-add" type="button" data-add-swap="' + index + '">＋ 加入本餐</button></article>';
    }).join("");
    document.querySelectorAll("[data-add-swap]").forEach(function (button) {
      button.addEventListener("click", function () {
        const option = results.options[Number(button.dataset.addSwap)];
        selectedFoods.push(swapToFood(option, results.label + "智能替代" + Date.now()));
        renderSelectedFoods();
        showToast("已加入：" + option.name);
      });
    });
  }

  modalBody.querySelectorAll("[data-meal-type]").forEach(function (button) {
    button.addEventListener("click", function () {
      selectedMealType = button.dataset.mealType;
      modalBody.querySelectorAll("[data-meal-type]").forEach(function (item) { item.classList.remove("is-active"); });
      button.classList.add("is-active");
    });
  });

  modalBody.querySelectorAll("[data-food-id]").forEach(function (button) {
    button.addEventListener("click", function () {
      const base = FOODS.find(function (food) { return food.id === button.dataset.foodId; });
      selectedFoods.push(Object.assign({}, base, { entryId: "food-" + Date.now() + "-" + Math.random().toString(16).slice(2) }));
      renderSelectedFoods();
    });
  });

  document.getElementById("add-custom-food").addEventListener("click", function () {
    const name = document.getElementById("custom-food-name").value.trim();
    if (!name) {
      showToast("请输入食物名称");
      return;
    }
    const rawInputs = ["custom-calories", "custom-carbs", "custom-protein", "custom-fat"].map(function (id) {
      return document.getElementById(id).value.trim();
    });
    const filled = rawInputs.filter(Boolean).length;
    if (filled > 0 && filled < 4) {
      showToast("四项营养值需要同时填写");
      return;
    }
    const values = rawInputs.map(Number);
    if (filled === 4 && values.some(function (value) { return !Number.isFinite(value) || value < 0; })) {
      showToast("营养值需要填写正确数字");
      return;
    }
    const food = filled === 4 ? {
      name: name,
      unit: "1份",
      calories: values[0],
      carbs: values[1],
      protein: values[2],
      fat: values[3],
      source: "用户输入包装标签",
      confidence: "高",
      entryId: "food-" + Date.now()
    } : estimateCustomFood(name);
    selectedFoods.push(food);
    document.getElementById("custom-food-name").value = "";
    rawInputs.forEach(function (_, index) {
      document.getElementById(["custom-calories", "custom-carbs", "custom-protein", "custom-fat"][index]).value = "";
    });
    renderSelectedFoods();
  });

  const search = function () {
    const craving = document.getElementById("swap-input").value.trim();
    if (!craving) {
      showToast("先输入想吃的食物");
      document.getElementById("swap-input").focus();
      return;
    }
    renderSwapResults(craving);
  };
  document.getElementById("swap-search-button").addEventListener("click", search);
  document.getElementById("swap-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      search();
    }
  });
  modalBody.querySelectorAll("[data-swap-chip]").forEach(function (button) {
    button.addEventListener("click", function () {
      document.getElementById("swap-input").value = button.dataset.swapChip;
      search();
    });
  });

  document.getElementById("save-meal").addEventListener("click", function () {
    if (!selectedFoods.length) {
      showToast("请至少添加一种食物");
      return;
    }
    record.meals.push({
      id: "meal-" + Date.now(),
      mealType: selectedMealType,
      foods: selectedFoods.map(function (food) {
        return Object.assign({}, food);
      }),
      totalCalories: selectedFoods.reduce(function (sum, food) { return sum + foodCalories(food); }, 0),
      createdAt: new Date().toISOString()
    });
    saveState();
    closeModal();
    renderCurrentView();
    showToast(selectedMealType + "已保存");
  });

  renderSelectedFoods();
}

function recommendSwaps(craving) {
  const normalized = String(craving || "").trim().toLowerCase();
  const found = HEALTHY_SWAPS.find(function (group) {
    return group.keywords.some(function (keyword) {
      return normalized.indexOf(keyword.toLowerCase()) >= 0;
    });
  });
  return found || {
    label: "均衡口味替代",
    options: [
      {
        name: "香煎鸡胸谷物蔬菜碗",
        taste: "保留煎烤香气和大口吃肉口感，用谷物、蔬菜和酸奶辣酱增加层次。",
        ingredients: "鸡胸、糙米、鸡蛋、绿叶菜、番茄、酸奶辣酱",
        carbs: 42, protein: 35, fat: 12
      },
      {
        name: "番茄牛肉豆腐杂粮饭",
        taste: "番茄酸甜和牛肉鲜味突出，豆腐增加嫩滑口感。",
        ingredients: "瘦牛肉、豆腐、番茄、杂粮饭、青菜",
        carbs: 48, protein: 32, fat: 14
      }
    ]
  };
}

function swapToFood(option, id) {
  return {
    entryId: "swap-" + Date.now() + "-" + Math.random().toString(16).slice(2),
    swapId: id,
    name: option.name,
    unit: "1份",
    carbs: option.carbs,
    protein: option.protein,
    fat: option.fat,
    calories: Math.round(option.carbs * 4 + option.protein * 4 + option.fat * 9),
    source: "智能替代规则估算",
    confidence: "中"
  };
}

function estimateCustomFood(name) {
  const normalized = name.toLowerCase();
  let macros = [30, 10, 10];
  if (["饭", "面", "粉", "粥", "饼", "包子", "玉米", "土豆"].some(function (word) { return normalized.indexOf(word) >= 0; })) macros = [48, 8, 5];
  if (["鸡", "鸭", "鱼", "虾", "牛", "猪", "肉", "蛋"].some(function (word) { return normalized.indexOf(word) >= 0; })) macros = [4, 24, 10];
  if (["菜", "瓜", "菇", "笋", "番茄"].some(function (word) { return normalized.indexOf(word) >= 0; })) macros = [10, 3, 2];
  return {
    entryId: "food-" + Date.now(),
    name: name,
    unit: "1份",
    carbs: macros[0],
    protein: macros[1],
    fat: macros[2],
    calories: Math.round(macros[0] * 4 + macros[1] * 4 + macros[2] * 9),
    source: "按名称粗略估算",
    confidence: "低"
  };
}

function openProfileModal() {
  const user = activeUser();
  openModal("编辑个人资料", "PROFILE", `
    <form id="profile-form">
      <div class="form-grid">
        <div class="field full"><label>用户名</label><input id="profile-username" maxlength="16" value="${escapeHtml(user.username)}"></div>
        <div class="field"><label>生理性别</label><select id="profile-sex"><option value="female" ${user.sex === "female" ? "selected" : ""}>女</option><option value="male" ${user.sex === "male" ? "selected" : ""}>男</option></select></div>
        <div class="field"><label>年龄</label><input id="profile-age" inputmode="numeric" value="${user.age}"></div>
        <div class="field"><label>身高（cm）</label><input id="profile-height" inputmode="decimal" value="${user.height}"></div>
        <div class="field"><label>活动水平</label><select id="profile-activity">${activityOptions(user.activity)}</select></div>
        <div class="field"><label>当前体重（kg）</label><input id="profile-current" inputmode="decimal" value="${user.currentWeight}"></div>
        <div class="field"><label>目标体重（kg）</label><input id="profile-target" inputmode="decimal" value="${user.targetWeight}"></div>
        <div class="field full"><label>计划周期（周）</label><input id="profile-weeks" inputmode="numeric" value="${user.planWeeks}"></div>
      </div>
      <p class="text-error" id="profile-error"></p>
      <button class="primary" type="submit">保存资料</button>
    </form>
  `);
  document.getElementById("profile-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("profile-username").value.trim();
    const age = Number(document.getElementById("profile-age").value);
    const height = Number(document.getElementById("profile-height").value);
    const currentWeight = Number(document.getElementById("profile-current").value);
    const targetWeight = Number(document.getElementById("profile-target").value);
    const planWeeks = Number(document.getElementById("profile-weeks").value);
    const validation = validateProfileValues(username, age, height, currentWeight, targetWeight, planWeeks);
    if (validation) {
      document.getElementById("profile-error").textContent = validation;
      return;
    }
    const duplicate = state.users.some(function (item) {
      return item.id !== user.id && usernameKey(item.username) === usernameKey(username);
    });
    if (duplicate) {
      document.getElementById("profile-error").textContent = "这个用户名已经存在";
      return;
    }
    user.username = username;
    user.sex = document.getElementById("profile-sex").value;
    user.age = age;
    user.height = height;
    user.activity = Number(document.getElementById("profile-activity").value);
    user.currentWeight = currentWeight;
    user.targetWeight = targetWeight;
    user.planWeeks = planWeeks;
    const today = dayRecord(dateKey(), true);
    today.weight = currentWeight;
    saveState();
    updateHeader();
    closeModal();
    renderCurrentView();
    showToast("个人资料已更新");
  });
}

function openPasswordModal() {
  openModal("修改密码", "LOCAL SECURITY", `
    <form id="password-form">
      <div class="field"><label>当前密码</label><input id="current-password" type="password" autocomplete="current-password"></div>
      <div class="field"><label>新密码</label><input id="new-password" type="password" autocomplete="new-password"></div>
      <div class="field"><label>再次输入新密码</label><input id="confirm-password" type="password" autocomplete="new-password"></div>
      <p class="text-error" id="password-error"></p>
      <button class="primary" type="submit">保存新密码</button>
    </form>
  `);
  document.getElementById("password-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const user = activeUser();
    const current = document.getElementById("current-password").value;
    const next = document.getElementById("new-password").value;
    const confirm = document.getElementById("confirm-password").value;
    const error = document.getElementById("password-error");
    if (next.length < 6) {
      error.textContent = "新密码至少需要6位";
      return;
    }
    if (next !== confirm) {
      error.textContent = "两次输入的新密码不一致";
      return;
    }
    if (await hashPassword(current, user.salt) !== user.passwordHash) {
      error.textContent = "当前密码不正确";
      return;
    }
    user.salt = randomHex(16);
    user.passwordHash = await hashPassword(next, user.salt);
    saveState();
    closeModal();
    showToast("密码已更新");
  });
}

function deleteRecord(type, id) {
  const record = dayRecord(selectedRecordDate, false);
  if (!record) return;
  if (type === "meal") record.meals = record.meals.filter(function (item) { return item.id !== id; });
  if (type === "water") record.water = record.water.filter(function (item) { return item.id !== id; });
  if (type === "exercise") record.exercises = record.exercises.filter(function (item) { return item.id !== id; });
  saveState();
  renderCurrentView();
  showToast("记录已删除");
}

function dayRecord(date, create) {
  const user = activeUser();
  if (!user) return null;
  return dayRecordForUser(user.id, date, create);
}

function recordHasData(record) {
  return Boolean(record && (record.weight || (record.meals && record.meals.length) || (record.water && record.water.length) || record.sleep || (record.exercises && record.exercises.length)));
}

function recordCalories(record) {
  return record && record.meals ? record.meals.reduce(function (sum, meal) { return sum + mealCalories(meal); }, 0) : 0;
}

function mealCalories(meal) {
  if (!meal || !Array.isArray(meal.foods)) return 0;
  return meal.foods.reduce(function (sum, food) { return sum + foodCalories(food); }, 0);
}

function foodCalories(food) {
  if (!food) return 0;
  return Math.round(Number(food.calories) || Number(food.carbs || 0) * 4 + Number(food.protein || 0) * 4 + Number(food.fat || 0) * 9);
}

function recordWater(record) {
  return record && record.water ? record.water.reduce(function (sum, item) { return sum + Number(item.amount || 0); }, 0) : 0;
}

function recordExercise(record) {
  const exercises = record && record.exercises ? record.exercises : [];
  return {
    count: exercises.length,
    minutes: exercises.reduce(function (sum, item) { return sum + Number(item.duration || 0); }, 0)
  };
}

function sleepHours(sleep) {
  if (!sleep || !sleep.start || !sleep.end) return 0;
  const start = sleep.start.split(":").map(Number);
  const end = sleep.end.split(":").map(Number);
  let minutes = end[0] * 60 + end[1] - (start[0] * 60 + start[1]);
  if (minutes <= 0) minutes += 24 * 60;
  return minutes / 60;
}

function formatSleep(start, end) {
  const hours = sleepHours({ start: start, end: end });
  return Math.floor(hours) + "小时" + Math.round((hours % 1) * 60) + "分";
}

function caloriePlan(user, record) {
  const complete = Boolean(user.sex && user.age && user.height && user.activity);
  if (!complete) return { complete: false };
  const weight = Number(record.weight || user.currentWeight);
  const adjustment = user.sex === "male" ? 5 : -161;
  const bmr = 10 * weight + 6.25 * Number(user.height) - 5 * Number(user.age) + adjustment;
  const maintenance = bmr * Number(user.activity);
  const elapsedDays = Math.max(0, Math.floor((Date.now() - dateFromKey(user.startedAt).getTime()) / DAY_MS));
  const elapsedWeeks = Math.floor(elapsedDays / 7);
  const remainingWeeks = Math.max(1, Number(user.planWeeks) - elapsedWeeks);
  const remainingWeight = Math.max(0, weight - Number(user.targetWeight));
  const weeklyTarget = remainingWeight / remainingWeeks;
  const deficit = Math.min(weeklyTarget * 7700 / 7, maintenance * .2);
  const center = Math.round(Math.max(bmr, maintenance - deficit) / 50) * 50;
  return {
    complete: true,
    bmr: Math.round(bmr),
    maintenance: Math.round(maintenance),
    center: center,
    lower: Math.max(Math.round(bmr / 50) * 50, center - 100),
    upper: center + 100
  };
}

function periodDates(days) {
  return Array.from({ length: days }, function (_, index) {
    return shiftDate(dateKey(), index - days + 1);
  });
}

function average(values) {
  const usable = values.filter(function (value) { return Number.isFinite(value) && value >= 0; });
  return usable.length ? usable.reduce(function (sum, value) { return sum + value; }, 0) / usable.length : null;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function exportJson() {
  downloadFile("qingheng-backup-" + dateKey() + ".json", JSON.stringify(state, null, 2), "application/json");
  showToast("全部备份已导出");
}

function exportCsv() {
  const user = activeUser();
  const rows = [["date", "username", "weight_kg", "calories_kcal", "protein_g", "carbs_g", "fat_g", "water_ml", "sleep_hours", "exercise_minutes"]];
  const store = userStore(user.id);
  Object.keys(store.days).sort().forEach(function (date) {
    const record = store.days[date];
    const macros = recordMacros(record);
    rows.push([
      date,
      user.username,
      record.weight || "",
      recordCalories(record),
      Math.round(macros.protein),
      Math.round(macros.carbs),
      Math.round(macros.fat),
      recordWater(record),
      sleepHours(record.sleep) ? sleepHours(record.sleep).toFixed(1) : "",
      recordExercise(record).minutes
    ]);
  });
  const csv = "\ufeff" + rows.map(function (row) {
    return row.map(function (cell) {
      return '"' + String(cell == null ? "" : cell).replace(/"/g, '""') + '"';
    }).join(",");
  }).join("\n");
  downloadFile("qingheng-research-" + dateKey() + ".csv", csv, "text/csv;charset=utf-8");
  showToast("研究数据已导出");
}

function recordMacros(record) {
  const foods = record && record.meals ? record.meals.flatMap(function (meal) { return meal.foods || []; }) : [];
  return foods.reduce(function (sum, food) {
    sum.carbs += Number(food.carbs || 0);
    sum.protein += Number(food.protein || 0);
    sum.fat += Number(food.fat || 0);
    return sum;
  }, { carbs: 0, protein: 0, fat: 0 });
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type: type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

function openImportPicker() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json,.json";
  input.addEventListener("change", function () {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const imported = JSON.parse(reader.result);
        if (!imported || !Array.isArray(imported.users) || !imported.entries) throw new Error("invalid");
        if (!confirm("恢复备份会替换当前浏览器中的全部用户和记录，是否继续？")) return;
        state = Object.assign(defaultState(), imported);
        saveState();
        sessionUserId = null;
        renderAuth("login");
        showToast("备份已恢复");
      } catch (error) {
        showToast("备份格式不正确");
      }
    };
    reader.readAsText(file);
  });
  input.click();
}

function logout() {
  sessionUserId = null;
  renderAuth("login");
  showToast("已退出当前用户");
}
