const storageKey = "smart-fortune-faith-demo-v1";

const currency = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0
});

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  month: "2-digit",
  day: "2-digit",
  weekday: "short"
});

const lightPrices = {
  "光明燈": 600,
  "文昌燈": 800,
  "財利燈": 1000,
  "藥師平安燈": 900
};

const ceremonyPrices = {
  "月例平安法會": 1200,
  "中元普度": 1800,
  "謝土酬神": 2600,
  "不參加法會": 0
};

const ritualSteps = [
  "於入口掃描會員卡，確認祈願人與農曆生日",
  "至主殿點香，向主神稟告姓名、地址與祈願",
  "依序參拜陪祀神明，系統記錄完成狀態",
  "抽取籤詩或選擇法會迴向，列印服務憑條",
  "櫃台確認功德金與後續通知方式"
];

const fortunes = [
  {
    title: "中吉｜雲開月明",
    body: "先穩住眼前步伐，再談遠行。適合安排平安祈福與家人共同參拜。",
    action: "建議櫃台提醒信眾於七日內完成還願紀錄。"
  },
  {
    title: "上吉｜春木逢雨",
    body: "所求有轉機，但需循序而行。適合文昌祈福、考試祝禱與燈位登記。",
    action: "可推薦文昌燈與考前祝禱簡訊。"
  },
  {
    title: "小吉｜舟行順水",
    body: "合作與出行皆宜，凡事以和為貴。適合事業祈福與公司行號開運。",
    action: "建議建立團體預約，安排平日時段分流。"
  },
  {
    title: "平安｜守正待時",
    body: "目前宜守不宜躁，將雜事整理清楚，自能迎來清明。",
    action: "可引導信眾完成祭祀流程並保留代辦提醒。"
  }
];

const defaultState = {
  activeMemberId: "m1",
  ritualDone: [],
  lastFortune: null,
  reservations: [
    {
      id: "r1",
      person: "王雅婷",
      service: "安太歲登記",
      date: todayOffset(0),
      time: "10:30-11:30",
      note: "全家四位，需核對生肖與農曆生日。",
      status: "待確認"
    },
    {
      id: "r2",
      person: "吳建宏",
      service: "公司行號開運",
      date: todayOffset(1),
      time: "14:00-15:00",
      note: "需開立收據，抬頭已於會員備註。",
      status: "已排程"
    },
    {
      id: "r3",
      person: "陳惠如",
      service: "考試祈福",
      date: todayOffset(2),
      time: "19:00-20:00",
      note: "高三考生，搭配文昌燈提醒。",
      status: "待確認"
    }
  ],
  orders: [
    {
      id: "o1",
      name: "黃信安",
      light: "財利燈",
      ceremony: "月例平安法會",
      quantity: 1,
      total: 2200,
      status: "待收款"
    },
    {
      id: "o2",
      name: "林佩珊",
      light: "文昌燈",
      ceremony: "不參加法會",
      quantity: 2,
      total: 1600,
      status: "待點燈"
    }
  ],
  members: [
    {
      id: "m1",
      name: "林佩珊",
      level: "蓮燈會員",
      wish: "考試順利",
      points: 1280,
      visits: 8,
      lastService: "文昌燈登記",
      contact: "LINE 已綁定"
    },
    {
      id: "m2",
      name: "陳柏宇",
      level: "福田會員",
      wish: "事業順遂",
      points: 2460,
      visits: 14,
      lastService: "謝土酬神",
      contact: "簡訊通知"
    },
    {
      id: "m3",
      name: "王雅婷",
      level: "平安會員",
      wish: "闔家平安",
      points: 720,
      visits: 5,
      lastService: "安太歲登記",
      contact: "Email 收據"
    }
  ],
  ledger: [
    {
      id: "l1",
      type: "income",
      category: "點燈",
      amount: 5200,
      memo: "線上光明燈",
      date: todayOffset(0)
    },
    {
      id: "l2",
      type: "income",
      category: "法會",
      amount: 8800,
      memo: "月例法會功德金",
      date: todayOffset(0)
    },
    {
      id: "l3",
      type: "expense",
      category: "修繕採購",
      amount: 2600,
      memo: "香案燈具維護",
      date: todayOffset(-1)
    },
    {
      id: "l4",
      type: "expense",
      category: "公益捐助",
      amount: 1800,
      memo: "社區物資箱",
      date: todayOffset(-2)
    }
  ],
  tasks: [
    {
      id: "t1",
      title: "確認週末法會供品數量",
      owner: "法會組",
      done: false
    },
    {
      id: "t2",
      title: "寄出三筆線上收據",
      owner: "財務",
      done: false
    },
    {
      id: "t3",
      title: "補登志工排班表",
      owner: "志工",
      done: true
    }
  ],
  notices: [
    {
      title: "新線上訂單",
      body: "財利燈訂單等待櫃台確認付款狀態。"
    },
    {
      title: "法會提醒",
      body: "明日 14:00 有公司行號開運預約。"
    },
    {
      title: "會員關懷",
      body: "三位考生會員本週適合發送文昌祈福提醒。"
    }
  ]
};

