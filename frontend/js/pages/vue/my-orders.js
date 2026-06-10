var VueMyOrders = {
  name: 'VueMyOrders',
  template: '<div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-clipboard-list card-icon" style="background:var(--co-primary-50);color:var(--co-primary-500);"></i><span class="card-title">我的定制需求</span></div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="orders.length===0" icon="fa-inbox" title="暂无定制需求">' +
    '<base-button variant="secondary" @click="goTo(\'custom-order\')"><i class="fas fa-plus"></i> 发布第一个定制</base-button>' +
    '</base-empty>' +
    '<div v-else>' +
    '<div v-for="o in orders" :key="o.id" class="card" style="margin-bottom:10px;padding:var(--sp-4);">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px solid var(--co-neutral-100);margin-bottom:8px;">' +
    '<span style="font-size:0.75rem;color:var(--co-neutral-500);">#{{ o.id }} | {{ o.created_at }}</span>' +
    '<div style="display:flex;gap:8px;align-items:center;">' +
    '<base-badge :color="o.status===\'active\'?\'green\':\'neutral\'">{{ o.status==="active"?"进行中":o.status }}</base-badge>' +
    '<button class="btn btn-danger-ghost btn-sm" style="min-width:auto;padding:4px 8px;" @click="delOrder(o.id)"><i class="fas fa-trash"></i></button>' +
    '</div></div>' +
    '<h4 style="font-size:0.95rem;">{{ o.title }}</h4>' +
    '<p style="font-size:0.8rem;color:var(--co-neutral-500);margin-top:4px;">预算：{{ o.budget }}</p>' +
    '<div v-if="(o.responses||[]).length>0" style="margin-top:8px;">' +
    '<div v-for="r in o.responses" :key="r.id" style="padding:8px 10px;background:var(--co-neutral-50);border-radius:var(--rd-sm);border-left:3px solid var(--co-primary-400);margin-top:6px;">' +
    '<div style="display:flex;justify-content:space-between;"><strong style="font-size:0.85rem;">{{ r.name }}</strong>' +
    '<span style="color:var(--co-accent-berry);font-weight:600;font-size:0.85rem;">报价：{{ r.price }}</span></div>' +
    '<small style="color:var(--co-neutral-500);">{{ r.message }}</small><br>' +
    '<small style="color:var(--co-neutral-500);">{{ r.created_at }}</small></div></div>' +
    '<p v-else style="font-size:0.8rem;color:var(--co-neutral-500);margin-top:8px;">暂无响应</p>' +
    '</div></div></div>' +
    '</div>',
  data: function() { return { orders: [], loading: true }; },
  mounted: function() { this.fetch(); },
  methods: {
    fetch: function() {
      var self = this;
      var user = window.App.currentUser;
      if (!user) { self.loading = false; return; }
      API.getMyCustomOrders(user.id).then(function(res) {
        self.orders = res.data || [];
        self.loading = false;
      }).catch(function() { self.loading = false; });
    },
    delOrder: function(id) {
      if (!confirm('确定删除这个需求吗？')) return;
      var self = this;
      API._fetch('/api/custom-orders/' + id, { method: 'DELETE' }).then(function(res) {
        if (res.status === 'success') {
          window.showToast && window.showToast('已删除', 'success');
          self.fetch();
        }
      }).catch(function() {
        window.showToast && window.showToast('删除失败', 'error');
      });
    },
    goTo: function(page) {
      if (window.navigateTo) window.navigateTo(page);
    }
  }
};
