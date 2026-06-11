var VueStatistics = {
  name: 'VueStatistics',
  template: '<div><base-loading v-if="loading" /><div v-else>' +
    '<div class="stat-grid">' +
    '<div class="stat-card"><div class="stat-label"><i class="fas fa-users" style="color:var(--co-primary-500);"></i> 平台用户</div><div class="stat-value">{{ s.users }}</div><div class="stat-sub">注册用户总数</div></div>' +
    '<div class="stat-card"><div class="stat-label"><i class="fas fa-boxes" style="color:var(--co-info);"></i> 商品总数</div><div class="stat-value">{{ s.products }}</div><div class="stat-sub">已上架商品</div></div>' +
    '<div class="stat-card"><div class="stat-label"><i class="fas fa-id-card" style="color:var(--co-accent-citrus);"></i> 资质总量</div><div class="stat-value">{{ s.quals }}</div><div class="stat-sub">全部资质</div></div></div>' +
    '<div class="stat-grid" style="margin-top:16px;">' +
    '<div class="stat-card"><div class="stat-label"><i class="fas fa-file-alt" style="color:#8b5cf6;"></i> 定制需求</div><div class="stat-value">{{ s.customs }}</div><div class="stat-sub">发布总数</div></div>' +
    '<div class="stat-card"><div class="stat-label"><i class="fas fa-truck" style="color:var(--co-success);"></i> 购买订单</div><div class="stat-value">{{ s.orders }}</div><div class="stat-sub">交易总数</div></div>' +
    '<div class="stat-card"><div class="stat-label"><i class="fas fa-check-circle" style="color:#10b981;"></i> 有效资质</div><div class="stat-value">{{ s.activeQuals }}</div><div class="stat-sub">当前有效</div></div></div>' +
    '<div class="card" style="margin-top:16px;"><div class="card-header"><i class="fas fa-chart-pie card-icon" style="background:var(--co-primary-50);color:var(--co-primary-500);"></i><span class="card-title">角色分布</span></div>' +
    '<div style="display:flex;gap:16px;flex-wrap:wrap;"><div v-for="r in roles" style="flex:1;min-width:100px;text-align:center;padding:12px;background:var(--co-neutral-50);border-radius:var(--rd-md);"><div style="font-size:1.5rem;font-weight:700;">{{ r.count }}</div><div style="font-size:0.8rem;color:var(--co-neutral-500);">{{ r.label }}</div></div></div></div></div></div>',
  data: function() { return { loading: true, s: { users:0, products:0, quals:0, customs:0, orders:0, activeQuals:0 }, roles: [] }; },
  mounted: function() { this.loadAll(); },
  methods: {
    loadAll: function() {
      var self = this;
      Promise.all([API.getAllUsers(), API._fetch('/api/products'), API.getAllQualifications(), API._fetch('/api/admin/orders'), API._fetch('/api/merchant/orders?merchant_id=')]).then(function(results) {
        var users = (results[0]&&results[0].data)||[], prods = (results[1]&&results[1].data)||[], quals = (results[2]&&results[2].data)||[];
        var customs = (results[3]&&results[3].data)||[], orders = (results[4]&&results[4].data)||[];
        self.s.users=users.length; self.s.products=prods.length; self.s.quals=quals.length; self.s.customs=customs.length; self.s.orders=orders.length;
        self.s.activeQuals=quals.filter(function(q){return q.status==='active';}).length;
        var rm={}; users.forEach(function(u){rm[u.role]=(rm[u.role]||0)+1;});
        var names={consumer:'消费者',merchant:'商家',certifier:'审核方',admin:'管理员',regulator:'监管方'};
        var rl=[]; for(var k in names) rl.push({key:k,label:names[k],count:rm[k]||0});
        self.roles=rl; self.loading=false;
      }).catch(function(){self.loading=false;});
    }
  }
};