let state = loadState();

const elements = {
  todayLabel: document.querySelector("#todayLabel"),
  metricBookings: document.querySelector("#metricBookings"),
  metricOrders: document.querySelector("#metricOrders"),
  metricBalance: document.querySelector("#metricBalance"),
  metricTasks: document.querySelector("#metricTasks"),
  bookingForm: document.querySelector("#bookingForm"),
  bookingList: document.querySelector("#bookingList"),
  orderForm: document.querySelector("#orderForm"),
  orderEstimate: document.querySelector("#orderEstimate"),
  orderList: document.querySelector("#orderList"),
  activeMember: document.querySelector("#activeMember"),
  memberForm: document.querySelector("#memberForm"),
  memberList: document.querySelector("#memberList"),
  ledgerForm: document.querySelector("#ledgerForm"),
  financeSummary: document.querySelector("#financeSummary"),
  financeBars: document.querySelector("#financeBars"),
  ledgerList: document.querySelector("#ledgerList"),
  financeStatus: document.querySelector("#financeStatus"),
  fortuneResult: document.querySelector("#fortuneResult"),
  drawFortune: document.querySelector("#drawFortune"),
  ritualProgress: document.querySelector("#ritualProgress"),
  ritualProgressText: document.querySelector("#ritualProgressText"),
  ritualSteps: document.querySelector("#ritualSteps"),
  taskForm: document.querySelector("#taskForm"),
  taskList: document.querySelector("#taskList"),
  noticeList: document.querySelector("#noticeList"),
  resetDemo: document.querySelector("#resetDemo")
};

initialize();

function initialize() {
  setDateInputs();
  bindEvents();
  renderAll();
}

function bindEvents() {
  elements.bookingForm.addEventListener("submit", addReservation);
  elements.orderForm.addEventListener("submit", addOrder);
  elements.orderForm.addEventListener("input", updateOrderEstimate);
  elements.memberForm.addEventListener("submit", addMember);
  elements.ledgerForm.addEventListener("submit", addLedgerEntry);
  elements.drawFortune.addEventListener("click", drawFortune);
  elements.taskForm.addEventListener("submit", addTask);
  elements.resetDemo.addEventListener("click", resetDemo);

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", () => setActiveNav(link.dataset.nav));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveNav(visible.target.id);
      }
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.4, 0.7] }
  );

  document.querySelectorAll("main section[id], article[id]").forEach((section) => {
    observer.observe(section);
  });
}

function setDateInputs() {
  const dateInputs = document.querySelectorAll('input[type="date"]');

  dateInputs.forEach((input) => {
    input.min = todayOffset(0);
    if (!input.value) {
      input.value = todayOffset(1);
    }
  });
}

