/* VueMyOrders — Consumer: view custom orders with clickable responses & accept quote */
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
    '<base-badge :color="o.status===\'active\'?\'green\':o.status===\'accepted\'?\'blue\':\'neutral\'">{{ o.status==="active"?"进行中":o.status==="accepted"?"已接受":o.status }}</base-badge>' +
    '<button class="btn btn-danger-ghost btn-sm" style="min-width:auto;padding:4px 8px;" @click="delOrder(o.id)"><i class="fas fa-trash"></i></button>' +
    '</div></div>' +
    '<h4 style="font-size:0.95rem;">{{ o.title }}</h4>' +
    '<p style="font-size:0.8rem;color:var(--co-neutral-500);margin-top:4px;">预算：{{ o.budget }}</p>' +
    '<p v-if="o.contact" style="font-size:0.8rem;color:var(--co-neutral-500);margin-top:2px;"><i class="fas fa-phone"></i> 联系方式：{{ o.contact }}</p>' +
    '<p v-if="o.address" style="font-size:0.8rem;color:var(--co-neutral-500);margin-top:2px;"><i class="fas fa-map-marker-alt"></i> 快递地址：{{ o.address }}</p>' +
    /* Responses section */
    '<div v-if="(o.responses||[]).length>0" style="margin-top:8px;">' +
    '<p style="font-size:0.75rem;color:var(--co-neutral-400);margin-bottom:6px;"><i class="fas fa-reply-all"></i> {{ o.responses.length }} 个商家响应（点击查看详情）</p>' +
    '<div v-for="r in o.responses" :key="r.id" @click="openResp(o, r)" style="padding:10px 12px;background:var(--co-neutral-50);border-radius:var(--rd-sm);border-left:4px solid var(--co-primary-400);margin-top:6px;cursor:pointer;transition:all 0.15s;" onmouseover="this.style.background=\'#e8f0fe\'" onmouseout="this.style.background=\'var(--co-neutral-50)\'">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;">' +
    '<strong style="font-size:0.85rem;display:flex;align-items:center;gap:6px;">{{ r.name }} <span v-if="r.id===o._accepted" style="font-size:0.65rem;background:var(--co-success);color:#fff;padding:1px 6px;border-radius:3px;">已接受</span></strong>' +
    '<span style="color:var(--co-accent-berry);font-weight:600;font-size:0.85rem;">报价：{{ r.price }}</span>' +
    '</div>' +
    '<small style="color:var(--co-neutral-500);">{{ r.message }}</small><br>' +
    '<small style="color:var(--co-neutral-400);">{{ r.created_at }}</small>' +
    '</div></div>' +
    '<p v-else style="font-size:0.8rem;color:var(--co-neutral-500);margin-top:8px;">暂无商家响应</p>' +
    '</div></div></div>' +
    /* Response Detail Modal */
    '<div v-if="detailResp" class="modal-overlay" @click.self="detailResp=null">' +
    '<div class="modal-content" style="max-width:520px;">' +
    '<div class="modal-header"><h3 class="modal-title">商家报价详情</h3><button class="modal-close" @click="detailResp=null"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">' +
    '<div style="width:48px;height:48px;border-radius:50%;background:var(--co-primary-100);display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:var(--co-primary-500);"><i class="fas fa-store"></i></div>' +
    '<div><strong style="font-size:1.05rem;">{{ detailResp.name }}</strong><p style="font-size:0.75rem;color:var(--co-neutral-500);">{{ detailResp.created_at }}</p></div>' +
    '</div>' +
    '<div style="display:grid;gap:12px;">' +
    '<div><span style="color:var(--co-neutral-500);font-size:0.8rem;">报价金额</span><div style="font-weight:700;font-size:1.2rem;color:var(--co-accent-berry);">{{ detailResp.price }}</div></div>' +
    '<div><span style="color:var(--co-neutral-500);font-size:0.8rem;">商家留言</span><div style="background:var(--co-neutral-50);border-radius:var(--rd-sm);padding:12px;font-size:0.9rem;line-height:1.6;white-space:pre-wrap;">{{ detailResp.message||"（无留言）" }}</div></div>' +
    '<div><span style="color:var(--co-neutral-500);font-size:0.8rem;">您的需求</span><div style="font-size:0.9rem;color:var(--co-neutral-700);"><strong>{{ detailOrder.title }}</strong> · 预算：{{ detailOrder.budget }}</div></div>' +
    '</div>' +
    /* Actions */
    '<div v-if="detailOrder._accepted === detailResp.id" style="margin-top:16px;padding:12px;background:#e8f5ee;border-radius:var(--rd-md);text-align:center;color:var(--co-success);font-weight:600;">' +
    '<i class="fas fa-check-circle"></i> 已接受此报价，订单已创建</div>' +
    '<div v-else-if="detailOrder._accepted" style="margin-top:16px;padding:12px;background:var(--co-neutral-50);border-radius:var(--rd-md);text-align:center;color:var(--co-neutral-500);">已接受其他商家报价</div>' +
    '<div v-else style="margin-top:16px;display:flex;gap:8px;">' +
    '<button @click="acceptQuote" :disabled="accepting" ' +
    'style="display:inline-flex;align-items:center;gap:6px;flex:1;justify-content:center;padding:10px 20px;border:none;border-radius:var(--rd-md);font-size:0.88rem;font-weight:600;cursor:pointer;' +
    'background:linear-gradient(135deg,#2D6A4F,#40916C);color:#fff;box-shadow:0 2px 8px rgba(45,106,79,0.25);transition:all 0.2s;" ' +
    'onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 4px 14px rgba(45,106,79,0.35)\'" ' +
    'onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 8px rgba(45,106,79,0.25)\'" ' +
    '><i v-if="accepting" class="fas fa-spinner fa-spin"></i><i v-else class="fas fa-check"></i> 接受报价并下单</button>' +
    '<button @click="detailResp=null" ' +
    'style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border:1px solid var(--co-neutral-300);border-radius:var(--rd-md);font-size:0.88rem;font-weight:500;cursor:pointer;' +
    'background:#fff;color:var(--co-neutral-600);transition:all 0.2s;" ' +
    'onmouseover="this.style.background=\'var(--co-neutral-50)\';this.style.borderColor=\'var(--co-neutral-400)\'" ' +
    'onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'var(--co-neutral-300)\'" ' +
    '>关闭</button>' +
    '</div>' +
    '</div></div></div>' +
    '</div>',
  data: function() { return { orders: [], loading: true, detailResp: null, detailOrder: null, accepting: false }; },
  mounted: function() { this.fetch(); },
  methods: {
    fetch: function() {
      var self = this;
      var user = window.App && window.App.currentUser;
      if (!user) { self.loading = false; return; }
      API.getMyCustomOrders(user.id).then(function(res) {
        self.orders = res.data || [];
        // Restore accepted state from localStorage
        var accepted = self.getAcceptedMap();
        self.orders.forEach(function(o) {
          if (accepted[o.id]) o._accepted = accepted[o.id];
        });
        self.loading = false;
        // Auto-create messages for new responses
        self.checkNewResponses();
      }).catch(function() { self.loading = false; });
    },
    openResp: function(order, resp) {
      this.detailOrder = order;
      this.detailResp = resp;
    },
    acceptQuote: function() {
      var self = this;
      if (!confirm('确定接受「' + this.detailResp.name + '」的报价 ' + this.detailResp.price + ' 吗？\n\n接受后将自动创建采购订单。')) return;
      this.accepting = true;
      var user = window.App && window.App.currentUser;
      // Create order from the accepted response
      API._fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          consumer_id: user ? user.id : '',
          consumer_name: user ? user.name : '',
          merchant_id: this.detailResp.merchant_id || '',
          product_id: this.detailOrder.id,
          product_name: this.detailOrder.title,
          quantity: 1,
          price: parseFloat(this.detailResp.price) || 0,
          remark: '来自定制需求「' + this.detailOrder.title + '」的报价接受'
        })
      }).then(function(r) {
        self.accepting = false;
        if (r && r.status === 'success') {
          // Mark as accepted & update custom order status
          self.detailOrder._accepted = self.detailResp.id;
          self.detailOrder.status = 'accepted';
          self.saveAccepted(self.detailOrder.id, self.detailResp.id);
          // Update custom order status on backend
          API._fetch('/api/custom-orders/'+self.detailOrder.id+'/status', {method:'PUT', body:JSON.stringify({status:'accepted'})});
          // Create message for consumer
          self.addMessage('订单已创建', '您已接受「' + self.detailResp.name + '」的报价 ' + self.detailResp.price + '，订单 ' + (r.data ? r.data.id : '') + ' 已生成，请等待商家发货。', '#4CAF50', 'fa-check-circle');
          window.showToast && window.showToast('已接受报价，订单已创建！', 'success');
          self.detailResp = null;
        } else {
          window.showToast && window.showToast((r && r.error) || '下单失败', 'error');
        }
      }).catch(function() {
        self.accepting = false;
        window.showToast && window.showToast('网络错误', 'error');
      });
    },
    delOrder: function(id) {
      if (!confirm('确定删除这个需求吗？')) return;
      var self = this;
      API._fetch('/api/custom-orders/' + id, { method: 'DELETE' }).then(function(res) {
        if (res.status === 'success') {
          window.showToast && window.showToast('已删除', 'success');
          self.fetch();
        }
      }).catch(function() { window.showToast && window.showToast('删除失败', 'error'); });
    },
    goTo: function(page) {
      if (window.navigateTo) window.navigateTo(page);
    },
    // ---- Accepted state persistence ----
    getAcceptedMap: function() {
      var uid = (window.App && window.App.currentUser) ? window.App.currentUser.id : 'guest';
      try { var s = localStorage.getItem('fruit_accepted_' + uid); return s ? JSON.parse(s) : {}; } catch(e) { return {}; }
    },
    saveAccepted: function(orderId, respId) {
      var uid = (window.App && window.App.currentUser) ? window.App.currentUser.id : 'guest';
      var map = this.getAcceptedMap(); map[orderId] = respId;
      try { localStorage.setItem('fruit_accepted_' + uid, JSON.stringify(map)); } catch(e) {}
    },
    // ---- Auto-generate messages for new responses ----
    checkNewResponses: function() {
      var uid = (window.App && window.App.currentUser) ? window.App.currentUser.id : 'guest';
      var seenKey = 'fruit_seen_resp_' + uid;
      var seen = {};
      try { var s = localStorage.getItem(seenKey); seen = s ? JSON.parse(s) : {}; } catch(e) {}
      var self = this;
      var newCount = 0;
      this.orders.forEach(function(o) {
        (o.responses || []).forEach(function(r) {
          var rid = o.id + '_' + r.id;
          if (!seen[rid]) {
            seen[rid] = true;
            newCount++;
            self.addMessage('商家响应', '「' + r.name + '」对您的需求「' + o.title + '」报价 ' + r.price + '：' + (r.message || '无留言'), '#4A90B8', 'fa-reply');
          }
        });
      });
      try { localStorage.setItem(seenKey, JSON.stringify(seen)); } catch(e) {}
      if (newCount > 0 && window.__vueApp) {
        // Trigger sidebar message count update
        var msgsComp = window.__vueApp._instance;
        if (msgsComp && msgsComp.refs) { /* will be picked up on next messages page visit */ }
      }
    },
    addMessage: function(from, text, color, icon) {
      var uid = (window.App && window.App.currentUser) ? window.App.currentUser.id : 'guest';
      var key = 'fruit_msgs_' + uid;
      var msgs = [];
      try { var s = localStorage.getItem(key); msgs = s ? JSON.parse(s) : []; } catch(e) {}
      var maxId = 0;
      msgs.forEach(function(m) { if (m.id > maxId) maxId = m.id; });
      msgs.unshift({
        id: maxId + 1,
        from: from,
        text: text,
        time: new Date().toLocaleString('zh-CN'),
        unread: true,
        color: color || '#4A90B8',
        icon: icon || 'fa-bell',
        type: 'order'
      });
      // Keep max 100 messages
      if (msgs.length > 100) msgs = msgs.slice(0, 100);
      try { localStorage.setItem(key, JSON.stringify(msgs)); } catch(e) {}
    }
  }
};
