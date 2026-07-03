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
    '<i :class="\'fas \'+(typeIcons[q.type]||\'fa-tag\')" style="margin-right:4px;"></i>{{ typeLabel[q.type]||q.type }}={{ q.value }}' +
    '<span style="font-size:0.7rem;opacity:0.6;display:block;">到期: {{ q.expires_at || "长期" }}</span></div></div>' +
    /* Pending */
    '<h4 v-if="pending.length" style="margin-bottom:8px;">待审核（{{ pending.length }}）</h4>' +
    '<div v-if="pending.length" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">' +
    '<div v-for="q in pending" :key="q.id" class="tag" style="background:#fef3c7;color:#92400e;">{{ typeLabel[q.type]||q.type }}={{ q.value }} <span style="font-size:0.7rem;">审核中</span></div></div>' +
    /* Expired */
    '<h4 v-if="expired.length" style="margin-bottom:8px;">已失效（{{ expired.length }}）</h4>' +
    '<div v-if="expired.length" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">' +
    '<div v-for="q in expired" :key="q.id" class="tag" style="background:#fee2e2;color:#991b1b;text-decoration:line-through;">{{ typeLabel[q.type]||q.type }}={{ q.value }}</div></div>' +
    '<base-empty v-if="!active.length&&!pending.length&&!expired.length" icon="fa-id-card" title="暂无资质" description="申请资质后可在需求市场看到匹配的定制订单" />' +
    '<button class="btn" style="background:linear-gradient(135deg,#E8A838,#c7851c);color:#fff;box-shadow:0 4px 16px rgba(232,168,56,0.3);padding:10px 24px;font-size:0.9rem;font-weight:600;" @click="applyQual"><i class="fas fa-plus-circle"></i> 申请新资质</button>' +
    '</div></div>' +
    /* Modal */
    '<div v-if="showApply" class="modal-overlay" @click.self="showApply=false">' +
    '<div class="modal-content" style="max-width:500px;">' +
    '<div class="modal-header"><h3 class="modal-title"><i class="fas fa-plus-circle" style="color:var(--co-warning);margin-right:6px;"></i>申请新资质</h3><button class="modal-close" @click="showApply=false"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    /* Type selector */
    '<div class="form-group"><label class="form-label">资质类型 *</label>' +
    '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
    '<button v-for="t in qualTypes" :key="t.key" @click="applyType=t.key" ' +
    'style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border-radius:var(--rd-sm);font-size:0.82rem;font-weight:600;cursor:pointer;transition:all 0.15s;font-family:inherit;" ' +
    ':style="applyType===t.key?{background:t.color,color:\'#fff\',border:\'none\',boxShadow:\'0 2px 6px \'+t.shadow}:{background:\'#fff\',color:t.color,border:\'1.5px solid \'+t.border}" ' +
    '><i :class="\'fas \'+t.icon"></i> {{ t.label }}</button>' +
    '</div></div>' +
    /* Value selector */
    '<div class="form-group" style="margin-top:16px;"><label class="form-label">资质值 *</label>' +
    '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
    '<button v-for="v in currentValues" :key="v" @click="applyValue=v" ' +
    'style="display:inline-flex;align-items:center;gap:3px;padding:6px 14px;border-radius:var(--rd-sm);font-size:0.82rem;font-weight:500;cursor:pointer;transition:all 0.15s;font-family:inherit;" ' +
    ':style="applyValue===v?{background:activeTypeColor,color:\'#fff\',border:\'none\',boxShadow:\'0 2px 6px rgba(0,0,0,0.15)\'}:{background:\'#fff\',color:\'var(--co-neutral-700)\',border:\'1px solid var(--co-neutral-300)\'}" ' +
    '>{{ v }}</button>' +
    '</div></div>' +
    /* Preview */
    '<div v-if="applyType&&applyValue" style="margin-top:16px;padding:12px;background:var(--co-neutral-50);border-radius:var(--rd-md);text-align:center;">' +
    '<span style="font-size:0.8rem;color:var(--co-neutral-500);">将要申请：</span>' +
    '<span style="font-weight:700;font-size:0.95rem;display:inline-flex;align-items:center;gap:4px;margin-left:4px;">' +
    '<span class="tag tag-active">{{ applyType }}={{ applyValue }}</span></span></div>' +
    /* Actions */
    '<div style="display:flex;gap:10px;margin-top:16px;">' +
    '<button @click="showApply=false" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;flex:1;padding:10px 20px;border:1px solid var(--co-neutral-300);border-radius:var(--rd-md);font-size:0.88rem;font-weight:500;cursor:pointer;background:#fff;color:var(--co-neutral-600);transition:all 0.2s;" onmouseover="this.style.background=\'var(--co-neutral-50)\';this.style.borderColor=\'var(--co-neutral-400)\'" onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'var(--co-neutral-300)\'">取消</button>' +
    '<button @click="doApply" :disabled="applying||!applyType||!applyValue" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;flex:1;padding:10px 20px;border:none;border-radius:var(--rd-md);font-size:0.88rem;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#E8A838,#D97706);color:#fff;box-shadow:0 3px 12px rgba(232,168,56,0.3);transition:all 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 5px 18px rgba(232,168,56,0.4)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 3px 12px rgba(232,168,56,0.3)\'"><i v-if="applying" class="fas fa-spinner fa-spin"></i><i v-else class="fas fa-paper-plane"></i> {{ applying?"提交中...":"提交申请" }}</button></div>' +
    '<div v-if="applyResult" style="margin-top:12px;color:var(--co-success);text-align:center;font-weight:600;">{{ applyResult }}</div>' +
    '</div></div></div>' +
    '</div>',
  data: function() { return {
    loading:true,active:[],pending:[],expired:[],
    showApply:false,applyType:'',applyValue:'',applying:false,applyResult:'',
    qualTypes:[
      {key:'Location',label:'产地',icon:'fa-map-marker-alt',color:'#0369a1',border:'#bae0f8',shadow:'rgba(3,105,161,0.3)'},
      {key:'Capability',label:'加工能力',icon:'fa-tools',color:'#92400e',border:'#fde68a',shadow:'rgba(146,64,14,0.3)'},
      {key:'Quality',label:'品质认证',icon:'fa-check-circle',color:'#0e6a3b',border:'#b7e4c7',shadow:'rgba(14,106,59,0.3)'},
      {key:'Grade',label:'等级',icon:'fa-star',color:'#6b21a8',border:'#e9d5ff',shadow:'rgba(107,33,168,0.3)'},
      {key:'Organic',label:'有机认证',icon:'fa-leaf',color:'#065f46',border:'#a7f3d0',shadow:'rgba(6,95,70,0.3)'},
    ],
    qualValues:{
      Location:['三明','南平','宁德','福州','龙岩','莆田','泉州','漳州','厦门'],
      Capability:['制茶','果蔬加工','糕点制作','酿造','干货加工','冷冻加工'],
      Quality:['有机','绿色','地理标志','无公害'],
      Grade:['1','2','3','4','5'],
      Organic:['是','否'],
    },
    typeColors:{Location:{color:'#0369a1',bg:'#e0f2fe'},Capability:{color:'#92400e',bg:'#fef3c7'},Quality:{color:'#0e6a3b',bg:'#e6f4ea'},Grade:{color:'#6b21a8',bg:'#f3e8ff'},Organic:{color:'#065f46',bg:'#d1fae5'}},
    typeIcons:{Location:'fa-map-marker-alt',Capability:'fa-tools',Quality:'fa-check-circle',Grade:'fa-star',Organic:'fa-leaf'},
    typeLabel:{Location:'产地',Capability:'加工能力',Quality:'品质认证',Grade:'等级',Organic:'有机认证'},
  };},
  computed:{
    currentValues:function(){
      return this.applyType ? (this.qualValues[this.applyType]||[]) : [];
    },
    activeTypeColor:function(){
      var t=this.qualTypes.find(function(t){return t.key===this.applyType;},this);
      return t?t.color:'var(--co-primary-500)';
    },
  },
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
    applyQual:function(){this.showApply=true;this.applyType='';this.applyValue='';this.applyResult='';},
    doApply:function(){
      var self=this;
      if(!this.applyType||!this.applyValue){return;}
      var user=window.App.currentUser;
      this.applying=true;
      API.applyQualification({holder_id:user.id,holder_name:user.name,type:this.applyType,value:this.applyValue}).then(function(res){
        self.applying=false;
        self.applyResult='申请已提交，等待审核';
        setTimeout(function(){self.showApply=false;self.fetchQuals();},1500);
      }).catch(function(){self.applying=false;});
    }
  }
};
