var VueMerchantAudit = {
  name: 'VueMerchantAudit',
  template: '<div class="card"><div class="card-header"><i class="fas fa-building card-icon" style="background:#fee2e2;color:var(--co-error);"></i><span class="card-title">商家合规检查（{{ merchants.length }} 家）</span></div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="merchants.length===0" icon="fa-building" title="暂无商家数据" />' +
    '<div v-else><table class="data-table"><thead><tr><th>商家</th><th>所在地</th><th>资质</th><th>合规状态</th><th>操作</th></tr></thead><tbody>' +
    '<tr v-for="m in merchants" :key="m.id">' +
    '<td><strong>{{ m.name }}</strong></td><td>{{ m.location||"-" }}</td>' +
    '<td>{{ m.active }}/{{ m.total }} 项</td>' +
    '<td><base-badge :color="m.active>=2?\'green\':m.active>=1?\'amber\':\'red\'">{{ m.active>=2?"✅ 合规":m.active>=1?"⚠️ 待完善":"❌ 不合规" }}</base-badge></td>' +
    '<td><button class="btn btn-sm" style="background:var(--co-error);color:#fff;font-weight:600;border:none;cursor:pointer;" @click="checkMerchant(m)"><i class="fas fa-search"></i> 检查</button></td>' +
    '</tr></tbody></table></div>' +
    /* Detail Modal */
    '<div v-if="detail" class="modal-overlay" @click.self="detail=null"><div class="modal-content" style="max-width:520px;">' +
    '<div class="modal-header"><h3>{{ detail.name }} · 合规报告</h3><button class="modal-close" @click="detail=null"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    '<div style="margin-bottom:16px;display:flex;gap:16px;">' +
    '<div class="stat-card" style="flex:1;text-align:center;"><div style="font-size:1.8rem;font-weight:700;color:var(--co-primary-500);">{{ detail.total }}</div><div style="font-size:0.75rem;color:var(--co-neutral-500);">总资质</div></div>' +
    '<div class="stat-card" style="flex:1;text-align:center;"><div style="font-size:1.8rem;font-weight:700;color:var(--co-success);">{{ detail.active }}</div><div style="font-size:0.75rem;color:var(--co-neutral-500);">有效</div></div>' +
    '<div class="stat-card" style="flex:1;text-align:center;"><div style="font-size:1.8rem;font-weight:700;" :style="{color:detail.active>=2?\'var(--co-success)\':\'var(--co-error)\'}">{{ detail.active>=2?"合规":"不合规" }}</div><div style="font-size:0.75rem;color:var(--co-neutral-500);">判定</div></div></div>' +
    '<h4 style="margin-bottom:8px;">资质清单</h4>' +
    '<div v-if="detail.quals&&detail.quals.length">' +
    '<div v-for="q in detail.quals" :key="q.id" style="padding:10px;border-bottom:1px solid var(--co-neutral-100);display:flex;justify-content:space-between;align-items:center;">' +
    '<div><strong>{{ q.type }}={{ q.value }}</strong><br><small style="color:var(--co-neutral-500);">颁发方: {{ q.certifier_name||"-" }} · 到期: {{ q.expires_at||"-" }}</small></div>' +
    '<base-badge :color="q.status===\'active\'?\'green\':\'red\'">{{ q.status==="active"?"有效":"失效" }}</base-badge></div></div>' +
    '<base-empty v-else icon="fa-id-card" title="暂无资质" />' +
    '<button class="btn" style="width:100%;justify-content:center;background:var(--co-neutral-100);color:var(--co-neutral-600);border:none;margin-top:12px;" @click="detail=null">关闭</button>' +
    '</div></div></div></div>',
  data: function() { return { merchants:[], loading:true, detail:null }; },
  mounted: function() { this.load(); },
  methods: {
    load: function() {
      var self = this;
      Promise.all([API.getAllUsers(), API.getAllQualifications()]).then(function(results) {
        var users = (results[0]&&results[0].data)||[], quals = (results[1]&&results[1].data)||[];
        var mList = users.filter(function(u){return u.role==='merchant';});
        var result = [];
        mList.forEach(function(m) {
          var mq = quals.filter(function(q){return q.holder_id===m.id;});
          var active = mq.filter(function(q){return q.status==='active';});
          result.push({ id:m.id, name:m.name, location:m.location, total:mq.length, active:active.length, quals:mq });
        });
        self.merchants = result;
        self.loading = false;
      }).catch(function(){self.loading=false;});
    },
    checkMerchant: function(m) { this.detail = m; }
  }
};
