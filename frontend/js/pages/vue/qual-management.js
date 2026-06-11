var VueQualManagement = {
  name: 'VueQualManagement',
  template: '<div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-medal card-icon" style="background:#fef3c7;color:var(--co-warning);"></i><span class="card-title">全平台资质管理（{{ quals.length }} 项）</span></div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="quals.length===0" icon="fa-medal" title="暂无资质数据" />' +
    '<div v-else>' +
    '<table class="data-table"><thead><tr><th>持有方</th><th>资质</th><th>状态</th><th>颁发日期</th><th>到期日期</th><th>操作</th></tr></thead><tbody>' +
    '<tr v-for="q in quals" :key="q.id">' +
    '<td>{{ q.holder_name }}</td>' +
    '<td><span class="tag tag-active">{{ q.type }}={{ q.value }}</span></td>' +
    '<td><base-badge :color="q.status===\'active\'?\'green\':q.status===\'pending\'?\'amber\':\'red\'">{{ statusName(q.status) }}</base-badge></td>' +
    '<td>{{ q.issued_at || "-" }}</td>' +
    '<td>{{ q.expires_at || "-" }}</td>' +
    '<td style="display:flex;gap:6px;">' +
    '<button v-if="q.status===\'active\'" class="btn btn-sm" style="background:#fff;color:var(--co-error);border:2px solid var(--co-error);font-weight:600;" @click="revokeQual(q)">收回</button>' +
    '<button v-if="q.status===\'active\'" class="btn btn-sm" style="background:linear-gradient(135deg,#2D6A4F,#235740);color:#fff;font-weight:600;" @click="renewQual(q)">续期</button>' +
    '<button v-if="q.status===\'revoked\'||q.status===\'rejected\'" class="btn btn-sm" style="background:linear-gradient(135deg,#2D6A4F,#235740);color:#fff;font-weight:600;" @click="restoreQual(q)">恢复</button>' +
    '</td></tr></tbody></table></div>' +
    '</div>' +
    /* Result toast area */
    '<div v-if="msg" style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:999;background:#fff;padding:10px 24px;border-radius:var(--rd-full);box-shadow:var(--sh-lg);font-size:0.85rem;font-weight:500;display:flex;align-items:center;gap:8px;">' +
    '<i v-if="msgType===\'success\'" class="fas fa-check-circle" style="color:var(--co-success);"></i>' +
    '<i v-else class="fas fa-info-circle" style="color:var(--co-info);"></i>' +
    '{{ msg }}</div>' +
    '</div>',
  data: function() { return { quals: [], loading: true, msg: '', msgType: 'info' }; },
  mounted: function() { this.fetchAll(); },
  methods: {
    statusName: function(s) {
      var m = { active:'有效', pending:'待审核', revoked:'已收回', rejected:'已拒绝', expired:'已过期' };
      return m[s] || s;
    },
    fetchAll: function() {
      var self = this;
      API.getAllQualifications().then(function(res) {
        self.quals = res.data || [];
        self.loading = false;
      }).catch(function() { self.loading = false; });
    },
    revokeQual: function(q) {
      if (!confirm('确定收回「' + q.holder_name + '」的「' + q.type + '=' + q.value + '」资质吗？\n\n⚠️ 此操作将触发ABE属性撤销，该用户将无法再解密相关内容。')) return;
      var self = this;
      API.revokeQualification(q.id).then(function(r) {
        self.fetchAll();
        var msg = (r && r.message) ? r.message : ('已收回：' + q.type + '=' + q.value);
        self.showMsg(msg, 'info');
      }).catch(function() { self.showMsg('操作失败', 'error'); });
    },
    renewQual: function(q) {
      var self = this;
      var newDate = prompt('输入新的到期日期（YYYY-MM-DD）：', q.expires_at || '2027-12-31');
      if (!newDate) return;
      API.renewQualification(q.id, newDate).then(function() {
        self.fetchAll();
        self.showMsg('已续期 → ' + newDate, 'success');
      }).catch(function() { self.showMsg('操作失败', 'error'); });
    },
    restoreQual: function(q) {
      if (!confirm('确定恢复「' + q.holder_name + '」的「' + q.type + '=' + q.value + '」资质吗？')) return;
      var self = this;
      API.restoreQualification(q.id).then(function() {
        self.fetchAll();
        self.showMsg('已恢复：' + q.type + '=' + q.value, 'success');
      }).catch(function() { self.showMsg('操作失败', 'error'); });
    },
    showMsg: function(m, t) {
      var self = this; this.msg = m; this.msgType = t || 'info';
      clearTimeout(this._mtid);
      this._mtid = setTimeout(function() { self.msg = ''; }, 2500);
    }
  }
};
