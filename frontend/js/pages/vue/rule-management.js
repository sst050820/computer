var VueRuleManagement = {
  name: 'VueRuleManagement',
  template: '<div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-gear card-icon" style="background:#f3e8ff;color:#6b21a8;"></i><span class="card-title">平台认证规则</span></div>' +
    '<div class="card" style="background:var(--co-neutral-50);margin-bottom:16px;display:flex;align-items:center;gap:20px;padding:20px;">' +
    '<div style="width:48px;height:48px;border-radius:var(--rd-md);background:#e8f5ee;display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:var(--co-success);"><i class="fas fa-shield-alt"></i></div>' +
    '<div style="flex:1;"><h4 style="font-size:1rem;">当前规则版本：v{{ version }}</h4><p style="font-size:0.8rem;color:var(--co-neutral-500);">最后更新：{{ lastUpdate }}</p></div>' +
    '<base-badge color="green">已生效</base-badge></div>' +
    '<div style="margin-bottom:16px;"><h4 style="font-size:0.9rem;margin-bottom:8px;">生效中的认证类型</h4>' +
    '<div style="display:flex;flex-wrap:wrap;gap:8px;">' +
    '<span v-for="r in rules" class="tag tag-active" style="font-size:0.85rem;padding:8px 16px;">' +
    '<i :class="\'fas \'+(r.icon||\'fa-check\')" style="margin-right:6px;"></i>{{ r.name }}</span></div></div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;border-top:1px solid var(--co-neutral-200);padding-top:16px;">' +
    '<div class="card" style="padding:16px;background:#fff;">' +
    '<h4 style="font-size:0.95rem;margin-bottom:6px;"><i class="fas fa-rotate" style="color:var(--co-primary-500);margin-right:6px;"></i>普通规则更新</h4>' +
    '<p style="font-size:0.8rem;color:var(--co-neutral-500);min-height:42px;">只更新规则版本，现有资质保持有效。</p>' +
    '<button class="btn" style="width:100%;justify-content:center;background:var(--co-primary-50);color:var(--co-primary-700);" @click="runRulesOnly" :disabled="updating"><i class="fas fa-check"></i> 更新规则</button></div>' +
    '<div class="card" style="padding:16px;background:#fff;">' +
    '<h4 style="font-size:0.95rem;margin-bottom:6px;"><i class="fas fa-ban" style="color:var(--co-warning);margin-right:6px;"></i>指定属性撤销</h4>' +
    '<p style="font-size:0.8rem;color:var(--co-neutral-500);margin-bottom:10px;">撤销某一类属性值，只有匹配该属性的资质失效。</p>' +
    '<div class="form-group"><label class="form-label">属性类型</label><select class="form-input" v-model="attrType"><option value="Location">产地 Location</option><option value="Capability">加工能力 Capability</option><option value="Quality">品质认证 Quality</option><option value="Grade">等级 Grade</option><option value="Organic">有机 Organic</option></select></div>' +
    '<div class="form-group"><label class="form-label">属性值</label><input class="form-input" v-model.trim="attrValue" placeholder="例如：泉州、绿色、有机" /></div>' +
    '<button class="btn" style="width:100%;justify-content:center;background:#fef3c7;color:#92400e;" @click="runAttributeRevoke" :disabled="updating"><i class="fas fa-ban"></i> 撤销属性</button></div>' +
    '<div class="card" style="padding:16px;background:#fff;">' +
    '<h4 style="font-size:0.95rem;margin-bottom:6px;"><i class="fas fa-key" style="color:var(--co-error);margin-right:6px;"></i>全局密钥轮换</h4>' +
    '<p style="font-size:0.8rem;color:var(--co-neutral-500);min-height:42px;">调用 ABE Rekey，所有现有有效资质会过期。</p>' +
    '<button class="btn" style="width:100%;justify-content:center;background:#fee2e2;color:#991b1b;" @click="runGlobalRekey" :disabled="updating"><i class="fas fa-key"></i> 全局轮换</button></div>' +
    '</div>' +
    '<div v-if="result" style="margin-top:12px;padding:12px;border-radius:var(--rd-md);text-align:center;font-weight:600;" :style="{background:resultType===\'error\'?\'#fee2e2\':\'#e8f5ee\',color:resultType===\'error\'?\'#991b1b\':\'var(--co-success)\'}">{{ result }}</div>' +
    '</div></div>',
  data: function() {
    return {
      updating: false,
      result: '',
      resultType: 'success',
      version: 1,
      lastUpdate: '2026-06-01 10:00',
      attrType: 'Location',
      attrValue: '',
      rules: [
        {name:'产地 Location', icon:'fa-map-marker-alt'},
        {name:'加工能力 Capability', icon:'fa-tools'},
        {name:'品质认证 Quality', icon:'fa-check-circle'},
        {name:'等级评定 Grade', icon:'fa-star'},
        {name:'有机认证 Organic', icon:'fa-leaf'}
      ]
    };
  },
  methods: {
    handleResult: function(res, versionBump) {
      this.updating = false;
      if (!res || res.error) {
        this.resultType = 'error';
        this.result = (res && res.error) || '操作失败';
        window.showToast && window.showToast(this.result, 'error');
        return;
      }
      this.resultType = res.status === 'partial' ? 'error' : 'success';
      this.result = res.message || '操作完成';
      if (versionBump) {
        this.version++;
        this.lastUpdate = new Date().toLocaleString('zh-CN');
      }
      window.showToast && window.showToast(this.result, this.resultType === 'success' ? 'success' : 'warning');
    },
    runRulesOnly: function() {
      var self = this;
      this.updating = true;
      API.sysUpdate({strategy:'rules_only'}).then(function(res) {
        self.handleResult(res, true);
      }).catch(function() {
        self.handleResult({error:'网络错误'}, false);
      });
    },
    runAttributeRevoke: function() {
      if (!this.attrValue) {
        this.handleResult({error:'请填写属性值'}, false);
        return;
      }
      if (!confirm('确定撤销属性「' + this.attrType + '=' + this.attrValue + '」吗？匹配该属性的有效资质将失效。')) return;
      var self = this;
      this.updating = true;
      API.sysUpdate({strategy:'attribute_revoke', attr_type:this.attrType, attr_value:this.attrValue}).then(function(res) {
        self.handleResult(res, false);
      }).catch(function() {
        self.handleResult({error:'网络错误'}, false);
      });
    },
    runGlobalRekey: function() {
      if (!confirm('确定执行全局密钥轮换吗？所有当前有效资质都会过期，需要重新签发。')) return;
      var self = this;
      this.updating = true;
      API.sysUpdate({strategy:'global_rekey'}).then(function(res) {
        self.handleResult(res, !!(res && res.abe_rekey));
      }).catch(function() {
        self.handleResult({error:'网络错误'}, false);
      });
    }
  }
};
