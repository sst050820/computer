/* VueConsumerOrders — Consumer: view purchase orders with detail modal */
var VueConsumerOrders = {
  name: 'VueConsumerOrders',
  template: '<div>' +
    '<div class="card"><div class="card-header" style="display:flex;justify-content:space-between;">' +
    '<span style="display:flex;align-items:center;gap:8px;"><i class="fas fa-receipt card-icon" style="background:var(--co-primary-50);color:var(--co-primary-500);"></i><span class="card-title">我的订单</span></span>' +
    '<span style="font-size:0.8rem;color:var(--co-neutral-500);">{{ orders.length }} 笔订单</span>' +
    '</div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="orders.length===0" icon="fa-receipt" title="暂无订单" description="去发现好物逛逛吧" />' +
    '<div v-else>' +
    '<div v-for="o in orders" :key="o.id" class="card" style="padding:0;margin-bottom:12px;overflow:hidden;cursor:pointer;" @click="openDetail(o)">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:var(--co-neutral-50);border-bottom:1px solid var(--co-neutral-100);">' +
    '<div style="display:flex;align-items:center;gap:12px;"><span style="font-size:0.8rem;font-weight:600;color:var(--co-neutral-700);">#{{ o.id }}</span><span style="font-size:0.75rem;color:var(--co-neutral-400);">{{ fmtTime(o.created_at) }}</span></div>' +
    '<base-badge :color="statusColor(o.status)">{{ statusLabel(o.status) }}</base-badge></div>' +
    '<div style="padding:14px 16px;"><div style="display:flex;gap:14px;align-items:center;">' +
    '<div style="width:48px;height:48px;border-radius:var(--rd-md);background:var(--co-neutral-100);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">📦</div>' +
    '<div style="flex:1;min-width:0;"><h4 style="font-size:0.95rem;font-weight:600;margin-bottom:4px;">{{ o.product_name }}</h4>' +
    '<div style="display:flex;flex-wrap:wrap;gap:6px 16px;font-size:0.8rem;color:var(--co-neutral-500);"><span><i class="fas fa-store"></i> {{ o.merchant_name||o.merchant_id }}</span><span>×{{ o.quantity }}</span></div></div>' +
    '<div style="text-align:right;flex-shrink:0;"><div style="font-size:1.2rem;font-weight:700;color:var(--co-accent-berry);">¥{{ (o.total||0).toFixed(1) }}</div></div></div>' +
    '<div v-if="o.status===\'pending\'" style="margin-top:10px;padding-top:8px;border-top:1px solid var(--co-neutral-100);display:flex;gap:8px;">' +
    '<button @click.stop="cancelOrder(o.id)" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border:1.5px solid #e0c0c0;border-radius:var(--rd-sm);font-size:0.78rem;font-weight:500;cursor:pointer;background:#fff;color:#B85450;transition:all 0.2s;" onmouseover="this.style.background=\'#fef5f5\';this.style.borderColor=\'#D14343\';this.style.color=\'#D14343\'" onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'#e0c0c0\';this.style.color=\'#B85450\'"><i class="fas fa-times"></i> 取消订单</button></div>' +
    '</div></div></div>' +
    '</div></div>' +
    /* Detail Modal */
    '<div v-if="detail" class="modal-overlay" @click.self="detail=null"><div class="modal-content" style="max-width:520px;">' +
    '<div class="modal-header"><h3 class="modal-title">订单详情 #{{ detail.id }}</h3><button class="modal-close" @click="detail=null"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;"><div style="width:52px;height:52px;border-radius:var(--rd-md);background:var(--co-neutral-100);display:flex;align-items:center;justify-content:center;font-size:1.8rem;">📦</div>' +
    '<div><h4 style="font-size:1rem;">{{ detail.product_name }}</h4><p style="font-size:0.8rem;color:var(--co-neutral-500);">{{ detail.merchant_name||detail.merchant_id }} · ¥{{ (detail.total||0).toFixed(1) }}</p></div></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;font-size:0.84rem;">' +
    '<div><span style="color:var(--co-neutral-500);">状态</span><div style="font-weight:600;"><base-badge :color="statusColor(detail.status)">{{ statusLabel(detail.status) }}</base-badge></div></div>' +
    '<div><span style="color:var(--co-neutral-500);">数量</span><div style="font-weight:600;">×{{ detail.quantity }}</div></div>' +
    '<div><span style="color:var(--co-neutral-500);">单价</span><div style="font-weight:600;">¥{{ (detail.price||0).toFixed(1) }}</div></div>' +
    '<div><span style="color:var(--co-neutral-500);">时间</span><div style="font-weight:600;font-size:0.78rem;">{{ fmtTime(detail.created_at) }}</div></div></div>' +
    '<div v-if="detail.remark" style="margin-top:12px;padding:8px 12px;background:var(--co-neutral-50);border-radius:var(--rd-sm);font-size:0.82rem;color:var(--co-neutral-600);"><i class="fas fa-sticky-note"></i> {{ detail.remark }}</div>' +
    /* Status timeline */
    '<div style="margin-top:14px;"><h4 style="font-size:0.8rem;color:var(--co-neutral-500);margin-bottom:8px;">订单进度</h4>' +
    '<div style="display:flex;align-items:center;gap:0;">' +
    '<span v-for="(s,i) in steps" :key="s.key" style="display:flex;align-items:center;gap:0;flex:1;">' +
    '<span style="font-size:0.7rem;text-align:center;line-height:1.2;" :style="{color:s.done||s.key===detail.status?\'var(--co-success)\':\'var(--co-neutral-300)\'}"><i :class="\'fas \'+(s.done||s.key===detail.status?\'fa-circle\':\'fa-circle\')" style="font-size:0.55rem;display:block;"></i>{{ s.label }}</span>' +
    '<span v-if="i<steps.length-1" style="flex:1;height:2px;min-width:12px;" :style="{background:s.done||s.key===detail.status?\'var(--co-success)\':\'var(--co-neutral-200)\'}"></span>' +
    '</span></div></div>' +
    '<div style="margin-top:16px;display:flex;gap:8px;">' +
    '<button v-if="detail.status===\'pending\'" @click="cancelOrder(detail.id);detail=null" style="display:inline-flex;align-items:center;gap:5px;flex:1;justify-content:center;padding:9px 16px;border:1.5px solid #e0c0c0;border-radius:var(--rd-sm);font-size:0.84rem;font-weight:500;cursor:pointer;background:#fff;color:#B85450;transition:all 0.2s;" onmouseover="this.style.background=\'#fef5f5\';this.style.borderColor=\'#D14343\';this.style.color=\'#D14343\'" onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'#e0c0c0\';this.style.color=\'#B85450\'"><i class="fas fa-times"></i> 取消订单</button>' +
    '<button v-if="detail.status===\'completed\'||detail.status===\'cancelled\'" @click="reorder(detail);detail=null" style="display:inline-flex;align-items:center;gap:5px;flex:1;justify-content:center;padding:9px 16px;border:none;border-radius:var(--rd-sm);font-size:0.84rem;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#2D6A4F,#40916C);color:#fff;box-shadow:0 2px 6px rgba(45,106,79,0.2);transition:all 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 3px 10px rgba(45,106,79,0.3)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 6px rgba(45,106,79,0.2)\'"><i class="fas fa-redo"></i> 再次购买</button>' +
    '<button @click="detail=null" style="display:inline-flex;align-items:center;gap:5px;flex:1;justify-content:center;padding:9px 16px;border:1px solid var(--co-neutral-300);border-radius:var(--rd-sm);font-size:0.84rem;font-weight:500;cursor:pointer;background:#fff;color:var(--co-neutral-600);transition:all 0.2s;" onmouseover="this.style.background=\'var(--co-neutral-50)\'" onmouseout="this.style.background=\'#fff\'">关闭</button></div>' +
    '</div></div></div>',
  data: function() {
    return {
      orders: [], loading: true, detail: null,
      steps: [
        {key:'pending',label:'待确认'},{key:'confirmed',label:'已接单'},{key:'shipped',label:'已发货'},{key:'delivered',label:'已送达'},{key:'completed',label:'已完成'}
      ]
    };
  },
  mounted: function() { this.fetch(); },
  methods: {
    fetch: function() {
      var self = this;
      var user = window.App && window.App.currentUser;
      if (!user) { self.loading = false; return; }
      API._fetch('/api/consumer/orders?consumer_id=' + user.id).then(function(res) {
        self.orders = res.data || [];
        self.loading = false;
      }).catch(function() { self.loading = false; });
      self.checkStatusChanges();
    },
    checkStatusChanges: function() {
      var uid = (window.App && window.App.currentUser) ? window.App.currentUser.id : '';
      var key = 'fruit_order_status_' + uid;
      var prev = {};
      try { prev = JSON.parse(localStorage.getItem(key)||'{}'); } catch(e) {}
      var now = {}; var self = this;
      this.orders.forEach(function(o) {
        now[o.id] = o.status;
        if (prev[o.id] && prev[o.id] !== o.status) {
          self.addMessage('订单更新', '订单 #'+o.id+'「'+o.product_name+'」状态更新为：'+self.statusLabel(o.status), '#4A90B8', 'fa-truck');
        }
      });
      try { localStorage.setItem(key, JSON.stringify(now)); } catch(e) {}
    },
    addMessage: function(from, text, color, icon) {
      var uid = (window.App && window.App.currentUser) ? window.App.currentUser.id : 'guest';
      var key = 'fruit_msgs_' + uid;
      var msgs = [];
      try { msgs = JSON.parse(localStorage.getItem(key)||'[]'); } catch(e) {}
      var maxId = 0; msgs.forEach(function(m) { if (m.id > maxId) maxId = m.id; });
      msgs.unshift({id:maxId+1, from:from, text:text, time:new Date().toLocaleString('zh-CN'), unread:true, color:color||'#4A90B8', icon:icon||'fa-bell', type:'order'});
      if (msgs.length > 100) msgs = msgs.slice(0, 100);
      try { localStorage.setItem(key, JSON.stringify(msgs)); } catch(e) {}
    },
    openDetail: function(o) { this.detail = o; },
    fmtTime: function(t) { if(!t) return ''; return t.replace('T',' ').replace('Z','').substring(0,19); },
    statusColor: function(s) { var m={pending:'amber',confirmed:'blue',shipped:'purple',delivered:'green',completed:'green',cancelled:'red'}; return m[s]||'neutral'; },
    statusLabel: function(s) { var m={pending:'待确认',confirmed:'已接单',shipped:'已发货',delivered:'已送达',completed:'已完成',cancelled:'已取消'}; return m[s]||s; },
    reorder: function(o) {
      if (window.App && window.App.addToCart) {
        window.App.addToCart({ id: o.product_id, name: o.product_name, price: o.price, shop_id: o.merchant_id, shop_name: o.merchant_name });
        window.showToast('已加入购物车', 'success');
      }
    },
    cancelOrder: function(id) {
      if (!confirm('确定取消订单 #' + id + ' 吗？')) return;
      var self = this;
      API._fetch('/api/orders/' + id + '/status', {method:'PUT', body:JSON.stringify({status:'cancelled'})}).then(function(res){
        if (res.status === 'success') { window.showToast('订单已取消', 'info'); self.fetch(); }
      });
    }
  }
};
