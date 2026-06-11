var VueEmergency = {
  name: 'VueEmergency',
  template: '<div>' +
    /* Audit Log */
    '<div class="card"><div class="card-header"><i class="fas fa-shield-alt card-icon" style="background:#fee2e2;color:var(--co-error);"></i><span class="card-title">应急访问审计台</span></div>' +
    '<p style="color:var(--co-neutral-500);font-size:0.85rem;margin-bottom:12px;">所有紧急解密操作均在此记录，确保可追溯</p>' +
    /* Audit stats */
    '<div class="stat-grid" style="margin-bottom:16px;">' +
    '<div class="stat-card" style="text-align:center;"><div style="font-size:1.8rem;font-weight:700;color:var(--co-error);">{{ logs.length }}</div><div style="font-size:0.75rem;color:var(--co-neutral-500);">总操作次数</div></div>' +
    '<div class="stat-card" style="text-align:center;"><div style="font-size:1.8rem;font-weight:700;color:var(--co-primary-500);">{{ logs.filter(function(l){return l.type===\'archive\';}).length }}</div><div style="font-size:0.75rem;color:var(--co-neutral-500);">档案查询</div></div>' +
    '<div class="stat-card" style="text-align:center;"><div style="font-size:1.8rem;font-weight:700;color:var(--co-error);">{{ logs.filter(function(l){return l.type===\'emergency\';}).length }}</div><div style="font-size:0.75rem;color:var(--co-neutral-500);">紧急解密</div></div></div>' +
    /* Log table */
    '<h4 style="margin-bottom:8px;">操作日志</h4>' +
    '<table class="data-table"><thead><tr><th>时间</th><th>操作类型</th><th>产品</th><th>操作人</th><th>备注</th></tr></thead><tbody>' +
    '<tr v-for="l in logs" :key="l.id"><td style="font-size:0.8rem;">{{ l.time }}</td>' +
    '<td><base-badge :color="l.type===\'emergency\'?\'red\':\'blue\'">{{ l.type==="emergency"?"🔴 紧急解密":"📋 档案查询" }}</base-badge></td>' +
    '<td>{{ l.product }}</td><td>{{ l.operator }}</td>' +
    '<td style="font-size:0.75rem;color:var(--co-neutral-500);">{{ l.note }}</td></tr></tbody></table>' +
    '<div v-if="!logs.length" style="text-align:center;padding:20px;color:var(--co-neutral-400);">暂无操作记录</div>' +
    '</div>' +
    /* Emergency Decrypt (secondary, with heavy warnings) */
    '<div class="card" style="border:2px solid var(--co-error);margin-top:16px;">' +
    '<div class="card-header"><i class="fas fa-exclamation-triangle card-icon" style="background:#fee2e2;color:var(--co-error);"></i><span class="card-title" style="color:var(--co-error);">⚠️ 紧急解密入口</span></div>' +
    '<div style="background:#fee2e2;padding:12px;border-radius:8px;margin-bottom:12px;">' +
    '<p style="color:var(--co-error);font-weight:600;font-size:0.85rem;"><i class="fas fa-exclamation-triangle"></i> 警告：此操作将绕过加密保护，直接查看产品的全部追溯档案（含加密节点）</p>' +
    '<p style="color:#991b1b;font-size:0.75rem;margin-top:4px;">限食品安全事故、产品召回等紧急情况使用。每次操作均记录在审计日志中，并将上报至上级监管机构。</p></div>' +
    '<div class="form-group"><label class="form-label">选择产品（确认后立即解密）</label>' +
    '<select class="form-select" v-model="productId"><option value="">-- 请谨慎选择 --</option>' +
    '<option v-for="p in allProducts" :key="p.id" :value="p.id">{{ p.name }}（{{ p.shop_name }}）</option></select></div>' +
    '<button class="btn" style="width:100%;padding:14px;justify-content:center;background:var(--co-error);color:#fff;font-size:1rem;font-weight:700;box-shadow:0 6px 20px rgba(209,67,67,0.35);border:none;cursor:pointer;" @click="doDecrypt" :disabled="loading||!productId"><i v-if="loading" class="fas fa-spinner fa-spin"></i><i v-else class="fas fa-unlock"></i> {{ loading?"解密中...":"确认紧急解密（操作将记录并上报）" }}</button>' +
    '<div v-if="result" class="card" style="margin-top:16px;border:1px solid var(--co-success);"><h4 style="color:var(--co-success);">解密成功 · 已记录审计日志</h4>' +
    '<pre style="font-size:0.8rem;white-space:pre-wrap;overflow-x:auto;background:var(--co-neutral-50);padding:12px;border-radius:8px;margin-top:8px;">{{ JSON.stringify(result,null,2) }}</pre></div>' +
    '</div></div>',
  data: function() {
    return {
      productId:'',allProducts:[],loading:false,result:null,
      logs: [
        { id:1, time:'2026-06-11 10:30', type:'archive', product:'武夷山大红袍(p1)', operator:'食品药品监管局', note:'例行检查' },
        { id:2, time:'2026-06-10 15:20', type:'archive', product:'安溪铁观音(p2)', operator:'食品药品监管局', note:'消费者投诉核查' },
        { id:3, time:'2026-06-09 09:15', type:'emergency', product:'烟台红富士苹果(p4)', operator:'食品药品监管局', note:'疑似农药超标紧急核查' },
        { id:4, time:'2026-06-08 14:00', type:'archive', product:'龙井绿茶(p5)', operator:'食品药品监管局', note:'资质验证' },
      ]
    };
  },
  mounted: function() { var self=this; API._fetch('/api/products').then(function(r){self.allProducts=(r&&r.data)||[];}).catch(function(){}); },
  methods: {
    doDecrypt: function() {
      var p=this.productId; if(!p) return;
      var self=this; this.loading=true;
      API.emergencyDecrypt(p).then(function(r) {
        self.result=r.data||[];
        self.loading=false;
        // Add to audit log
        var prod = self.allProducts.find(function(x){return x.id===p;});
        self.logs.unshift({ id:Date.now(), time:new Date().toLocaleString('zh-CN'), type:'emergency', product:(prod?prod.name:p)+'('+p+')', operator:'食品药品监管局', note:'紧急解密操作' });
        window.showToast&&window.showToast("紧急解密已记录并上报","info");
      }).catch(function(){self.loading=false;});
    }
  }
};