function loadState() {
  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    return structuredClone(defaultState);
  }

  try {
    return { ...structuredClone(defaultState), ...JSON.parse(stored) };
  } catch (error) {
    console.warn("Demo state could not be loaded.", error);
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function resetDemo() {
  localStorage.removeItem(storageKey);
  state = structuredClone(defaultState);
  renderAll();
}

function renderAll() {
  elements.todayLabel.textContent = dateFormatter.format(new Date());
  updateOrderEstimate();
  renderMetrics();
  renderReservations();
  renderOrders();
  renderMembers();
  renderFinance();
  renderFortune();
  renderRitual();
  renderTasks();
  renderNotices();
}

function renderMetrics() {
  const today = todayOffset(0);
  const todayBookings = state.reservations.filter((item) => item.date === today).length;
  const pendingOrders = state.orders.filter((order) => order.status !== "已完成").length;
  const balance = state.ledger.reduce((sum, item) => {
    return item.type === "income" ? sum + item.amount : sum - item.amount;
  }, 0);
  const openTasks = state.tasks.filter((task) => !task.done).length;

  elements.metricBookings.textContent = todayBookings;
  elements.metricOrders.textContent = pendingOrders;
  elements.metricBalance.textContent = currency.format(balance);
  elements.metricTasks.textContent = openTasks;
}

function renderReservations() {
  const sorted = [...state.reservations].sort((a, b) => {
    return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
  });

  elements.bookingList.innerHTML = sorted
    .map((item) => {
      return `
        <div class="service-row">
          <div>
            <span class="row-title">${escapeHtml(item.person)}</span>
            <span class="row-meta">${escapeHtml(item.service)}｜${formatShortDate(item.date)} ${escapeHtml(item.time)}</span>
          </div>
          <span class="tag">${escapeHtml(item.status)}</span>
          <span class="row-meta">${escapeHtml(item.note)}</span>
        </div>
      `;
    })
    .join("");
}

function addReservation(event) {
  event.preventDefault();
  const formData = new FormData(elements.bookingForm);

  state.reservations.unshift({
    id: createId("r"),
    person: formData.get("person").trim(),
    service: formData.get("service"),
    date: formData.get("date"),
    time: formData.get("time"),
    note: formData.get("note").trim() || "無特別備註",
    status: "待確認"
  });

  pushNotice("預約建立", `${formData.get("person")} 已加入 ${formData.get("service")} 預約。`);
  saveState();
  renderAll();
}

function updateOrderEstimate() {
  const formData = new FormData(elements.orderForm);
  const light = formData.get("light") || "光明燈";
  const ceremony = formData.get("ceremony") || "月例平安法會";
  const quantity = Number(formData.get("quantity") || 1);
  const total = calculateOrderTotal(light, ceremony, quantity);

  elements.orderEstimate.value = currency.format(total);
  elements.orderEstimate.textContent = currency.format(total);
}

function addOrder(event) {
  event.preventDefault();
  const formData = new FormData(elements.orderForm);
  const light = formData.get("light");
  const ceremony = formData.get("ceremony");
  const quantity = Number(formData.get("quantity") || 1);
  const total = calculateOrderTotal(light, ceremony, quantity);

  state.orders.unshift({
    id: createId("o"),
    name: formData.get("name").trim(),
    light,
    ceremony,
    quantity,
    total,
    status: "待收款"
  });

  state.ledger.unshift({
    id: createId("l"),
    type: "income",
    category: light,
    amount: total,
    memo: `${formData.get("name")} 線上訂單`,
    date: todayOffset(0)
  });

  pushNotice("點燈訂單", `${formData.get("name")} 的 ${light} 訂單已建立。`);
  saveState();
  renderAll();
}

function renderOrders() {
  elements.orderList.innerHTML = state.orders
    .map((order) => {
      return `
        <div class="order-row">
          <div>
            <span class="row-title">${escapeHtml(order.name)}｜${escapeHtml(order.light)}</span>
            <span class="row-meta">${escapeHtml(order.ceremony)}，${order.quantity} 份</span>
          </div>
          <span class="tag">${escapeHtml(order.status)}</span>
          <strong>${currency.format(order.total)}</strong>
        </div>
      `;
    })
    .join("");
}

function renderMembers() {
  const active = state.members.find((member) => member.id === state.activeMemberId) || state.members[0];
  state.activeMemberId = active.id;

  elements.activeMember.innerHTML = `
    <h3>${escapeHtml(active.name)}</h3>
    <p>${escapeHtml(active.level)}｜${escapeHtml(active.wish)}｜${escapeHtml(active.contact)}</p>
    <div class="member-stats">
      <div>
        <span>功德點</span>
        <strong>${active.points.toLocaleString("zh-TW")}</strong>
      </div>
      <div>
        <span>參拜次數</span>
        <strong>${active.visits}</strong>
      </div>
      <div>
        <span>最近服務</span>
        <strong>${escapeHtml(active.lastService)}</strong>
      </div>
    </div>
  `;

  elements.memberList.innerHTML = state.members
    .map((member) => {
      const activeClass = member.id === state.activeMemberId ? "active" : "";
      return `<button class="${activeClass}" type="button" data-member-id="${member.id}">${escapeHtml(member.name)}</button>`;
    })
    .join("");

  elements.memberList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeMemberId = button.dataset.memberId;
      saveState();
      renderMembers();
    });
  });
}

