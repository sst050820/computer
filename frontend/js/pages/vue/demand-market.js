var VueDemandMarket = {
  name: 'VueDemandMarket',
  template: '<div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-bullseye card-icon" style="background:#e0f2fe;color:var(--co-info);"></i><span class="card-title">需求市场（{{ demands.length }} 条）</span></div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="demands.length===0" icon="fa-bullseye" title="暂无需求" description="申请更多资质后可匹配更多定制需求" />' +
    '<div v-else>' +
    '<div v-for="d in demands" :key="d.id" class="card" style="margin-bottom:10px;padding:var(--sp-4);cursor:pointer;border-left:4px solid;transition:all 0.15s;" :style="{borderLeftColor:d.matched?\'var(--co-success)\':\'var(--co-neutral-300)\'}" @click="openDetail(d)">' +
    '<div style="display:flex;justify-content:space-between;align-items:start;">' +
    '<div style="flex:1;"><h4 style="font-size:1rem;font-weight:600;">{{ d.title }}</h4>' +
    '<p style="font-size:0.8rem;color:var(--co-neutral-500);margin-top:4px;">预算: {{ d.budget||"未指定" }} | 发布者: {{ d.consumer_name||"匿名" }} | {{ d.created_at }}</p>' +
    '<p v-if="d.policy_display" style="font-size:0.75rem;color:var(--co-neutral-500);margin-top:2px;"><i class="fas fa-tag"></i> {{ d.policy_display }}</p></div>' +
    '<base-badge :color="d.matched?\'green\':\'neutral\'">{{ d.matched?"✅ 可接单":"🔒 加密" }}</base-badge></div></div></div>' +
    /* Detail Modal with ABE decrypt */
    '<div v-if="detail" class="modal-overlay" @click.self="detail=null"><div class="modal-content" style="max-width:550px;">' +
    '<div class="modal-header"><h3>{{ detail.title }}</h3><button class="modal-close" @click="detail=null"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    '<div style="margin-bottom:16px;">' +
    '<div style="display:flex;gap:16px;margin-bottom:12px;"><div style="flex:1;"><span style="color:var(--co-neutral-500);font-size:0.8rem;">预算</span><div style="font-weight:600;">{{ detail.budget||"未指定" }}</div></div>' +
    '<div style="flex:1;"><span style="color:var(--co-neutral-500);font-size:0.8rem;">发布者</span><div style="font-weight:600;">{{ detail.consumer_name||"匿名" }}</div></div>' +
    '<div style="flex:1;"><span style="color:var(--co-neutral-500);font-size:0.8rem;">发布时间</span><div style="font-weight:600;">{{ detail.created_at }}</div></div></div>' +
    /* Match conditions */'<h4 style="margin-bottom:8px;">资质匹配情况</h4>' +
    '<div v-if="detail.match_details"><div v-for="(v,k) in detail.match_details" style="display:flex;align-items:center;padding:8px 0;border-bottom:1px solid var(--co-neutral-100);gap:12px;">' +
    '<span style="font-weight:600;min-width:80px;font-size:0.85rem;">{{ k }}</span><span style="font-size:0.8rem;">要求: <strong>{{ v.required }}</strong></span>' +
    '<span style="font-size:0.8rem;">你有: <strong>{{ v.yours||"无" }}</strong></span>' +
    '<base-badge :color="v.match?\'green\':\'red\'">{{ v.match?"✅":"❌" }}</base-badge></div></div>' +
    /* ABE Decrypt Section */'<div style="margin-top:16px;"><h4 style="margin-bottom:8px;">🔐 ABE 解密验证</h4>' +
    '<div v-if="decrypting" style="text-align:center;padding:20px;"><i class="fas fa-spinner fa-spin" style="font-size:1.5rem;color:var(--co-primary-400);display:block;margin-bottom:8px;"></i>正在进行 ABE 解密验证...</div>' +
    '<div v-else-if="decryptDenied" style="padding:16px;background:#fee2e2;border-radius:var(--rd-md);border-left:4px solid var(--co-error);">' +
    '<p style="color:var(--co-error);font-weight:600;margin-bottom:4px;"><i class="fas fa-lock"></i> 您的资质不满足可见条件</p>' +
    '<p style="font-size:0.85rem;color:#991b1b;">{{ decryptMsg }}</p>' +
    '<p style="font-size:0.8rem;color:var(--co-neutral-500);margin-top:8px;">所需条件: <strong>{{ detail.policy_display }}</strong></p></div>' +
    '<div v-else-if="decryptedContent" style="background:#e8f5ee;padding:14px;border-radius:var(--rd-md);border-left:4px solid var(--co-success);">' +
    '<p style="color:var(--co-success);font-weight:600;margin-bottom:4px;"><i class="fas fa-unlock"></i> ABE 解密成功 · 内容可见</p>' +
    '<div style="font-size:0.9rem;line-height:1.6;margin-top:8px;white-space:pre-wrap;">{{ decryptedContent }}</div>' +
    '<p style="font-size:0.75rem;color:var(--co-neutral-500);margin-top:8px;">解密方式: {{ decryptMethod }}</p></div>' +
    '<div v-else style="text-align:center;padding:20px;color:var(--co-neutral-400);">' +
    '<i class="fas fa-lock" style="font-size:2rem;display:block;margin-bottom:8px;"></i><button class="btn" style="background:var(--co-primary-500);color:#fff;border:none;cursor:pointer;" @click="doDecrypt">点击进行 ABE 解密验证</button></div></div>' +
    /* Actions */'<div style="margin-top:16px;display:flex;gap:8px;">' +
    '<button v-if="decryptedContent" class="btn" style="flex:1;justify-content:center;background:var(--co-success);color:#fff;font-weight:600;border:none;" @click="respond(detail)"><i class="fas fa-handshake"></i> 接单报价</button>' +
    '<button v-else-if="decryptDenied" class="btn" style="flex:1;justify-content:center;background:var(--co-accent-citrus);color:#fff;font-weight:600;border:none;" @click="goQuals"><i class="fas fa-id-card"></i> 申请所需资质</button>' +
    '<button class="btn" style="flex:1;justify-content:center;background:var(--co-neutral-100);color:var(--co-neutral-600);border:none;" @click="detail=null">关闭</button></div>' +
    /* Respond form */'<div v-if="responding" style="margin-top:12px;padding:12px;background:var(--co-neutral-50);border-radius:var(--rd-md);">' +
    '<div class="form-group"><label class="form-label">报价（元）</label><input class="form-input" v-model="respPrice" placeholder="例如：8000" /></div>' +
    '<div class="form-group"><label class="form-label">留言</label><textarea class="form-textarea" v-model="respMsg" rows="2" placeholder="介绍您的优势和方案"></textarea></div>' +
    '<div style="display:flex;gap:8px;"><button class="btn" style="background:var(--co-success);color:#fff;font-weight:600;border:none;" @click="doRespond" :disabled="submitting"><i v-if="submitting" class="fas fa-spinner fa-spin"></i> 提交报价</button>' +
    '<button class="btn btn-ghost btn-sm" @click="responding=false">取消</button></div></div>' +
    '</div></div></div></div></div>',
  data: function() { return { demands:[], loading:true, detail:null, responding:false, respPrice:'', respMsg:'', submitting:false, decrypting:false, decryptedContent:'', decryptDenied:false, decryptMsg:'', decryptMethod:'' }; },
  mounted: function() {
    var self=this; var user=window.App.currentUser;
    if(!user){self.loading=false;return;}
    API.getDemandMarket(user.id).then(function(r){self.demands=r.data||[];self.loading=false;}).catch(function(){self.loading=false;});
  },
  methods: {
    openDetail: function(d) {
      this.detail=d; this.responding=false; this.respPrice=''; this.respMsg='';
      this.decryptedContent=''; this.decryptDenied=false; this.decryptMsg=''; this.decryptMethod='';
    },
    doDecrypt: function() {
      var self=this; this.decrypting=true; this.decryptDenied=false; this.decryptedContent='';
      var user=window.App.currentUser;
      API._fetch('/api/custom-orders/'+this.detail.id+'/decrypt',{
        method:'POST',body:JSON.stringify({merchant_id:user?user.id:''})
      }).then(function(r){
        self.decrypting=false;
        if(r&&r.decrypted&&r.plaintext){self.decryptedContent=r.plaintext;self.decryptMethod=r.method==='abe_decrypt'?'Java ABE 密码学解密':'属性匹配验证（ABE服务降级）';}
        else{self.decryptDenied=true;self.decryptMsg=(r&&r.message)||'资质不满足条件';}
      }).catch(function(){self.decrypting=false;self.decryptDenied=true;self.decryptMsg='ABE 解密服务不可用，请稍后重试';});
    },
    respond: function(d) { this.responding=true; this.respPrice=d.budget||''; },
    doRespond: function() {
      var self=this; if(!this.respPrice){window.showToast&&window.showToast('请输入报价','error');return;}
      this.submitting=true;
      var user=window.App.currentUser;
      API._fetch('/api/custom-orders/'+this.detail.id+'/respond',{method:'POST',body:JSON.stringify({merchant_id:user.id,name:user.name,price:this.respPrice,message:this.respMsg||''})}).then(function(r){
        self.submitting=false; self.responding=false;
        if(r&&r.status==='success'){window.showToast&&window.showToast('报价已提交','success');self.detail=null;}
        else{window.showToast&&window.showToast('提交失败','error');}
      }).catch(function(){self.submitting=false;window.showToast&&window.showToast('网络错误','error');});
    },
    goQuals: function() { this.detail=null; if(window.navigateTo)window.navigateTo('qualifications'); }
  }
};
