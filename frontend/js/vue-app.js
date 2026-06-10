/* ============================================================
   农淘 — Vue 3 Application Shell
   ============================================================ */

var { createApp, ref, reactive, computed, onMounted, nextTick } = Vue;

var VueApp = createApp({
  setup: function() {
    var isLoggedIn = ref(false);
    var authMode = ref('login');
    var currentUser = ref(null);
    var loginForm = ref({ username: '', password: '' });
    var loginError = ref('');
    var regForm = ref({ username: '', password: '', password2: '', name: '', role: 'consumer', phone: '', location: '' });
    var regError = ref('');
    var currentPage = ref('');
    var sidebarOpen = ref(false);
    var globalSearch = ref('');
    var toasts = ref([]);
    var toastId = 0;

    var roles = {
      consumer:  { name:'消费者', icon:'fa-user', color:'#2D6A4F' },
      merchant:  { name:'商家', icon:'fa-store', color:'#4A90B8' },
      certifier: { name:'资质审核方', icon:'fa-certificate', color:'#E8A838' },
      admin:     { name:'平台管理员', icon:'fa-shield', color:'#8B5CF6' },
      regulator: { name:'监管方', icon:'fa-search', color:'#D14343' },
    };

    var menus = {
      consumer: [
        { key:'discovery', icon:'fa-search', label:'发现好物' },
        { key:'custom-order', icon:'fa-magic', label:'私人定制' },
        { key:'order-square', icon:'fa-th-list', label:'定制广场' },
        { key:'my-orders', icon:'fa-clipboard-list', label:'我的需求' },
        { key:'cart', icon:'fa-shopping-cart', label:'购物车' },
        { key:'messages', icon:'fa-envelope', label:'消息' },
        { key:'profile', icon:'fa-user-circle', label:'个人中心' },
      ],
      merchant: [
        { key:'dashboard', icon:'fa-chart-pie', label:'工作台' },
        { key:'product-list', icon:'fa-boxes', label:'商品管理' },
        { key:'demand-market', icon:'fa-bullseye', label:'需求市场' },
        { key:'qualifications', icon:'fa-id-card', label:'我的资质' },
        { key:'orders', icon:'fa-truck', label:'订单管理' },
        { key:'my-shop', icon:'fa-shop', label:'店铺设置' },
        { key:'messages', icon:'fa-envelope', label:'消息' },
      ],
      certifier: [
        { key:'review-list', icon:'fa-check-double', label:'审核管理' },
        { key:'review-history', icon:'fa-history', label:'审核历史' },
        { key:'qual-management', icon:'fa-medal', label:'资质管理' },
        { key:'statistics', icon:'fa-chart-bar', label:'统计分析' },
        { key:'messages', icon:'fa-envelope', label:'消息' },
      ],
      admin: [
        { key:'user-management', icon:'fa-users', label:'用户管理' },
        { key:'certifier-management', icon:'fa-building', label:'审核方管理' },
        { key:'rule-management', icon:'fa-gear', label:'规则管理' },
        { key:'content-audit', icon:'fa-eye', label:'内容审核' },
        { key:'dispute', icon:'fa-gavel', label:'纠纷处理' },
        { key:'reports', icon:'fa-file-alt', label:'数据报表' },
      ],
      regulator: [
        { key:'archive-search', icon:'fa-search', label:'产品档案查询' },
        { key:'merchant-audit', icon:'fa-building', label:'商家合规检查' },
        { key:'product-spot', icon:'fa-check-circle', label:'商品抽检' },
        { key:'emergency', icon:'fa-exclamation-triangle', label:'应急处理' },
        { key:'statistics', icon:'fa-chart-bar', label:'数据统计' },
      ],
    };

    var pageTitles = {
      discovery:{title:'发现好物',sub:'探索源头农产品'}, 'custom-order':{title:'私人定制',sub:'设定条件，定向发布需求'},
      'order-square':{title:'定制广场',sub:'浏览他人的定制需求'}, 'my-orders':{title:'我的需求',sub:'查看和管理发布的定制'},
      cart:{title:'购物车',sub:'待结算商品'}, messages:{title:'消息中心',sub:'系统通知与消息'},
      profile:{title:'个人中心',sub:'账户信息与设置'}, dashboard:{title:'工作台',sub:'经营数据概览'},
      'product-list':{title:'商品管理',sub:'发布和管理商品'}, 'demand-market':{title:'需求市场',sub:'根据资质自动匹配定制需求'},
      qualifications:{title:'我的资质',sub:'管理资质标签与通行证'}, orders:{title:'订单管理',sub:'订单处理与物流'},
      'my-shop':{title:'店铺设置',sub:'店铺信息与认证展示'}, 'review-list':{title:'资质审核',sub:'待审批的资质申请'},
      'review-history':{title:'审核历史',sub:'已处理的资质记录'}, 'qual-management':{title:'资质管理',sub:'管理已颁发的资质'},
      statistics:{title:'统计分析',sub:'数据分析'}, 'user-management':{title:'用户管理',sub:'平台用户管理'},
      'certifier-management':{title:'审核方管理',sub:'管理审核机构'}, 'rule-management':{title:'规则管理',sub:'全局认证规则'},
      'content-audit':{title:'内容审核',sub:'平台商品与内容审核'}, dispute:{title:'纠纷处理',sub:'交易纠纷仲裁'},
      reports:{title:'数据报表',sub:'平台运营数据'}, 'archive-search':{title:'产品档案查询',sub:'全链路追溯查询'},
      'merchant-audit':{title:'商家合规检查',sub:'商家资质合规'}, 'product-spot':{title:'商品抽检',sub:'随机抽检追溯信息'},
      emergency:{title:'应急处理',sub:'紧急查看加密档案'},
    };

    var menuItems = computed(function() { return currentUser.value ? (menus[currentUser.value.role] || []) : []; });
    var currentRoleInfo = computed(function() { return currentUser.value ? (roles[currentUser.value.role] || {name:'',color:'#ccc'}) : {name:'',color:'#ccc'}; });
    var pageInfo = computed(function() { return pageTitles[currentPage.value] || {title:currentPage.value||'首页',sub:''}; });
    var isLegacyPage = computed(function() { return !!currentPage.value; });
    var cartCount = computed(function() {
      var c = window.App && window.App.cart ? window.App.cart : [];
      var t = 0; c.forEach(function(i) { t += i.qty || 1; }); return t;
    });

    function showToast(message, type) {
      type = type || 'info';
      var id = ++toastId;
      toasts.value.push({ id: id, message: message, type: type });
      setTimeout(function() {
        toasts.value = toasts.value.filter(function(t) { return t.id !== id; });
      }, 2800);
    }

    function doLogin() {
      var username = loginForm.value.username.trim();
      var password = loginForm.value.password;
      loginError.value = '';
      if (!username || !password) { loginError.value = '请输入用户名和密码'; return; }
      API.loginWithPassword(username, password).then(function(res) {
        if (res.status === 'success' && res.user) { handleLoginSuccess(res.user); }
        else { loginError.value = res.error || '登录失败，请检查账号密码'; }
      }).catch(function() {
        API.loginByRole('consumer').then(function(res) {
          if (res.status === 'success' && res.user) { res.user.name = username; handleLoginSuccess(res.user); }
          else { loginError.value = '登录失败，请检查网络'; }
        });
      });
    }

    function doRegister() {
      var f = regForm.value; regError.value = '';
      if (!f.username || f.username.length < 3) { regError.value = '用户名至少3位'; return; }
      if (!f.password || f.password.length < 6) { regError.value = '密码至少6位'; return; }
      if (f.password !== f.password2) { regError.value = '两次密码不一致'; return; }
      if (!f.name) { regError.value = '请填写姓名'; return; }
      API.register(f.username, f.password, f.name, f.role, f.phone, f.location).then(function(res) {
        if (res.status === 'success') { showToast('注册成功！', 'success'); handleLoginSuccess(res.user); }
        else { regError.value = res.error || '注册失败'; }
      }).catch(function() { regError.value = '注册失败，请检查网络'; });
    }

    function handleLoginSuccess(user) {
      currentUser.value = user; isLoggedIn.value = true;
      localStorage.setItem('agrichain_user', JSON.stringify(user));
      window.App.currentUser = user; window.App.currentRole = user.role;
      var defaults = { consumer:'discovery', merchant:'dashboard', certifier:'review-list', admin:'user-management', regulator:'archive-search' };
      navigateTo(defaults[user.role] || 'dashboard');
    }

    function doLogout() {
      localStorage.removeItem('agrichain_user');
      isLoggedIn.value = false; currentUser.value = null;
      if (window.App) { window.App.cart.splice(0, window.App.cart.length); }
      window.App.currentUser = null; window.App.currentRole = null;
    }

    function navigateTo(pageKey) {
      if (!pageKey) return;
      currentPage.value = pageKey;
      nextTick(function() {
        var container = document.getElementById('legacy-page-container');
        if (!container) return;
        if (VuePages[pageKey]) {
          if (container.__vuePageApp) container.__vuePageApp.unmount();
          var PageComp = VuePages[pageKey];
          var pageApp = Vue.createApp({
            template: '<div><component :is="comp" /></div>',
            data: function() { return { comp: 'vue-page-' + pageKey }; }
          });
          pageApp.component('vue-page-' + pageKey, PageComp);
          container.__vuePageApp = pageApp;
          pageApp.mount(container);
          return;
        }
        if (container.__vuePageApp) { container.__vuePageApp.unmount(); container.__vuePageApp = null; }
        var renderer = window.PageRenderers ? window.PageRenderers[pageKey] : null;
        if (renderer) { renderer(container, window.App.currentUser); }
        else { container.innerHTML = '<div class="card" style="text-align:center;padding:60px;"><i class="fas fa-tools" style="font-size:3rem;opacity:0.15;margin-bottom:16px;display:block;"></i><h3 style="color:var(--co-neutral-600);">'+pageKey+'</h3><p style="color:var(--co-neutral-500);margin-top:8px;">此页面正在建设中</p></div>'; }
      });
    }

    function doGlobalSearch() {
      var q = globalSearch.value.trim(); if (!q) return;
      navigateTo('discovery');
      setTimeout(function() {
        var inp = document.getElementById('searchKeyword');
        if (inp) { inp.value = q; inp.dispatchEvent(new Event('input')); }
        var btn = document.getElementById('searchBtn'); if (btn) btn.click();
      }, 150);
    }

    onMounted(function() {
      // Init global helpers (MUST run before handleLoginSuccess)
      window.showToast = showToast;
      window.navigateTo = navigateTo;

      // Load cart from localStorage
      var savedCart = localStorage.getItem('fruit_cart');
      var initialCart = [];
      if (savedCart) { try { initialCart = JSON.parse(savedCart); } catch(e) {} }
      if (window.App) {
        window.App.cart = reactive(initialCart);
        // Auto-save cart on any change (poll-style via Proxy is complex, so we save in addToCart)
        var origAdd = window.App.addToCart;
        window.App.addToCart = function(product) {
          var existing = null;
          for (var i = 0; i < this.cart.length; i++) {
            if (this.cart[i].id === product.id) { existing = this.cart[i]; break; }
          }
          if (existing) { existing.qty = (existing.qty || 1) + 1; }
          else { this.cart.push({ id: product.id, name: product.name, price: product.price, image: product.image || '📦', qty: 1, shop_id: product.shop_id || '', shop_name: product.shop_name || '' }); }
          localStorage.setItem('fruit_cart', JSON.stringify(this.cart));
          showToast('已加入购物车', 'success');
        };
        // Save cart to localStorage periodically
        setInterval(function() {
          if (window.App && window.App.cart && window.App.cart.length > 0) {
            localStorage.setItem('fruit_cart', JSON.stringify(window.App.cart));
          }
        }, 3000);
      }

      // Restore saved session
      var saved = localStorage.getItem('agrichain_user');
      if (saved) {
        try {
          var user = JSON.parse(saved);
          currentUser.value = user;
          isLoggedIn.value = true;
          window.App.currentUser = user;
          window.App.currentRole = user.role;
          var defaults = { consumer:'discovery', merchant:'dashboard', certifier:'review-list', admin:'user-management', regulator:'archive-search' };
          // Use nextTick to ensure DOM is ready before navigating
          nextTick(function() { navigateTo(defaults[user.role] || 'dashboard'); });
          return;
        } catch(e) {}
      }
      isLoggedIn.value = false;
    });

    return {
      isLoggedIn, authMode, currentUser, loginForm, loginError, regForm, regError,
      currentPage, sidebarOpen, globalSearch, menuItems, currentRoleInfo, pageInfo, isLegacyPage, cartCount,
      toasts, doLogin, doRegister, doLogout, navigateTo, doGlobalSearch, showToast
    };
  }
});

