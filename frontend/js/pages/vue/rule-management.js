var VueRuleManagement = {
  name: 'VueRuleManagement',
  template: '<div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-gear card-icon" style="background:#f3e8ff;color:#6b21a8;"></i><span class="card-title">平台认证规则</span></div>' +
    '<p style="color:var(--co-neutral-500);margin-bottom:16px;font-size:0.85rem;">管理全局认证体系配置，规则更新将影响所有通行证</p>' +
    /* Current version card */
    '<div class="card" style="background:var(--co-neutral-50);margin-bottom:16px;display:flex;align-items:center;gap:20px;padding:20px;">' +
    '<div style="width:48px;height:48px;border-radius:var(--rd-md);background:#e8f5ee;display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:var(--co-success);"><i class="fas fa-shield-alt"></i></div>' +
    '<div style="flex:1;"><h4 style="font-size:1rem;">当前规则版本: v{{ version }}</h4><p style="font-size:0.8rem;color:var(--co-neutral-500);">最后更新: {{ lastUpdate || "2026-06-01 10:00" }}</p></div>' +
    '<base-badge color="green">已生效</base-badge></div>' +
    /* Active rules list */
    '<div style="margin-bottom:16px;"><h4 style="font-size:0.9rem;margin-bottom:8px;">生效中的认证类型</h4>' +
    '<div style="display:flex;flex-wrap:wrap;gap:8px;">' +
    '<span v-for="r in rules" class="tag tag-active" style="font-size:0.85rem;padding:8px 16px;">' +
    '<i :class="\'fas \'+(r.icon||\'fa-check\')" style="margin-right:6px;"></i>{{ r.name }}</span></div></div>' +
    /* Update button */
    '<div style="border-top:1px solid var(--co-neutral-200);padding-top:16px;">' +
    '<button class="btn" style="width:100%;padding:14px;justify-content:center;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-size:1rem;font-weight:700;box-shadow:0 6px 20px rgba(245,158,11,0.35);border:none;cursor:pointer;" @click="doUpdate" :disabled="updating">' +
    '<i v-if="updating" class="fas fa-spinner fa-spin"></i>' +
    '<i v-else class="fas fa-sync"></i>' +
    ' {{ updating ? "更新中..." : "更新认证规则至 v"+(version+1) }}</button>' +
    '<p style="font-size:0.8rem;color:var(--co-error);margin-top:8px;text-align:center;">⚠️ 更新后所有受影响的通行证需重新获取</p></div>' +
    '<div v-if="result" style="margin-top:12px;padding:12px;background:#e8f5ee;border-radius:var(--rd-md);color:var(--co-success);text-align:center;font-weight:600;">✅ {{ result }}</div>' +
    '</div></div>',
  data: function() { return { updating:false, result:'', version:1, lastUpdate:'2026-06-01 10:00', rules:[{name:'产地 Location',icon:'fa-map-marker-alt'},{name:'加工能力 Capability',icon:'fa-tools'},{name:'品质认证 Quality',icon:'fa-check-circle'},{name:'等级评定 Grade',icon:'fa-star'},{name:'有机认证 Organic',icon:'fa-leaf'}] }; },
  methods:{
    doUpdate:function(){var self=this;this.updating=true;API.sysUpdate().then(function(r){self.updating=false;var abeOk=r&&r.abe_rekey;if(abeOk){self.result='🔐 ABE系统主密钥已更新 | '+r.message;self.version++;self.lastUpdate=new Date().toLocaleString('zh-CN');window.showToast('系统密钥已轮换到 v'+self.version,'success');}else{self.result='⚠️ '+ (r?r.message:'更新失败') + ' | ABE密钥服务未响应，仅数据库规则已更新';window.showToast('规则已更新（ABE服务未响应）','warning');}}).catch(function(){self.updating=false;});}
  }
};
