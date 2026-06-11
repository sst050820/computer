var VueReports = {
  name: 'VueReports',
  template: '<div><base-loading v-if="loading" /><div v-else>' +
    '<div class="stat-grid"><div class="stat-card" style="text-align:center;"><h4>📊 用户增长</h4><div style="font-size:2rem;font-weight:700;color:var(--co-primary-500);">+{{ nu }}</div><div style="font-size:0.8rem;color:var(--co-neutral-500);">本月新增</div></div>' +
    '<div class="stat-card" style="text-align:center;"><h4>📝 交易量</h4><div style="font-size:2rem;font-weight:700;color:var(--co-info);">{{ s.orders }}</div><div style="font-size:0.8rem;color:var(--co-neutral-500);">累计订单</div></div>' +
    '<div class="stat-card" style="text-align:center;"><h4>🔼 资质认证</h4><div style="font-size:2rem;font-weight:700;color:var(--co-accent-citrus);">{{ s.activeQuals }}</div><div style="font-size:0.8rem;color:var(--co-neutral-500);">有效资质</div></div></div>' +
    '<div class="card" style="margin-top:16px;"><div class="card-header"><i class="fas fa-table card-icon" style="background:var(--co-primary-50);color:var(--co-primary-500);"></i><span class="card-title">数据汇总</span></div>' +
    '<table class="data-table"><thead><tr><th>指标</th><th>数值</th></tr></thead><tbody>' +
    '<tr><td>注册用户</td><td><strong>{{ s.users }}</strong></td></tr><tr><td>上架商品</td><td><strong>{{ s.products }}</strong></td></tr>' +
    '<tr><td>资质总数</td><td><strong>{{ s.quals }}</strong></td></tr><tr><td>定制需求</td><td><strong>{{ s.customs }}</strong></td></tr>' +
    '<tr><td>购买订单</td><td><strong>{{ s.orders }}</strong></td></tr><tr><td>有效资质</td><td><strong>{{ s.activeQuals }}</strong></td></tr>' +
    '</tbody></table></div></div></div>',
  data: function() { return { loading: true, nu: 2, s: { users:0, products:0, quals:0, customs:0, orders:0, activeQuals:0 } }; },
  mounted: function() { this.load(); },
  methods: {
    load: function() {
      var self = this;
      Promise.all([API.getAllUsers(), API._fetch('/api/products'), API.getAllQualifications(), API._fetch('/api/admin/orders'), API._fetch('/api/merchant/orders?merchant_id=')]).then(function(results) {
        var users = (results[0]&&results[0].data)||[], prods = (results[1]&&results[1].data)||[], quals = (results[2]&&results[2].data)||[];
        var customs = (results[3]&&results[3].data)||[], orders = (results[4]&&results[4].data)||[];
        self.s.users=users.length; self.s.products=prods.length; self.s.quals=quals.length; self.s.customs=customs.length; self.s.orders=orders.length;
        self.s.activeQuals=quals.filter(function(q){return q.status==='active';}).length;
        self.loading=false;
      }).catch(function(){self.loading=false;});
    }
  }
};
