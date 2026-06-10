/* VueRuleManagement — Admin: System Rule Management */
const VueRuleManagement = {
  name: 'VueRuleManagement',
  template: '<div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-gear card-icon" style="background:#f3e8ff;color:#6b21a8;"></i><span class="card-title">平台认证规则</span></div>' +
    '<p style="color:var(--co-neutral-500);margin-bottom:16px;font-size:0.85rem;">管理全局认证体系配置，规则更新将影响所有通行证</p>' +
    '<div class="card" style="background:var(--co-neutral-50);margin-bottom:16px;">' +
    '<h4>当前规则版本</h4><p style="font-size:0.85rem;color:var(--co-neutral-500);">v1.0 — 已生效</p></div>' +
    '<base-button variant="secondary" @click="doUpdate" :loading="updating" style="background:var(--co-warning);color:#fff;"><i class="fas fa-sync"></i> 更新认证规则</base-button>' +
    '<p style="font-size:0.8rem;color:var(--co-error);margin-top:8px;">⚠️ 更新后所有受影响的通行证需重新获取</p>' +
    '<div v-if="result" style="margin-top:12px;color:var(--co-success);">✅ {{ result }}</div>' +
    '</div></div>',
  data: function() { return { updating: false, result: '' }; },
  methods: {
    doUpdate: function() {
      var self = this;
      this.updating = true;
      API.sysUpdate().then(function(res) {
        self.result = res.message || '规则已更新';
        self.updating = false;
        window.showToast('规则已更新', 'success');
      }).catch(function() { self.updating = false; });
    }
  }
};