var VuePages = {};
if (typeof VueDiscovery !== 'undefined') VuePages['discovery'] = VueDiscovery;
if (typeof VueCart !== 'undefined') VuePages['cart'] = VueCart;
if (typeof VueDashboard !== 'undefined') VuePages['dashboard'] = VueDashboard;
if (typeof VueProfile !== 'undefined') VuePages['profile'] = VueProfile;
if (typeof VueCustomOrder !== 'undefined') VuePages['custom-order'] = VueCustomOrder;
if (typeof VueDemandMarket !== 'undefined') VuePages['demand-market'] = VueDemandMarket;
if (typeof VueQualifications !== 'undefined') VuePages['qualifications'] = VueQualifications;
if (typeof VueProductList !== 'undefined') VuePages['product-list'] = VueProductList;
if (typeof VueMyOrders !== 'undefined') VuePages['my-orders'] = VueMyOrders;
if (typeof VueReviewList !== 'undefined') VuePages['review-list'] = VueReviewList;
if (typeof VueArchiveSearch !== 'undefined') VuePages['archive-search'] = VueArchiveSearch;
if (typeof VueEmergency !== 'undefined') VuePages['emergency'] = VueEmergency;
if (typeof VueUserManagement !== 'undefined') VuePages['user-management'] = VueUserManagement;
if (typeof VueRuleManagement !== 'undefined') VuePages['rule-management'] = VueRuleManagement;
if (typeof VueOrderSquare !== 'undefined') VuePages['order-square'] = VueOrderSquare;
if (typeof VueMessages !== 'undefined') VuePages['messages'] = VueMessages;
if (typeof VueMerchantOrders !== 'undefined') VuePages['orders'] = VueMerchantOrders;
if (typeof VueMyShop !== 'undefined') VuePages['my-shop'] = VueMyShop;
if (typeof VueReviewHistory !== 'undefined') VuePages['review-history'] = VueReviewHistory;
if (typeof VueQualManagement !== 'undefined') VuePages['qual-management'] = VueQualManagement;
if (typeof VueStatistics !== 'undefined') VuePages['statistics'] = VueStatistics;
if (typeof VueCertifierManagement !== 'undefined') VuePages['certifier-management'] = VueCertifierManagement;
if (typeof VueContentAudit !== 'undefined') VuePages['content-audit'] = VueContentAudit;
if (typeof VueDispute !== 'undefined') VuePages['dispute'] = VueDispute;
if (typeof VueReports !== 'undefined') VuePages['reports'] = VueReports;
if (typeof VueMerchantAudit !== 'undefined') VuePages['merchant-audit'] = VueMerchantAudit;
if (typeof VueProductSpot !== 'undefined') VuePages['product-spot'] = VueProductSpot;

var comps = {
  'base-button': typeof BaseButton !== 'undefined' ? BaseButton : null,
  'base-card': typeof BaseCard !== 'undefined' ? BaseCard : null,
  'base-input': typeof BaseInput !== 'undefined' ? BaseInput : null,
  'base-modal': typeof BaseModal !== 'undefined' ? BaseModal : null,
  'base-badge': typeof BaseBadge !== 'undefined' ? BaseBadge : null,
  'base-tag': typeof BaseTag !== 'undefined' ? BaseTag : null,
  'base-toast-container': typeof BaseToastContainer !== 'undefined' ? BaseToastContainer : null,
  'base-loading': typeof BaseLoading !== 'undefined' ? BaseLoading : null,
  'base-empty': typeof BaseEmpty !== 'undefined' ? BaseEmpty : null,
};
Object.keys(comps).forEach(function(n) { if (comps[n]) VueApp.component(n, comps[n]); });
Object.keys(VuePages).forEach(function(n) { VueApp.component('vue-page-' + n, VuePages[n]); });

VueApp.mount('#app');
window.__vueApp = VueApp;
