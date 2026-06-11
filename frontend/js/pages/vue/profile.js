/* VueProfile — Personal Center (all roles) */
var VueProfile = {
  name: 'VueProfile',
  template: '<div>' +
    /* Cover */
    '<div class="profile-cover">' +
    '<div class="avatar-circle">{{ initial }}</div>' +
    '<h3>{{ user?.name || "用户" }}</h3>' +
    '<p>{{ roleName }}<span v-if="user?.location"> · {{ user.location }}</span></p>' +
    '<p style="font-size:0.75rem;opacity:0.7;margin-top:2px;">ID: {{ user?.id || "" }}</p>' +
    '</div>' +

    /* Stats Row */
    '<div class="stat-grid" style="margin-bottom:var(--sp-4);">' +
    '<div class="stat-card" style="text-align:center;">' +
    '<div style="font-size:1.6rem;font-weight:700;color:var(--co-primary-500);">{{ stats.cart }}</div>' +
    '<div style="font-size:0.75rem;color:var(--co-neutral-500);">购物车</div></div>' +
    '<div class="stat-card" style="text-align:center;">' +
    '<div style="font-size:1.6rem;font-weight:700;color:var(--co-info);">{{ stats.orders }}</div>' +
    '<div style="font-size:0.75rem;color:var(--co-neutral-500);">订单</div></div>' +
    '<div class="stat-card" style="text-align:center;">' +
    '<div style="font-size:1.6rem;font-weight:700;color:var(--co-accent-citrus);">{{ stats.customs }}</div>' +
    '<div style="font-size:0.75rem;color:var(--co-neutral-500);">定制需求</div></div>' +
    '</div>' +

    /* Menu Section */
    '<div class="card" style="overflow:hidden;padding:0;margin-bottom:12px;">' +
    '<div style="padding:12px 16px;font-size:0.75rem;font-weight:600;color:var(--co-neutral-500);text-transform:uppercase;letter-spacing:0.05em;background:var(--co-neutral-50);">常用功能</div>' +
    '<button v-for="item in menuItems" :key="item.key" class="profile-menu-btn" @click="goTo(item.key)">' +
    '<i :class="\'fas \'+item.icon" style="width:20px;color:var(--co-neutral-500);"></i>' +
    '<span style="flex:1;text-align:left;">{{ item.label }}</span>' +
    '<i class="fas fa-chevron-right" style="color:var(--co-neutral-300);font-size:0.7rem;"></i>' +
    '</button>' +
    '</div>' +

    /* Account Section */
    '<div class="card" style="overflow:hidden;padding:0;margin-bottom:12px;">' +
    '<div style="padding:12px 16px;font-size:0.75rem;font-weight:600;color:var(--co-neutral-500);text-transform:uppercase;letter-spacing:0.05em;background:var(--co-neutral-50);">账户信息</div>' +
    '<div style="padding:12px 16px;display:flex;justify-content:space-between;border-bottom:1px solid var(--co-neutral-100);"><span style="font-size:0.85rem;color:var(--co-neutral-600);">用户名</span><span style="font-size:0.85rem;font-weight:500;">{{ user?.username || "-" }}</span></div>' +
    '<div style="padding:12px 16px;display:flex;justify-content:space-between;border-bottom:1px solid var(--co-neutral-100);"><span style="font-size:0.85rem;color:var(--co-neutral-600);">角色</span><span style="font-size:0.85rem;font-weight:500;">{{ roleName }}</span></div>' +
    '<div style="padding:12px 16px;display:flex;justify-content:space-between;border-bottom:1px solid var(--co-neutral-100);"><span style="font-size:0.85rem;color:var(--co-neutral-600);">所在地</span><span style="font-size:0.85rem;font-weight:500;">{{ user?.location || "未设置" }}</span></div>' +
    '<div style="padding:12px 16px;display:flex;justify-content:space-between;"><span style="font-size:0.85rem;color:var(--co-neutral-600);">手机号</span><span style="font-size:0.85rem;font-weight:500;">{{ user?.phone || "未设置" }}</span></div>' +
    '</div>' +

    /* Logout */
    '<button class="btn btn-danger-ghost btn-block" style="justify-content:center;width:100%;padding:12px;" @click="doLogout"><i class="fas fa-sign-out-alt"></i> 退出登录</button>' +
    '</div>',
  data: function() {
    return {
      stats: { cart: 0, orders: 0, customs: 0 }
    };
  },
  mounted: function() { this.loadStats(); },
  computed: {
    user: function() { return window.App && window.App.currentUser; },
    initial: function() { return (this.user && this.user.name ? this.user.name : 'U')[0]; },
    roleName: function() {
      var roles = (window.App && window.App.roles) || {};
      var r = roles[this.user && this.user.role];
      return r ? r.name : (this.user && this.user.role || '');
    },
    menuItems: function() {
      var role = this.user && this.user.role;
      if (role === 'consumer') return [
        { key:'my-orders', icon:'fa-clipboard-list', label:'我的定制需求' },
        { key:'cart', icon:'fa-shopping-cart', label:'购物车 (' + this.stats.cart + ')' },
        { key:'messages', icon:'fa-envelope', label:'消息中心' },
      ];
      if (role === 'merchant') return [
        { key:'dashboard', icon:'fa-chart-pie', label:'商家工作台' },
        { key:'product-list', icon:'fa-boxes', label:'商品管理' },
        { key:'qualifications', icon:'fa-id-card', label:'我的资质' },
        { key:'orders', icon:'fa-truck', label:'订单管理' },
        { key:'messages', icon:'fa-envelope', label:'消息中心' },
      ];
      if (role === 'certifier') return [
        { key:'review-list', icon:'fa-check-double', label:'审核管理' },
        { key:'review-history', icon:'fa-history', label:'审核历史' },
        { key:'messages', icon:'fa-envelope', label:'消息中心' },
      ];
      if (role === 'admin') return [
        { key:'user-management', icon:'fa-users', label:'用户管理' },
        { key:'rule-management', icon:'fa-gear', label:'规则管理' },
        { key:'reports', icon:'fa-file-alt', label:'数据报表' },
      ];
      if (role === 'regulator') return [
        { key:'archive-search', icon:'fa-search', label:'档案查询' },
        { key:'emergency', icon:'fa-exclamation-triangle', label:'应急处理' },
      ];
      return [{ key:'discovery', icon:'fa-search', label:'发现好物' }];
    }
  },
  methods: {
    loadStats: function() {
      var user = this.user;
      this.stats.cart = (window.App && window.App.cart ? window.App.cart.length : 0);
      // Load order & custom order counts from API
      if (user) {
        var self = this;
        // Consumer orders
        API._fetch('/api/consumer/orders?consumer_id=' + user.id).then(function(r) {
          if (r && r.data) self.stats.orders = r.data.length;
        }).catch(function(){});
        // Custom orders
        API.getMyCustomOrders(user.id).then(function(r) {
          if (r && r.data) self.stats.customs = r.data.length;
        }).catch(function(){});
      }
    },
    goTo: function(page) { if (window.navigateTo) window.navigateTo(page); },
    doLogout: function() {
      localStorage.removeItem('agrichain_user');
      var keys = []; for (var i=0;i<localStorage.length;i++) { var k=localStorage.key(i); if (k&&k.indexOf('fruit_')===0) keys.push(k); }
      keys.forEach(function(k) { localStorage.removeItem(k); });
      if (window.App) { window.App.currentUser = null; window.App.currentRole = null; if (window.App.cart) window.App.cart.splice(0, window.App.cart.length); }
      location.reload();
    }
  }
};
