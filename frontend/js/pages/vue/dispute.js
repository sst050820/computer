var VueDispute = {
  name: 'VueDispute',
  template: '<div class="card"><div class="card-header"><i class="fas fa-gavel card-icon" style="background:#fef2f2;color:var(--co-error);"></i><span class="card-title">纠纷处理（{{ disputes.length }} 件）</span></div>' +
    '<p style="color:var(--co-neutral-500);font-size:0.85rem;margin-bottom:16px;">交易纠纷仲裁平台，管理员可查看全部加密信息并作出裁决</p>' +
    '<div v-for="d in disputes" :key="d.id" class="card" style="margin-bottom:10px;padding:var(--sp-4);" >' +
    '<div style="display:flex;justify-content:space-between;align-items:start;">' +
    '<div style="flex:1;"><h4 style="font-size:1rem;">#{{ d.id }} {{ d.title }}</h4>' +
    '<p style="font-size:0.85rem;color:var(--co-neutral-500);margin-top:4px;">当事人: {{ d.parties }}</p>' +
    '<p style="font-size:0.8rem;color:var(--co-neutral-500);">争议: {{ d.issue }}</p></div>' +
    '<base-badge :color="d.status===\'pending\'?\'amber\':\'green\'">{{ d.status==="pending"?"待处理":"已裁决" }}</base-badge></div>' +
    '<div style="display:flex;gap:8px;margin-top:10px;" >' +
    '<button class="btn btn-sm" style="background:var(--co-error);color:#fff;font-weight:600;border:none;cursor:pointer;" @click="resolve(d)"><i class="fas fa-gavel"></i> 裁决</button>' +
    '<button class="btn btn-sm" style="background:var(--co-primary-500);color:#fff;font-weight:600;border:none;cursor:pointer;" @click="showDetail(d)"><i class="fas fa-search"></i> 详情</button></div></div>' +
    /* Detail Modal */
    '<div v-if="detail" class="modal-overlay" @click.self="detail=null"><div class="modal-content" style="max-width:520px;">' +
    '<div class="modal-header"><h3>纠纷详情 #{{ detail.id }}</h3><button class="modal-close" @click="detail=null"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    '<div style="margin-bottom:16px;"><h4 style="font-size:1.1rem;">{{ detail.title }}</h4>' +
    '<p style="margin-top:4px;color:var(--co-neutral-500);">当事人: {{ detail.parties }}</p>' +
    '<p style="color:var(--co-neutral-500);">争议问题: {{ detail.issue }}</p></div>' +
    '<div style="background:var(--co-neutral-50);padding:16px;border-radius:var(--rd-md);margin-bottom:16px;">' +
    '<h5 style="margin-bottom:8px;">产品追溯信息（管理员完整可见）</h5>' +
    '<div class="timeline"><div class="timeline-step"><h5>种植环节</h5><p>原产地农场 · 2026-03-15</p></div>' +
    '<div class="timeline-step"><h5>加工环节</h5><p>加工车间 · 2026-03-20</p></div>' +
    '<div class="timeline-step"><h5>质检环节</h5><p>检测中心 · 2026-04-01</p></div></div></div>' +
    '<div style="display:flex;gap:8px;">' +
    '<button class="btn" style="flex:1;justify-content:center;background:var(--co-error);color:#fff;font-weight:600;border:none;cursor:pointer;" @click="resolve(detail);detail=null"><i class="fas fa-gavel"></i> 确认裁决</button>' +
    '<button class="btn" style="flex:1;justify-content:center;background:var(--co-neutral-100);color:var(--co-neutral-600);border:none;cursor:pointer;" @click="detail=null">关闭</button></div>' +
    '</div></div></div>' +
    '<div v-if="msg" style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#fff;padding:12px 24px;border-radius:var(--rd-full);box-shadow:var(--sh-lg);z-index:999;font-weight:500;">{{ msg }}</div>' +
    '</div></div>',
  data: function() { return { detail:null, msg:'', disputes:[{id:'D001',title:'产品质量纠纷',parties:'张果农 vs 山东丰收食品厂',issue:'收到的有机铁观音与描述不符，品质未达到有机标准',status:'pending'},{id:'D002',title:'物流延误投诉',parties:'李茶商 vs 浙江龙井茶园',issue:'下单7天后仍未收到货物，商家未提供有效物流信息',status:'pending'}] }; },
  methods: {
    flash: function(m){var self=this;this.msg=m;clearTimeout(this._t);this._t=setTimeout(function(){self.msg='';},2000);},
    showDetail: function(d){this.detail=d;},
    resolve: function(d){d.status='resolved';this.flash('✅ 纠纷 #'+d.id+' 已裁决');}
  }
};