function addMember(event) {
  event.preventDefault();
  const formData = new FormData(elements.memberForm);
  const name = formData.get("memberName").trim();
  const wish = formData.get("memberWish");
  const id = createId("m");

  state.members.unshift({
    id,
    name,
    level: "新香客會員",
    wish,
    points: 120,
    visits: 1,
    lastService: "會員建檔",
    contact: "待綁定通知"
  });
  state.activeMemberId = id;
  elements.memberForm.reset();
  pushNotice("會員新增", `${name} 已建立會員卡，可綁定通知方式。`);
  saveState();
  renderAll();
}

function renderFinance() {
  const income = sumLedger("income");
  const expense = sumLedger("expense");
  const balance = income - expense;

  elements.financeStatus.textContent = balance >= 0 ? "本期盈餘" : "需補足預算";
  elements.financeSummary.innerHTML = `
    <div>
      <span>收入</span>
      <strong>${currency.format(income)}</strong>
    </div>
    <div>
      <span>支出</span>
      <strong>${currency.format(expense)}</strong>
    </div>
    <div>
      <span>淨額</span>
      <strong>${currency.format(balance)}</strong>
    </div>
  `;

  const totals = state.ledger.reduce((result, item) => {
    result[item.category] = (result[item.category] || 0) + item.amount;
    return result;
  }, {});
  const max = Math.max(...Object.values(totals), 1);

  elements.financeBars.innerHTML = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => {
      const width = Math.max((amount / max) * 100, 8);
      return `
        <div class="bar-row">
          <span>${escapeHtml(category)}</span>
          <span class="bar-track"><span class="bar-fill" style="width:${width}%"></span></span>
          <strong>${currency.format(amount)}</strong>
        </div>
      `;
    })
    .join("");

  elements.ledgerList.innerHTML = state.ledger
    .slice(0, 6)
    .map((item) => {
      const className = item.type === "income" ? "amount-income" : "amount-expense";
      const sign = item.type === "income" ? "+" : "-";

      return `
        <div class="ledger-row">
          <div>
            <span class="row-title">${escapeHtml(item.category)}</span>
            <span class="row-meta">${formatShortDate(item.date)}｜${escapeHtml(item.memo)}</span>
          </div>
          <span class="tag">${item.type === "income" ? "收入" : "支出"}</span>
          <strong class="${className}">${sign}${currency.format(item.amount)}</strong>
        </div>
      `;
    })
    .join("");
}

function addLedgerEntry(event) {
  event.preventDefault();
  const formData = new FormData(elements.ledgerForm);

  state.ledger.unshift({
    id: createId("l"),
    type: formData.get("type"),
    category: formData.get("category"),
    amount: Number(formData.get("amount")),
    memo: formData.get("memo").trim() || "櫃台登錄",
    date: todayOffset(0)
  });

  pushNotice("收支更新", `${formData.get("category")} 已新增 ${currency.format(Number(formData.get("amount")))}。`);
  saveState();
  renderAll();
}

