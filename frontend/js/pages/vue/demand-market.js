/* VueDemandMarket — Merchant: Demand Market */
const VueDemandMarket = {
  name: 'VueDemandMarket',
  template: '<div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-bullseye card-icon" style="background:#e0f2fe;color:var(--co-info);"></i><span class="card-title">需求市场</span></div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="demands.length === 0" icon="fa-bullseye" title="暂无匹配需求" description="申请更多资质后可匹配更多定制需求" />' +
    '<div v-else>' +
    '<div v-for="d in demands" :key="d.id" class="card" style="margin-bottom:10px;padding:var(--sp-4);">' +
    '<div style="display:flex;justify-content:space-between;align-items:start;">' +
    '<h4 style="font-size:1rem;font-weight:600;">{{ d.title }}</h4>' +
    '<base-badge :color="d.matched ? \'green\' : \'neutral\'">{{ d.matched ? "✅ 已匹配" : "未匹配" }}</base-badge>' +
    '</div>' +
    '<p style="font-size:0.85rem;color:var(--co-neutral-500);margin-top:4px;">预算：{{ d.budget }} | {{ d.location || "" }}</p>' +
    '<p style="font-size:0.8rem;color:var(--co-neutral-600);margin-top:4px;" v-if="d.policy">{{ d.policy }}</p>' +
    '</div></div></div>' +
    '</div>',
  data: function() { return { demands: [], loading: true }; },
  mounted: function() {
    var self = this;
    var user = window.App.currentUser;
    if (!user) { self.loading = false; return; }
    API.getDemandMarket(user.id).then(function(res) {
      self.demands = res.data || [];
      self.loading = false;
    }).catch(function() { self.loading = false; });
  }
};
