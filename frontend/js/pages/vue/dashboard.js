/* VueDashboard — Merchant Dashboard */
const VueDashboard = {
  name: 'VueDashboard',
  template: '<div>' +
    '<base-loading v-if="loading" />' +
    '<div v-else>' +
    /* Stats */
    '<div class="stat-grid">' +
    '<div class="stat-card">' +
    '<div class="stat-label"><i class="fas fa-boxes" style="color:var(--co-primary-500);"></i> 商品数</div>' +
    '<div class="stat-value">{{ productCount }}</div>' +
    '<div class="stat-sub">已上架商品</div></div>' +
    '<div class="stat-card">' +
    '<div class="stat-label"><i class="fas fa-bullseye" style="color:var(--co-primary-500);"></i> 匹配需求</div>' +
    '<div class="stat-value">{{ matchedDemands }}</div>' +
    '<div class="stat-sub">可接单的定制</div></div>' +
    '<div class="stat-card">' +
    '<div class="stat-label"><i class="fas fa-id-card" style="color:var(--co-accent-citrus);"></i> 有效资质</div>' +
    '<div class="stat-value">{{ activeQuals }}</div>' +
    '<div class="stat-sub">已认证资质</div></div>' +
    '</div>' +
    /* Quick actions */
    '<div class="grid-2" style="margin-top:var(--sp-6);">' +
    '<div class="card">' +
    '<div class="card-header"><i class="fas fa-clock card-icon" style="background:var(--co-primary-50);color:var(--co-primary-500);"></i><span class="card-title">待办事项</span></div>' +
    '<p v-if="matchedDemands > 0" style="margin-bottom:4px;">📦 <a href="#" @click.prevent="goTo(\'demand-market\')">{{ matchedDemands }} 条匹配需求</a></p>' +
    '<p v-if="expiringQuals > 0" style="color:var(--co-warning);margin-bottom:4px;">⚠️ {{ expiringQuals }} 项资质即将到期</p>' +
    '<p v-if="matchedDemands === 0 && expiringQuals === 0" style="color:var(--co-neutral-500);">暂无待办</p>' +
    '</div>' +
    '<div class="card">' +
    '<div class="card-header"><i class="fas fa-chart-line card-icon" style="background:#e0f2fe;color:var(--co-info);"></i><span class="card-title">快捷操作</span></div>' +
    '<base-button variant="secondary" size="sm" @click="goTo(\'product-list\')" style="margin-right:8px;"><i class="fas fa-boxes"></i> 商品管理</base-button>' +
    '<base-button variant="secondary" size="sm" @click="goTo(\'demand-market\')" style="margin-right:8px;"><i class="fas fa-bullseye"></i> 需求市场</base-button>' +
    '<base-button variant="secondary" size="sm" @click="goTo(\'qualifications\')"><i class="fas fa-id-card"></i> 我的资质</base-button>' +
    '</div></div></div>' +
    '</div>',
  data: function() {
    return {
      loading: true,
      productCount: 0,
      matchedDemands: 0,
      activeQuals: 0,
      expiringQuals: 0
    };
  },
  mounted: function() {
    var self = this;
    var user = window.App.currentUser;
    if (!user) { self.loading = false; return; }
    Promise.all([
      API.getMyQualifications(user.id),
      API.getMyProducts(user.id),
      API.getDemandMarket(user.id)
    ]).then(function(results) {
      var quals = results[0].data || [];
      var prods = results[1].data || [];
      var dems = results[2].data || [];
      self.productCount = prods.length;
      self.matchedDemands = dems.filter(function(d) { return d.matched; }).length;
      self.activeQuals = quals.filter(function(q) { return q.status === 'active'; }).length;
      self.expiringQuals = quals.filter(function(q) { return q.status === 'active' && q.ExpiresAt && q.ExpiresAt <= '2026-09-01'; }).length;
      self.loading = false;
    }).catch(function() {
      self.loading = false;
    });
  },
  methods: {
    goTo: function(page) { if (window.navigateTo) window.navigateTo(page); }
  }
};