function renderFortune() {
  if (!state.lastFortune) {
    elements.fortuneResult.innerHTML = `
      <span>今日籤詩</span>
      <strong>尚未抽籤</strong>
      <p>點選抽籤，系統會產生示範籤詩與廟方提示。</p>
    `;
    return;
  }

  elements.fortuneResult.innerHTML = `
    <span>今日籤詩</span>
    <strong>${escapeHtml(state.lastFortune.title)}</strong>
    <p>${escapeHtml(state.lastFortune.body)}</p>
    <p><b>廟方提示：</b>${escapeHtml(state.lastFortune.action)}</p>
  `;
}

function drawFortune() {
  const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  state.lastFortune = fortune;
  pushNotice("籤詩完成", fortune.action);
  saveState();
  renderAll();
}

function renderRitual() {
  elements.ritualSteps.innerHTML = ritualSteps
    .map((step, index) => {
      const checked = state.ritualDone.includes(index) ? "checked" : "";
      return `
        <label class="check-item">
          <input type="checkbox" data-step="${index}" ${checked}>
          <span>${index + 1}. ${escapeHtml(step)}</span>
        </label>
      `;
    })
    .join("");

  elements.ritualSteps.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      const step = Number(input.dataset.step);

      if (input.checked && !state.ritualDone.includes(step)) {
        state.ritualDone.push(step);
      }

      if (!input.checked) {
        state.ritualDone = state.ritualDone.filter((item) => item !== step);
      }

      saveState();
      renderRitual();
      renderMetrics();
    });
  });

  const doneCount = state.ritualDone.length;
  elements.ritualProgress.value = doneCount;
  elements.ritualProgressText.textContent = `${doneCount}/${ritualSteps.length}`;
}

function renderTasks() {
  elements.taskList.innerHTML = state.tasks
    .map((task) => {
      const checked = task.done ? "checked" : "";
      const doneClass = task.done ? "done" : "";

      return `
        <label class="task-row ${doneClass}">
          <input type="checkbox" data-task-id="${task.id}" ${checked}>
          <span>
            <span class="row-title">${escapeHtml(task.title)}</span>
            <span class="row-meta">負責：${escapeHtml(task.owner)}</span>
          </span>
        </label>
      `;
    })
    .join("");

  elements.taskList.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      const task = state.tasks.find((item) => item.id === input.dataset.taskId);
      task.done = input.checked;
      saveState();
      renderAll();
    });
  });
}

function addTask(event) {
  event.preventDefault();
  const formData = new FormData(elements.taskForm);
  const title = formData.get("taskTitle").trim();

  state.tasks.unshift({
    id: createId("t"),
    title,
    owner: formData.get("taskOwner"),
    done: false
  });

  elements.taskForm.reset();
  pushNotice("待辦新增", `${title} 已加入 ${formData.get("taskOwner")} 清單。`);
  saveState();
  renderAll();
}

function renderNotices() {
  elements.noticeList.innerHTML = state.notices
    .slice(0, 5)
    .map((notice) => {
      return `
        <div class="notice-row">
          <strong>${escapeHtml(notice.title)}</strong>
          <span>${escapeHtml(notice.body)}</span>
        </div>
      `;
    })
    .join("");
}

function pushNotice(title, body) {
  state.notices.unshift({ title, body });
}

function sumLedger(type) {
  return state.ledger
    .filter((item) => item.type === type)
    .reduce((sum, item) => sum + item.amount, 0);
}

function calculateOrderTotal(light, ceremony, quantity) {
  return (lightPrices[light] + ceremonyPrices[ceremony]) * Math.max(quantity, 1);
}

function setActiveNav(id) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === id);
  });
}

function formatShortDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return dateFormatter.format(date);
}

function todayOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
