/* VueReviewList — Certifier: Review/Audit Management */
const VueReviewList = {
  name: 'VueReviewList',
  template: '<div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-check-double card-icon" style="background:#fef3c7;color:var(--co-warning);"></i><span class="card-title">资质审核</span></div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="reviews.length === 0" icon="fa-check-double" title="暂无待审核申请" description="所有资质申请已处理完毕" />' +
    '<div v-else>' +
    '<div v-for="r in reviews" :key="r.id" class="card" style="margin-bottom:10px;padding:var(--sp-4);">' +
    '<div style="display:flex;justify-content:space-between;"><h4 style="font-size:1rem;">{{ r.holder_name }}</h4>' +
    '<base-badge>{{ r.Type }}={{ r.Value }}</base-badge></div>' +
    '<p style="font-size:0.8rem;color:var(--co-neutral-500);margin-top:4px;">申请时间：{{ r.created_at }}</p>' +
    '<div style="display:flex;gap:8px;margin-top:10px;">' +
    '<base-button size="sm" @click="approve(r.id)">通过</base-button>' +
    '<base-button size="sm" variant="danger-ghost" @click="reject(r.id)">拒绝</base-button></div></div></div>' +
    '</div></div>',
  data: function() { return { reviews: [], loading: true }; },
  mounted: function() { this.fetchData(); },
  methods: {
    fetchData: function() {
      var self = this;
      API.getReviewList().then(function(res) {
        self.reviews = res.data || [];
        self.loading = false;
      }).catch(function() { self.loading = false; });
    },
    approve: function(id) {
      var self = this;
      var user = window.App.currentUser;
      API.approveReview(id, user.id).then(function() {
        window.showToast('已批准通过', 'success');
        self.fetchData();
      });
    },
    reject: function(id) {
      var self = this;
      API.rejectReview(id).then(function() {
        window.showToast('已拒绝', 'info');
        self.fetchData();
      });
    }
  }
};
