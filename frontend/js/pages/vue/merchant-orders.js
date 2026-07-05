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
    /* Order Card */
    '<div v-for="o in orders" :key="o.id" class="card" style="padding:0;margin-bottom:12px;overflow:hidden;cursor:pointer;" @click="openDetail(o)">' +
    /* Header bar */
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:var(--co-neutral-50);border-bottom:1px solid var(--co-neutral-100);">' +
    '<div style="display:flex;align-items:center;gap:12px;">' +
    '<span style="font-size:0.8rem;font-weight:600;color:var(--co-neutral-700);">#{{ o.id }}</span>' +
    '<span style="font-size:0.75rem;color:var(--co-neutral-400);">{{ o.created_at }}</span>' +
    '</div>' +
    '<base-badge :color="statusColor(o.status)">{{ statusLabel(o.status) }}</base-badge>' +
    '</div>' +
    /* Body */
    '<div style="padding:14px 16px;">' +
    '<div style="display:flex;gap:14px;align-items:center;">' +
    '<div class="cart-pay-img" style="width:52px;height:52px;font-size:1.4rem;"><img v-if="imageSrc(o)" :src="imageSrc(o)" :alt="o.product_name" /><span v-else>{{ imageEmoji(o) }}</span></div>' +
    '<div style="flex:1;min-width:0;">' +
    '<h4 style="font-size:0.95rem;font-weight:600;margin-bottom:4px;">{{ o.product_name }}</h4>' +
    '<div style="display:flex;flex-wrap:wrap;gap:6px 16px;font-size:0.8rem;color:var(--co-neutral-500);">' +
    '<span><i class="fas fa-user"></i> {{ o.consumer_name }}</span>' +
    '<span>×{{ o.quantity }}</span>' +
    '<span>单价 ¥{{ (o.price||0).toFixed(1) }}</span>' +
    '</div></div>' +
    '<div style="text-align:right;flex-shrink:0;">' +
    '<div style="font-size:1.2rem;font-weight:700;color:var(--co-accent-berry);">¥{{ (o.total||0).toFixed(1) }}</div>' +
    '</div></div>' +
    /* Remark */
    '<div v-if="o.remark" style="margin-top:10px;font-size:0.78rem;color:var(--co-neutral-500);background:var(--co-neutral-50);padding:6px 10px;border-radius:var(--rd-sm);"><i class="fas fa-sticky-note"></i> {{ o.remark }}</div>' +
    '</div>' +
    /* Action Bar */
    '<div style="padding:14px 18px;border-top:1px solid var(--co-neutral-200);background:#fff;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">' +
    '<span style="font-size:0.72rem;font-weight:600;color:var(--co-neutral-400);letter-spacing:0.06em;flex-shrink:0;">操作</span>' +
    /* 确认接单 */
    '<button v-if="o.status===\'pending\'" @click.stop="updateStatus(o.id,\'confirmed\')" ' +
    'style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;border:none;border-radius:var(--rd-md);font-size:0.84rem;font-weight:600;cursor:pointer;' +
    'background:linear-gradient(135deg,#2D6A4F,#40916C);color:#fff;box-shadow:0 2px 8px rgba(45,106,79,0.25);transition:all 0.2s;" ' +
    'onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 4px 14px rgba(45,106,79,0.35)\'" ' +
    'onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 8px rgba(45,106,79,0.25)\'" ' +
    '><i class="fas fa-check-circle"></i> 确认接单</button>' +
    /* 发货 */
    '<button v-if="o.status===\'confirmed\'" @click.stop="updateStatus(o.id,\'shipped\')" ' +
    'style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;border:none;border-radius:var(--rd-md);font-size:0.84rem;font-weight:600;cursor:pointer;' +
    'background:linear-gradient(135deg,#3A7CA5,#4A90B8);color:#fff;box-shadow:0 2px 8px rgba(58,124,165,0.25);transition:all 0.2s;" ' +
    'onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 4px 14px rgba(58,124,165,0.35)\'" ' +
    'onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 8px rgba(58,124,165,0.25)\'" ' +
    '><i class="fas fa-truck-fast"></i> 发货</button>' +
    /* 标记送达 */
    '<button v-if="o.status===\'shipped\'" @click.stop="updateStatus(o.id,\'delivered\')" ' +
    'style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;border:none;border-radius:var(--rd-md);font-size:0.84rem;font-weight:600;cursor:pointer;' +
    'background:linear-gradient(135deg,#D97706,#E8964A);color:#fff;box-shadow:0 2px 8px rgba(217,119,6,0.25);transition:all 0.2s;" ' +
    'onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 4px 14px rgba(217,119,6,0.35)\'" ' +
    'onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 8px rgba(217,119,6,0.25)\'" ' +
    '><i class="fas fa-box-open"></i> 标记送达</button>' +
    /* 完成 */
    '<button v-if="o.status===\'delivered\'" @click.stop="updateStatus(o.id,\'completed\')" ' +
    'style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;border:none;border-radius:var(--rd-md);font-size:0.84rem;font-weight:600;cursor:pointer;' +
    'background:linear-gradient(135deg,#1B5E20,#2E7D32);color:#fff;box-shadow:0 2px 8px rgba(27,94,32,0.25);transition:all 0.2s;" ' +
    'onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 4px 14px rgba(27,94,32,0.35)\'" ' +
    'onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 8px rgba(27,94,32,0.25)\'" ' +
    '><i class="fas fa-check-double"></i> 完成订单</button>' +
    /* 取消 */
    '<button v-if=\"o.status!==\'completed\'&&o.status!==\'cancelled\'\" @click.stop="updateStatus(o.id,\'cancelled\')" ' +
    'style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;border:1.5px solid #e0c0c0;border-radius:var(--rd-md);font-size:0.84rem;font-weight:500;cursor:pointer;' +
    'background:#fff;color:#B85450;transition:all 0.2s;" ' +
    'onmouseover="this.style.background=\'#fef5f5\';this.style.borderColor=\'#D14343\';this.style.color=\'#D14343\'" ' +
    'onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'#e0c0c0\';this.style.color=\'#B85450\'" ' +
    '><i class="fas fa-xmark"></i> 取消订单</button>' +
    '<button v-if="o.status===\'completed\'||o.status===\'cancelled\'" @click.stop="deleteOrder(o.id)" ' +
    'style="display:inline-flex;align-items:center;gap:5px;padding:8px 20px;border:1.5px solid #e0c0c0;border-radius:var(--rd-md);font-size:0.84rem;font-weight:500;cursor:pointer;' +
    'background:#fff;color:#B85450;transition:all 0.2s;" ' +
    'onmouseover="this.style.background=\'#fef5f5\';this.style.borderColor=\'#D14343\';this.style.color=\'#D14343\'" ' +
    'onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'#e0c0c0\';this.style.color=\'#B85450\'" ' +
    '><i class="fas fa-trash-can"></i> 删除订单</button>' +
    '</div>' +
    '</div></div>' +
    '</div></div>' +
    /* Detail Modal */
    '<div v-if="detail" class="modal-overlay" @click.self="detail=null"><div class="modal-content" style="max-width:500px;">' +
    '<div class="modal-header"><h3 class="modal-title">订单详情 #{{ detail.id }}</h3><button class="modal-close" @click="detail=null"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">' +
    '<div class="cart-pay-img" style="width:56px;height:56px;font-size:1.6rem;"><img v-if="imageSrc(detail)" :src="imageSrc(detail)" :alt="detail.product_name" /><span v-else>{{ imageEmoji(detail) }}</span></div>' +
    '<div><h4 style="font-size:1rem;">{{ detail.product_name }}</h4><p style="font-size:0.8rem;color:var(--co-neutral-500);">买家: {{ detail.consumer_name }} · ¥{{ (detail.total||0).toFixed(1) }}</p></div></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;font-size:0.84rem;">' +
    '<div><span style="color:var(--co-neutral-500);">状态</span><div style="font-weight:600;"><base-badge :color="statusColor(detail.status)">{{ statusLabel(detail.status) }}</base-badge></div></div>' +
    '<div><span style="color:var(--co-neutral-500);">数量</span><div style="font-weight:600;">×{{ detail.quantity }}</div></div>' +
    '<div><span style="color:var(--co-neutral-500);">单价</span><div style="font-weight:600;">¥{{ (detail.price||0).toFixed(1) }}</div></div>' +
    '<div><span style="color:var(--co-neutral-500);">总价</span><div style="font-weight:700;color:var(--co-accent-berry);">¥{{ (detail.total||0).toFixed(1) }}</div></div></div>' +
    '<div v-if="detail.remark" style="margin-top:12px;padding:8px 12px;background:var(--co-neutral-50);border-radius:var(--rd-sm);font-size:0.82rem;color:var(--co-neutral-600);"><i class="fas fa-sticky-note"></i> {{ detail.remark }}</div>' +
    '<button @click="detail=null" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;width:100%;margin-top:16px;padding:10px 20px;border:1px solid var(--co-neutral-300);border-radius:var(--rd-md);font-size:0.88rem;font-weight:500;cursor:pointer;background:#fff;color:var(--co-neutral-600);transition:all 0.2s;" onmouseover="this.style.background=\'var(--co-neutral-50)\'" onmouseout="this.style.background=\'#fff\'">关闭</button>' +
    '</div></div></div>',
  data: function() { return { orders: [], loading: true, detail: null }; },
  mounted: function() { this.fetch(); },
  methods: {
    fetch: function() {
      var self = this;
      var user = window.App.currentUser;
      if (!user) { self.loading = false; return; }
      Promise.all([API._fetch('/api/merchant/orders?merchant_id=' + user.id), API._fetch('/api/products')]).then(function(results) {
        self.orders = self.attachProductImages((results[0] && results[0].data) || [], (results[1] && results[1].data) || []);
        self.loading = false;
      }).catch(function() { self.loading = false; });
    },
    attachProductImages: function(orders, products) {
      var productMap = {};
      (products || []).forEach(function(p) { if (p && p.id) productMap[p.id] = p; });
      return (orders || []).map(function(o) {
        var p = productMap[o.product_id];
        if (p && p.image) o.product_image = p.image;
        return o;
      });
    },
    imageSrc: function(order) {
      return order && order.product_image && order.product_image.length > 6 ? order.product_image : '';
    },
    imageEmoji: function(order) {
      return order && order.product_image && order.product_image.length <= 6 ? order.product_image : '📦';
    },
    statusColor: function(s) {
      var m = { pending:'amber', confirmed:'blue', shipped:'purple', delivered:'green', completed:'green', cancelled:'red' };
      return m[s] || 'neutral';
    },
    statusLabel: function(s) {
      var m = { pending:'待确认', confirmed:'已接单', shipped:'已发货', delivered:'已送达', completed:'已完成', cancelled:'已取消' };
      return m[s] || s;
    },
    openDetail: function(o) { this.detail = o; },
    deleteOrder: function(id) {
      if (!confirm('确定要删除订单 #' + id + ' 吗？此操作不可恢复。')) return;
      var self = this;
      API._fetch('/api/orders/' + id, { method: 'DELETE' }).then(function(res) {
        if (res.status === 'success') {
          window.showToast('订单已删除', 'success');
          self.orders = self.orders.filter(function(o) { return o.id !== id; });
        } else {
          window.showToast((res && res.error) || '删除失败', 'error');
        }
      }).catch(function() { window.showToast('网络错误', 'error'); });
    },
    updateStatus: function(id, status) {
      var self = this;
      API._fetch('/api/orders/' + id + '/status', {
        method: 'PUT',
        body: JSON.stringify({ status: status })
      }).then(function(res) {
        if (res.status === 'success') {
          window.showToast('订单已更新: ' + self.statusLabel(status), 'success');
          self.loading = true;
          self.fetch();
        }
      });
    }
  }
};
