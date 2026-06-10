// 农淘 — Taobao-style App Shell
var App = {
  currentUser: null, currentRole: null,
  cart: [], // in-memory cart

  roles: {
    consumer:  { name: "消费者",   icon: "fa-user",        color: "#FF6A00", desc: "浏览商品，发布定制需求" },
    merchant:  { name: "商家",     icon: "fa-store",       color: "#3b82f6", desc: "管理商品，接单定制需求" },
    certifier: { name: "资质审核方", icon: "fa-certificate", color: "#f59e0b", desc: "审核并颁发资质" },
    admin:     { name: "平台管理员", icon: "fa-shield",      color: "#8b5cf6", desc: "全局管理与纠纷处理" },
    regulator: { name: "监管方",   icon: "fa-search",       color: "#ef4444", desc: "产品追溯与合规稽查" },
  },

  menus: {
    consumer: [
      { key: "discovery",    icon: "fa-search",          label: "发现好物" },
      { key: "custom-order", icon: "fa-magic",           label: "私人定制" },
      { key: "order-square", icon: "fa-th-list",         label: "定制广场" },
      { key: "my-orders",    icon: "fa-clipboard-list",  label: "我的需求" },
      { key: "cart",         icon: "fa-shopping-cart",   label: "购物车" },
      { key: "messages",     icon: "fa-envelope",        label: "消息" },
      { key: "profile",      icon: "fa-user-circle",     label: "个人中心" },
    ],
    merchant: [
      { key: "dashboard",      icon: "fa-chart-pie",   label: "工作台" },
      { key: "product-list",   icon: "fa-boxes",       label: "商品管理" },
      { key: "demand-market",  icon: "fa-bullseye",    label: "需求市场" },
      { key: "qualifications", icon: "fa-id-card",     label: "我的资质" },
      { key: "orders",         icon: "fa-truck",       label: "订单管理" },
      { key: "my-shop",        icon: "fa-shop",        label: "店铺设置" },
      { key: "messages",       icon: "fa-envelope",    label: "消息" },
    ],
    certifier: [
      { key: "review-list",    icon: "fa-check-double", label: "审核管理" },
      { key: "review-history", icon: "fa-history",      label: "审核历史" },
      { key: "qual-management",icon: "fa-medal",        label: "资质管理" },
      { key: "statistics",     icon: "fa-chart-bar",    label: "统计分析" },
      { key: "messages",       icon: "fa-envelope",     label: "消息" },
    ],
    admin: [
      { key: "user-management",       icon: "fa-users",    label: "用户管理" },
      { key: "certifier-management",  icon: "fa-building", label: "审核方管理" },
      { key: "rule-management",       icon: "fa-gear",     label: "规则管理" },
      { key: "content-audit",         icon: "fa-eye",      label: "内容审核" },
      { key: "dispute",               icon: "fa-gavel",    label: "纠纷处理" },
      { key: "reports",               icon: "fa-file-alt", label: "数据报表" },
    ],
    regulator: [
      { key: "archive-search", icon: "fa-search",              label: "产品档案查询" },
      { key: "merchant-audit", icon: "fa-building",            label: "商家合规检查" },
      { key: "product-spot",   icon: "fa-check-circle",        label: "商品抽检" },
      { key: "emergency",      icon: "fa-exclamation-triangle", label: "应急处理" },
      { key: "statistics",     icon: "fa-chart-bar",           label: "数据统计" },
    ],
  },

  pageTitles: {
    discovery:     { title: "发现好物",   sub: "探索源头农产品" },
    "custom-order":{ title: "私人定制",   sub: "设定条件，定向发布需求" },
    "order-square":{ title: "定制广场",   sub: "浏览他人的定制需求" },
    "my-orders":   { title: "我的需求",   sub: "查看和管理发布的定制" },
    cart:          { title: "购物车",     sub: "待结算商品" },
    messages:      { title: "消息中心",   sub: "系统通知与消息" },
    profile:       { title: "个人中心",   sub: "账户信息与设置" },
    dashboard:     { title: "工作台",     sub: "经营数据概览" },
    "product-list":{ title: "商品管理",   sub: "发布和管理商品" },
    "demand-market":{ title: "需求市场",  sub: "根据资质自动匹配定制需求" },
    qualifications:{ title: "我的资质",   sub: "管理资质标签与通行证" },
    orders:        { title: "订单管理",   sub: "订单处理与物流" },
    "my-shop":     { title: "店铺设置",   sub: "店铺信息与认证展示" },
    "review-list": { title: "资质审核",   sub: "待审批的资质申请" },
    "review-history":{ title: "审核历史", sub: "已处理的资质记录" },
    "qual-management":{ title: "资质管理", sub: "管理已颁发的资质" },
    statistics:    { title: "统计分析",   sub: "审核数据分析" },
    "user-management":{ title: "用户管理", sub: "平台用户管理" },
    "certifier-management":{ title: "审核方管理", sub: "管理审核机构" },
    "rule-management":{ title: "规则管理", sub: "全局认证规则" },
    "content-audit":{ title: "内容审核",  sub: "平台商品与内容审核" },
    dispute:       { title: "纠纷处理",   sub: "交易纠纷仲裁" },
    reports:       { title: "数据报表",   sub: "平台运营数据" },
    "archive-search":{ title: "产品档案查询", sub: "全链路追溯查询" },
    "merchant-audit":{ title: "商家合规检查", sub: "商家资质合规" },
    "product-spot":{ title: "商品抽检",   sub: "随机抽检追溯信息" },
    emergency:     { title: "应急处理",   sub: "紧急查看加密档案" },
  },

  // ===== Cart Management =====
  addToCart: function(product) {
    var existing = null;
    for (var i = 0; i < this.cart.length; i++) {
      if (this.cart[i].id === product.id) { existing = this.cart[i]; break; }
    }
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      this.cart.push({ id: product.id, name: product.name, price: product.price, image: product.image || "📦", qty: 1, shop_name: product.shop_name || "" });
    }
    this.updateCartBadge();
    this.showCartToast();
  },

  removeFromCart: function(index) {
    this.cart.splice(index, 1);
    this.updateCartBadge();
    // If cart page is open, refresh it
    if (document.getElementById("pageContainer") && App.currentPage === "cart") {
      App.navigate("cart");
    }
  },

  updateCartQty: function(index, qty) {
    qty = parseInt(qty) || 1;
    if (qty < 1) qty = 1;
    if (qty > 99) qty = 99;
    this.cart[index].qty = qty;
    this.updateCartBadge();
  },

  updateCartBadge: function() {
    var total = 0;
    for (var i = 0; i < this.cart.length; i++) { total += this.cart[i].qty || 1; }
    var badge = document.getElementById("tbCartBadge");
    if (badge) {
      if (total > 0) { badge.textContent = total > 99 ? "99+" : total; badge.style.display = ""; }
      else { badge.style.display = "none"; }
    }
  },

  showCartToast: function() {
    var el = document.getElementById("cartToast");
    if (!el) return;
    el.style.display = "block";
    el.style.opacity = "1";
    clearTimeout(el._tid);
    el._tid = setTimeout(function() { el.style.opacity = "0"; setTimeout(function() { el.style.display = "none"; }, 300); }, 1500);
  },

  // ===== Init =====
  init: function() {
    var saved = localStorage.getItem("agrichain_user");
    if (saved) {
      try {
        var user = JSON.parse(saved);
        this.login(user);
        return;
      } catch(e) {}
    }
    this.showLogin();
  },

  showLogin: function() {
    document.getElementById("loginPage").style.display = "";
    document.getElementById("registerPage").style.display = "none";
    document.getElementById("sidebar").style.display = "none";
    document.getElementById("pageArea").style.display = "none";
    document.getElementById("topBar").style.display = "none";
    document.getElementById("loginError").style.display = "none";

    var self = this;
    document.getElementById("loginSubmitBtn").onclick = function() { self.doLogin(); };
    document.getElementById("loginPassword").onkeydown = function(e) {
      if (e.key === "Enter") self.doLogin();
    };
    document.getElementById("showRegisterLink").onclick = function(e) {
      e.preventDefault(); self.showRegister();
    };
    document.getElementById("loginUsername").focus();
  },

  doLogin: function() {
    var username = document.getElementById("loginUsername").value.trim();
    var password = document.getElementById("loginPassword").value;
    var errEl = document.getElementById("loginError");

    if (!username || !password) {
      errEl.textContent = "请输入用户名和密码"; errEl.style.display = "block"; return;
    }

    var self = this;
    API.loginWithPassword(username, password).then(function(res) {
      if (res.status === "success" && res.user) {
        self.login(res.user);
      } else {
        errEl.textContent = res.error || "登录失败，请检查账号密码"; errEl.style.display = "block";
      }
    }).catch(function() {
      // Fallback: try demo login
      API.loginByRole("consumer").then(function(res) {
        if (res.status === "success" && res.user) {
          res.user.name = username;
          self.login(res.user);
        } else {
          errEl.textContent = "登录失败，请检查网络"; errEl.style.display = "block";
        }
      });
    });
  },

  // ===== Register =====
  showRegister: function() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("registerPage").style.display = "block";
    document.getElementById("sidebar").style.display = "none";
    document.getElementById("pageArea").style.display = "none";
    document.getElementById("regError").style.display = "none";

    var self = this;
    document.getElementById("registerSubmitBtn").onclick = function() { self.doRegister(); };
    document.getElementById("regUsername").focus();
  },

  doRegister: function() {
    var username = document.getElementById("regUsername").value.trim();
    var password = document.getElementById("regPassword").value;
    var password2 = document.getElementById("regPassword2").value;
    var name = document.getElementById("regName").value.trim();
    var role = document.getElementById("regRole").value;
    var phone = document.getElementById("regPhone").value.trim();
    var location = document.getElementById("regLocation").value.trim();
    var errEl = document.getElementById("regError");

    if (!username || username.length < 3) { errEl.textContent = "用户名至少3位"; errEl.style.display = "block"; return; }
    if (!password || password.length < 6) { errEl.textContent = "密码至少6位"; errEl.style.display = "block"; return; }
    if (password !== password2) { errEl.textContent = "两次密码不一致"; errEl.style.display = "block"; return; }
    if (!name) { errEl.textContent = "请填写姓名"; errEl.style.display = "block"; return; }

    var self = this;
    API.register(username, password, name, role, phone, location).then(function(res) {
      if (res.status === "success") {
        showToast("注册成功！", "success");
        self.login(res.user);
      } else {
        errEl.textContent = res.error || "注册失败"; errEl.style.display = "block";
      }
    }).catch(function() {
      errEl.textContent = "注册失败，请检查网络"; errEl.style.display = "block";
    });
  },

  // ===== Login Success =====
  login: function(user) {
    this.currentUser = user;
    this.currentRole = user.role;
    localStorage.setItem("agrichain_user", JSON.stringify(user));

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("registerPage").style.display = "none";
    document.getElementById("sidebar").style.display = "flex";
    document.getElementById("pageArea").style.display = "block";
    document.getElementById("topBar").style.display = "flex";
    document.getElementById("tbUserName").textContent = user.name;

    var roleInfo = this.roles[user.role];
    var color = roleInfo ? roleInfo.color : "#FF6A00";
    document.getElementById("roleBadgeSide").innerHTML =
      '<div style="color:' + color + ';">' +
      '<i class="fas ' + (roleInfo ? roleInfo.icon : "fa-user") + '"></i> <strong>' + user.name + '</strong>' +
      '<div style="font-size:0.7rem;color:var(--tb-text-secondary);margin-top:2px;">' + (roleInfo ? roleInfo.name : "") + '</div></div>';

    var menu = this.menus[user.role] || [];
    var self = this;
    document.getElementById("sideMenu").innerHTML = menu.map(function(m) {
      return '<button class="menu-item" data-page="' + m.key + '">' +
        '<i class="fas ' + m.icon + '"></i> ' + m.label + '</button>';
    }).join("");
    document.getElementById("sideMenu").onclick = function(e) {
      var item = e.target.closest(".menu-item");
      if (item) self.navigate(item.dataset.page);
    };
    document.getElementById("logoutBtn").onclick = function() {
      localStorage.removeItem("agrichain_user");
      self.cart = [];
      self.updateCartBadge();
      self.showLogin();
    };

    // Top bar actions
    document.getElementById("tbSearchBtn").onclick = function() {
      self.navigate("discovery");
      setTimeout(function() {
        var inp = document.getElementById("searchKeyword");
        var searchVal = document.getElementById("tbSearchInput").value.trim();
        if (inp && searchVal) { inp.value = searchVal; inp.dispatchEvent(new Event("input")); }
        var btn = document.getElementById("searchBtn");
        if (btn) btn.click();
      }, 100);
    };
    document.getElementById("tbSearchInput").onkeydown = function(e) {
      if (e.key === "Enter") document.getElementById("tbSearchBtn").click();
    };
    document.getElementById("tbCartBtn").onclick = function() { self.navigate("cart"); };
    document.getElementById("tbMsgBtn").onclick = function() { self.navigate("messages"); };
    document.getElementById("tbUserBtn").onclick = function() { self.navigate("profile"); };

    var defaults = {
      consumer: "discovery", merchant: "dashboard", certifier: "review-list",
      admin: "user-management", regulator: "archive-search"
    };
    this.navigate(defaults[user.role] || "dashboard");
  },

  // ===== Page Navigation =====
  currentPage: null,
  navigate: function(pageKey) {
    this.currentPage = pageKey;
    var info = this.pageTitles[pageKey] || { title: pageKey, sub: "" };
    document.getElementById("pageTitle").textContent = info.title;
    document.getElementById("pageSubtitle").textContent = info.sub;
    document.querySelectorAll(".menu-item").forEach(function(el) {
      el.classList.toggle("active", el.dataset.page === pageKey);
    });
    var renderer = PageRenderers[pageKey];
    var container = document.getElementById("pageContainer");
    if (renderer) {
      renderer(container, this.currentUser);
    } else {
      container.innerHTML =
        '<div class="glass-card" style="text-align:center;padding:60px;">' +
        '<i class="fas fa-tools" style="font-size:3rem;opacity:0.3;margin-bottom:16px;"></i>' +
        '<h3>' + pageKey + '</h3><p style="color:var(--tb-text-secondary);">此页面正在建设中</p></div>';
    }
  },
};

document.addEventListener("DOMContentLoaded", function() { App.init(); });
