var VueQualifications = {
  name: 'VueQualifications',
  template: '<div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-id-card card-icon" style="background:#fef3c7;color:var(--co-warning);"></i><span class="card-title">我的资质</span></div>' +
    '<base-loading v-if="loading" />' +
    '<div v-else>' +
    /* Active */
    '<h4 v-if="active.length" style="margin-bottom:8px;">有效资质（{{ active.length }}）</h4>' +
    '<div v-if="active.length" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">' +
    '<div v-for="q in active" :key="q.id" class="tag tag-active" :style="tagStyle(q.type)">' +
    '<i :class="\'fas \'+(typeIcons[q.type]||\'fa-tag\')" style="margin-right:4px;"></i>{{ q.type }}={{ q.value }}' +
    '<span style="font-size:0.7rem;opacity:0.6;display:block;">到期: {{ q.expires_at || "长期" }}</span></div></div>' +
    /* Pending */
    '<h4 v-if="pending.length" style="margin-bottom:8px;">待审核（{{ pending.length }}）</h4>' +
    '<div v-if="pending.length" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">' +
    '<div v-for="q in pending" :key="q.id" class="tag" style="background:#fef3c7;color:#92400e;">{{ q.type }}={{ q.value }} <span style="font-size:0.7rem;">审核中</span></div></div>' +
    /* Expired */
    '<h4 v-if="expired.length" style="margin-bottom:8px;">已失效（{{ expired.length }}）</h4>' +
    '<div v-if="expired.length" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">' +
    '<div v-for="q in expired" :key="q.id" class="tag" style="background:#fee2e2;color:#991b1b;text-decoration:line-through;">{{ q.type }}={{ q.value }}</div></div>' +
    '<base-empty v-if="!active.length&&!pending.length&&!expired.length" icon="fa-id-card" title="暂无资质" description="申请资质后可在需求市场看到匹配的定制订单" />' +
    '<button class="btn" style="background:linear-gradient(135deg,#E8A838,#c7851c);color:#fff;box-shadow:0 4px 16px rgba(232,168,56,0.3);padding:10px 24px;font-size:0.9rem;font-weight:600;" @click="applyQual"><i class="fas fa-plus-circle"></i> 申请新资质</button>' +
    '</div></div>' +
    /* Modal */
    '<div v-if="showApply" class="modal-overlay" @click.self="showApply=false">' +
    '<div class="modal-content" style="max-width:460px;">' +
    '<div class="modal-header"><h3 class="modal-title">申请新资质</h3><button class="modal-close" @click="showApply=false"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    '<div class="form-group"><label class="form-label">资质类型</label>' +
    '<select class="form-select" v-model="applyType"><option v-for="o in qualOptions" :key="o.value" :value="o.value">{{ o.label }}</option></select></div>' +
    '<div class="form-group"><label class="form-label">说明</label><textarea class="form-textarea" v-model="applyDesc" rows="2" placeholder="补充说明"></textarea></div>' +
    '<div style="display:flex;gap:10px;">' +
    '<button class="btn btn-outline" style="flex:1;justify-content:center;" @click="showApply=false">取消</button>' +
    '<button class="btn" style="flex:1;justify-content:center;background:linear-gradient(135deg,#E8A838,#c7851c);color:#fff;box-shadow:0 4px 12px rgba(232,168,56,0.3);" @click="doApply" :disabled="applying"><i v-if="applying" class="fas fa-spinner fa-spin"></i><i v-else class="fas fa-paper-plane"></i> {{ applying?"提交中...":"提交申请" }}</button></div>' +
    '<div v-if="applyResult" style="margin-top:12px;color:var(--co-success);text-align:center;">{{ applyResult }}</div>' +
    '</div></div></div>' +
    '</div>',
  data: function() { return {
    loading:true,active:[],pending:[],expired:[],
    showApply:false,applyType:'Location=福建',applyDesc:'',applying:false,applyResult:'',
    qualOptions:[
      {value:'Location=福建',label:'Location=福建（产地认证）'},
      {value:'Capability=制茶',label:'Capability=制茶（加工能力）'},
      {value:'Quality=有机',label:'Quality=有机（品质认证）'},
      {value:'Grade=3',label:'Grade=3（等级评定）'},
    ],
    typeColors:{Location:{color:'#0369a1',bg:'#e0f2fe'},Capability:{color:'#92400e',bg:'#fef3c7'},Quality:{color:'#0e6a3b',bg:'#e6f4ea'},Grade:{color:'#6b21a8',bg:'#f3e8ff'},Organic:{color:'#065f46',bg:'#d1fae5'}},
    typeIcons:{Location:'fa-map-marker-alt',Capability:'fa-tools',Quality:'fa-check-circle',Grade:'fa-star',Organic:'fa-leaf'},
  };},
  mounted:function(){this.fetchQuals();},
  methods:{
    fetchQuals:function(){
      var self=this;
      var user=window.App.currentUser;
      if(!user){self.loading=false;return;}
      API.getMyQualifications(user.id).then(function(res){
        var quals=res.data||[];
        self.active=quals.filter(function(q){return q.status==='active';});
        self.pending=quals.filter(function(q){return q.status==='pending';});
        self.expired=quals.filter(function(q){return q.status==='expired'||q.status==='revoked';});
        self.loading=false;
      }).catch(function(){self.loading=false;});
    },
    tagStyle:function(type){
      var tc=this.typeColors[type]||{color:'#475569',bg:'#f1f5f9'};
      return {color:tc.color,borderColor:tc.color,background:tc.bg};
    },
    applyQual:function(){this.showApply=true;this.applyResult='';},
    doApply:function(){
      var self=this;
      var parts=this.applyType.split('=');
      var user=window.App.currentUser;
      this.applying=true;
      API.applyQualification({holder_id:user.id,holder_name:user.name,type:parts[0],value:parts[1]}).then(function(res){
        self.applying=false;
        self.applyResult='申请已提交，等待审核';
        setTimeout(function(){self.showApply=false;self.fetchQuals();},1500);
      }).catch(function(){self.applying=false;});
    }
  }
};
