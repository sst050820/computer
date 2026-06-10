const VueMerchantOrders = {
  name: 'VueMerchantOrders',
  template: '<div>' +
    '<div class="card"><div class="card-header" style="display:flex;justify-content:space-between;">' +
    '<span style="display:flex;align-items:center;gap:8px;"><i class="fas fa-truck card-icon" style="background:var(--co-primary-50);color:var(--co-primary-500);"></i><span class="card-title">订单管理</span></span>' +
    '<span style="font-size:0.8rem;color:var(--co-neutral-500);">{{ orders.length }} 笔订单</span>' +
    '</div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="orders.length===0" icon="fa-truck" title="暂无订单" description="等待消费者下单" />' +
    '<div v-else>' +
    '<div v-for="o in orders" :key="o.id" class="card" style="padding:var(--sp-4);margin-bottom:10px;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--co-neutral-100);">' +
    '<span style="font-size:0.75rem;color:var(--co-neutral-500);">#{{ o.id }} | {{ o.created_at }}</span>' +
    '<base-badge :color="statusColor(o.status)">{{ statusLabel(o.status) }}</base-badge>' +
    '</div>' +
    '<div style="display:flex;gap:12px;align-items:center;">' +
    '<div style="width:48px;height:48px;border-radius:var(--rd-md);background:var(--co-neutral-50);display:flex;align-items:center;justify-content:center;font-size:1.5rem;">📦</div>' +
    '<div style="flex:1;">' +
    '<h4 style="font-size:0.95rem;font-weight:600;">{{ o.product_name }}</h4>' +
    '<p style="font-size:0.8rem;color:var(--co-neutral-500);">买家: {{ o.consumer_name }} | 数量: {{ o.quantity }} | 单价: ¥{{ (o.price||0).toFixed(1) }}</p>' +
    '</div>' +
    '<div style="text-align:right;">' +
    '<div style="font-size:1.1rem;font-weight:700;color:var(--co-accent-berry);">¥{{ (o.total||0).toFixed(1) }}</div>' +
    '<div style="display:flex;gap:6px;margin-top:6px;">' +
    '<base-button v-if="o.status===\'pending\'" size="sm" @click="updateStatus(o.id,\'confirmed\')">确认接单</base-button>' +
    '<base-button v-if="o.status===\'confirmed\'" size="sm" @click="updateStatus(o.id,\'shipped\')" style="background:var(--co-info);">发货</base-button>' +
    '<base-button v-if="o.status===\'shipped\'" size="sm" @click="updateStatus(o.id,\'delivered\')" style="background:var(--co-success);">标记送达</base-button>' +
    '<base-button v-if="o.status===\'delivered\'" size="sm" @click="updateStatus(o.id,\'completed\')" style="background:var(--co-success);">完成</base-button>' +
    '<base-button v-if=\"o.status!==\'completed\'&&o.status!==\'cancelled\'\" size="sm" variant="danger-ghost" @click="updateStatus(o.id,\'cancelled\')">取消</base-button>' +
    '</div></div></div>' +
    '<div v-if="o.remark" style="margin-top:8px;font-size:0.8rem;color:var(--co-neutral-500);background:var(--co-neutral-50);padding:6px 10px;border-radius:var(--rd-sm);">备注: {{ o.remark }}</div>' +
    '</div></div>' +
    '</div></div>',
  data: function() { return { orders: [], loading: true }; },
  mounted: function() {
    var self = this;
    var user = window.App.currentUser;
    if (!user) { self.loading = false; return; }
    API._fetch('/api/merchant/orders?merchant_id=' + user.id).then(function(res) {
      self.orders = res.data || [];
      self.loading = false;
    }).catch(function() { self.loading = false; });
  },
  methods: {
    statusColor: function(s) {
      var m = { pending:'amber', confirmed:'blue', shipped:'purple', delivered:'green', completed:'green', cancelled:'red' };
      return m[s] || 'neutral';
    },
    statusLabel: function(s) {
      var m = { pending:'待确认', confirmed:'已接单', shipped:'已发货', delivered:'已送达', completed:'已完成', cancelled:'已取消' };
      return m[s] || s;
    },
    updateStatus: function(id, status) {
      var self = this;
      API._fetch('/api/orders/' + id + '/status', {
        method: 'PUT',
        body: JSON.stringify({ status: status })
      }).then(function(res) {
        if (res.status === 'success') {
          window.showToast('订单已更新: ' + self.statusLabel(status), 'success');
          // Refresh
          self.loading = true;
          var user = window.App.currentUser;
          API._fetch('/api/merchant/orders?merchant_id=' + (user ? user.id : '')).then(function(r) {
            self.orders = r.data || [];
            self.loading = false;
          });
        }
      });
    }
  }
};
