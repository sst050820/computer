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
    '<a v-if="matchedDemands > 0" href="#" @click.prevent="goTo(\'demand-market\')" style="display:block;padding:8px 12px;margin-bottom:6px;border-radius:var(--rd-sm);color:var(--co-primary-600);font-weight:600;font-size:0.85rem;text-decoration:none;background:var(--co-primary-50);transition:all 0.2s;" onmouseover="this.style.background=\'var(--co-primary-100)\';this.style.transform=\'translateX(3px)\'" onmouseout="this.style.background=\'var(--co-primary-50)\';this.style.transform=\'none\'">📦 {{ matchedDemands }} 条匹配需求 →</a>' +
    '<p v-if="expiringQuals > 0" style="color:var(--co-warning);margin-bottom:4px;">⚠️ {{ expiringQuals }} 项资质即将到期</p>' +
    '<p v-if="matchedDemands === 0 && expiringQuals === 0" style="color:var(--co-neutral-500);">暂无待办</p>' +
    '</div>' +
    '<div class="card">' +
    '<div class="card-header"><i class="fas fa-chart-line card-icon" style="background:#e0f2fe;color:var(--co-info);"></i><span class="card-title">快捷操作</span></div>' +
    '<button @click="goTo(\'product-list\')" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;margin:3px 6px 3px 0;border:none;border-radius:var(--rd-sm);font-size:0.82rem;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#2D6A4F,#40916C);color:#fff;box-shadow:0 2px 6px rgba(45,106,79,0.2);transition:all 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 3px 10px rgba(45,106,79,0.3)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 6px rgba(45,106,79,0.2)\'"><i class="fas fa-boxes"></i> 商品管理</button>' +
    '<button @click="goTo(\'demand-market\')" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;margin:3px 6px 3px 0;border:none;border-radius:var(--rd-sm);font-size:0.82rem;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#3A7CA5,#4A90B8);color:#fff;box-shadow:0 2px 6px rgba(58,124,165,0.2);transition:all 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 3px 10px rgba(58,124,165,0.3)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 6px rgba(58,124,165,0.2)\'"><i class="fas fa-bullseye"></i> 需求市场</button>' +
    '<button @click="goTo(\'qualifications\')" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;margin:3px 0;border:none;border-radius:var(--rd-sm);font-size:0.82rem;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#D97706,#E8964A);color:#fff;box-shadow:0 2px 6px rgba(217,119,6,0.2);transition:all 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 3px 10px rgba(217,119,6,0.3)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 6px rgba(217,119,6,0.2)\'"><i class="fas fa-id-card"></i> 我的资质</button>' +
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
      var now = new Date(); now.setMonth(now.getMonth()+1); var threshold = now.toISOString().substring(0,10);
      self.expiringQuals = quals.filter(function(q) { return q.status === 'active' && q.expires_at && q.expires_at <= threshold; }).length;
      self.loading = false;
    }).catch(function() {
      self.loading = false;
    });
  },
  methods: {
    goTo: function(page) { if (window.navigateTo) window.navigateTo(page); }
  }
};
