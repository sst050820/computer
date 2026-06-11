var VueOrderSquare = {
  name: 'VueOrderSquare',
  template: '<div class="card"><div class="card-header"><i class="fas fa-th-list card-icon" style="background:var(--co-primary-50);color:var(--co-primary-500);"></i><span class="card-title">定制广场（{{ orders.length }} 个公开需求）</span></div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="orders.length===0" icon="fa-th-list" title="暂无公开需求" description="还没有人发布定制需求" />' +
    '<div v-else class="grid-2">' +
    '<div v-for="o in orders" :key="o.id" class="card" style="padding:16px;cursor:pointer;">' +
    '<h4>{{ o.title }}</h4>' +
    '<p style="font-size:0.85rem;color:var(--co-accent-berry);font-weight:600;margin-top:6px;">预算：{{ o.budget }}</p>' +
    '<p v-if="o.policy" style="font-size:0.75rem;color:var(--co-neutral-500);margin-top:4px;"><i class="fas fa-tag"></i> {{ o.policy }}</p>' +
    '<div style="display:flex;justify-content:space-between;margin-top:6px;font-size:0.7rem;color:var(--co-neutral-500);"><span>{{ o.consumer_name }}</span><span>{{ o.created_at }}</span></div></div></div></div>',
  data: function() { return { orders: [], loading: true }; },
  mounted: function() {
    var self = this;
    API._fetch('/api/public-orders').then(function(res) {
      self.orders = res.data || [];
      self.loading = false;
    }).catch(function() { self.loading = false; });
  }
};
