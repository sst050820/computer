var VueReviewHistory = {
  name: 'VueReviewHistory',
  template: '<div class="card"><div class="card-header"><i class="fas fa-history card-icon" style="background:#fef3c7;color:var(--co-warning);"></i><span class="card-title">审核历史（{{ total }} 条）</span></div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="history.length===0" icon="fa-history" title="暂无审核记录" />' +
    '<div v-else><table class="data-table"><thead><tr><th>申请人</th><th>资质</th><th>结果</th><th>审核方</th><th>日期</th></tr></thead><tbody>' +
    '<tr v-for="h in history" :key="h.id"><td>{{ h.holder_name }}</td><td>{{ h.type }}={{ h.value }}</td>' +
    '<td><base-badge :color="h.status===\'active\'?\'green\':h.status===\'pending\'?\'amber\':\'red\'">{{ statusLabel(h.status) }}</base-badge></td>' +
    '<td>{{ h.certifier_name || "-" }}</td><td>{{ h.issued_at || h.expires_at || "-" }}</td></tr>' +
    '</tbody></table></div></div>',
  data: function() { return { history: [], loading: true }; },
  computed: { total: function() { return this.history.length; } },
  mounted: function() { this.load(); },
  methods: {
    statusLabel: function(s) { var m={active:'已通过',pending:'待审核',rejected:'已拒绝',revoked:'已收回'}; return m[s]||s; },
    load: function() {
      var self = this;
      API.getAllQualifications().then(function(res) {
        self.history = (res.data || []).filter(function(q) { return q.status !== 'pending'; });
        self.loading = false;
      }).catch(function() { self.loading = false; });
    }
  }
};
