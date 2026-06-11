// 农禾坊 — Legacy App Shell (Phase 1: Vue owns UI, App keeps state + cart + page renderer bridge)
var App = {
  currentUser: null, currentRole: null,
  cart: [], // in-memory cart

  roles: {
    consumer:  { name: "消费者",   icon: "fa-user",        color: "#2D6A4F" },
    merchant:  { name: "商家",     icon: "fa-store",       color: "#4A90B8" },
    certifier: { name: "资质审核方", icon: "fa-certificate", color: "#E8A838" },
    admin:     { name: "平台管理员", icon: "fa-shield",      color: "#8B5CF6" },
    regulator: { name: "监管方",   icon: "fa-search",       color: "#D14343" },
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
      this.cart.push({ id: product.id, name: product.name, price: product.price, image: product.image || "📦", qty: 1, shop_id: product.shop_id || "", shop_name: product.shop_name || "" });
    }
    this.updateCartBadge();
    // Sync to Vue
    if (window.__vueApp) {
      window.__vueApp._instance.data.cart = this.cart;
    }
    window.showToast && window.showToast('已加入购物车', 'success');
  },

  removeFromCart: function(index) {
    this.cart.splice(index, 1);
    this.updateCartBadge();
    // If cart page is open, refresh it
    if (window.__vueApp && window.__vueApp._instance.data.currentPage === 'cart') {
      window.__vueApp._instance.data.navigateTo('cart');
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
    // Vue handles the badge now — no-op for legacy DOM
  },

  showCartToast: function() {
    // Vue handles toasts now
    window.showToast && window.showToast('已加入购物车', 'success');
  },

  // ===== Init (Phase 1: Vue handles initialization) =====
  init: function() {
    // Vue handles initialization now
  },

  showLogin: function() {
    // Vue handles login UI
  },

  showRegister: function() {
    // Vue handles register UI
  },

  // ===== Login (called by Vue after API response) =====
  login: function(user) {
    this.currentUser = user;
    this.currentRole = user.role;
    localStorage.setItem("agrichain_user", JSON.stringify(user));
  },

  // ===== Page Navigation (called by Vue, delegates to legacy renderer) =====
  currentPage: null,
  navigate: function(pageKey) {
    this.currentPage = pageKey;
    var container = document.getElementById("legacy-page-container");
    if (!container) return;
    var renderer = PageRenderers[pageKey];
    if (renderer) {
      renderer(container, this.currentUser);
    } else {
      container.innerHTML =
        '<div class="glass-card" style="text-align:center;padding:60px;">' +
        '<i class="fas fa-tools" style="font-size:3rem;opacity:0.15;margin-bottom:16px;display:block;"></i>' +
        '<h3 style="color:var(--co-neutral-600);">' + pageKey + '</h3>' +
        '<p style="color:var(--co-neutral-500);margin-top:8px;">此页面正在建设中</p></div>';
    }
  },
};
