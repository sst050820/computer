/* VueEmergency — Regulator: Emergency Decrypt */
const VueEmergency = {
  name: 'VueEmergency',
  template: '<div>' +
    '<div class="card" style="max-width:600px;margin:0 auto;border:2px solid var(--co-error);">' +
    '<div class="card-header"><i class="fas fa-exclamation-triangle card-icon" style="background:#fee2e2;color:var(--co-error);"></i><span class="card-title" style="color:var(--co-error);">应急处理</span></div>' +
    '<p style="margin-bottom:16px;color:var(--co-neutral-500);font-size:0.85rem;">紧急情况下可查看全部加密档案信息</p>' +
    '<div class="form-group"><label class="form-label">产品编号 / 批次号</label>' +
    '<input class="form-input" v-model="productId" placeholder="输入产品编号或批次号" /></div>' +
    '<base-button variant="danger" block @click="doDecrypt" :loading="loading"><i class="fas fa-unlock"></i> 紧急查看完整档案</base-button>' +
    '<p style="font-size:0.75rem;color:var(--co-error);margin-top:4px;">⚠️ 此操作将被记录并上报</p>' +
    '<div v-if="result" class="card" style="margin-top:16px;border:1px solid var(--co-success);">' +
    '<h4>紧急解密结果</h4>' +
    '<pre style="font-size:0.8rem;white-space:pre-wrap;overflow-x:auto;background:var(--co-neutral-50);padding:12px;border-radius:var(--rd-sm);margin-top:8px;">{{ JSON.stringify(result, null, 2) }}</pre>' +
    '</div></div></div>',
  data: function() { return { productId: '', loading: false, result: null }; },
  methods: {
    doDecrypt: function() {
      var pid = this.productId.trim();
      if (!pid) { window.showToast('请输入产品编号', 'error'); return; }
      var self = this;
      this.loading = true;
      API.emergencyDecrypt(pid).then(function(res) {
        self.result = res.data || [];
        self.loading = false;
        window.showToast('紧急解密已记录', 'info');
      }).catch(function() { self.loading = false; });
    }
  }
};
