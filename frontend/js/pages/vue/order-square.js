var VueOrderSquare = {
  name: 'VueOrderSquare',
  template: '<div class="card"><div class="card-header"><i class="fas fa-th-list card-icon" style="background:var(--co-primary-50);color:var(--co-primary-500);"></i><span class="card-title">定制广场（{{ orders.length }} 个公开需求）</span></div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="orders.length===0" icon="fa-th-list" title="暂无公开需求" description="还没有人发布定制需求" />' +
    '<div v-else class="grid-2">' +
    '<div v-for="o in orders" :key="o.id" class="card" style="padding:16px;cursor:pointer;" @click="detail=o">' +
    '<h4>{{ o.title }}</h4>' +
    '<p style="font-size:0.85rem;color:var(--co-accent-berry);font-weight:600;margin-top:6px;">预算：{{ o.budget }}</p>' +
    '<p v-if="o.policy" style="font-size:0.75rem;color:var(--co-neutral-500);margin-top:4px;"><i class="fas fa-tag"></i> {{ o.policy }}</p>' +
    '<div style="display:flex;justify-content:space-between;margin-top:6px;font-size:0.7rem;color:var(--co-neutral-500);"><span>{{ o.consumer_name }}</span><span>{{ o.created_at }}</span></div></div></div>' +
    /* Detail modal */
    '<div v-if="detail" class="modal-overlay" @click.self="detail=null"><div class="modal-content" style="max-width:480px;">' +
    '<div class="modal-header"><h3 class="modal-title">{{ detail.title }}</h3><button class="modal-close" @click="detail=null"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    '<div style="display:grid;gap:10px;">' +
    '<div><span style="color:var(--co-neutral-500);font-size:0.8rem;">预算</span><div style="font-weight:700;font-size:1.1rem;color:var(--co-accent-berry);">{{ detail.budget||"未指定" }}</div></div>' +
    '<div><span style="color:var(--co-neutral-500);font-size:0.8rem;">发布者</span><div style="font-weight:600;">🔒 解密后可见</div></div>' +
    '<div><span style="color:var(--co-neutral-500);font-size:0.8rem;">发布时间</span><div style="font-weight:600;">{{ detail.created_at }}</div></div>' +
    '<div v-if="detail.policy"><span style="color:var(--co-neutral-500);font-size:0.8rem;">可见条件</span><div style="font-weight:500;font-size:0.85rem;padding:6px 10px;background:var(--co-neutral-50);border-radius:var(--rd-sm);margin-top:2px;">{{ detail.policy }}</div></div>' +
    '<p style="font-size:0.78rem;color:var(--co-neutral-400);margin-top:6px;">🔐 详细需求内容需商家在需求市场中解密查看</p>' +
    '</div>' +
    '<button @click="detail=null" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;width:100%;margin-top:16px;padding:10px 20px;border:1px solid var(--co-neutral-300);border-radius:var(--rd-md);font-size:0.88rem;font-weight:500;cursor:pointer;background:#fff;color:var(--co-neutral-600);transition:all 0.2s;" onmouseover="this.style.background=\'var(--co-neutral-50)\'" onmouseout="this.style.background=\'#fff\'">关闭</button>' +
    '</div></div></div></div>',
  data: function() { return { orders: [], loading: true, detail: null }; },
  mounted: function() {
    var self = this;
    API._fetch('/api/public-orders').then(function(res) { self.orders = res.data || []; self.loading = false; }).catch(function() { self.loading = false; });
  }
};
