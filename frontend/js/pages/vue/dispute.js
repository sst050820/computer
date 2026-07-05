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
    '<button @click="showDetail(d)" style="display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border:none;border-radius:var(--rd-sm);font-size:0.82rem;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#2D6A4F,#40916C);color:#fff;box-shadow:0 2px 6px rgba(45,106,79,0.25);transition:all 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 4px 12px rgba(45,106,79,0.35)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 6px rgba(45,106,79,0.25)\'"><i class="fas fa-search"></i> 详情</button></div></div>' +
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
    '<button @click="detail=null" style="display:inline-flex;align-items:center;gap:6px;flex:1;justify-content:center;padding:10px 20px;border:1px solid var(--co-neutral-300);border-radius:var(--rd-md);font-size:0.88rem;font-weight:500;cursor:pointer;background:#fff;color:var(--co-neutral-600);transition:all 0.2s;" onmouseover="this.style.background=\'var(--co-neutral-50)\';this.style.borderColor=\'var(--co-neutral-400)\'" onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'var(--co-neutral-300)\'">关闭</button></div>' +
    '</div></div></div>' +
    '<div v-if="msg" style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#fff;padding:12px 24px;border-radius:var(--rd-full);box-shadow:var(--sh-lg);z-index:999;font-weight:500;">{{ msg }}</div>' +
    '</div></div>',
  data: function() { return { detail:null, msg:'', disputes:[], loading:true }; },
  mounted: function() { this.load(); },
  methods: {
    load: function() {
      var self = this;
      API._fetch('/api/admin/disputes').then(function(r) { self.disputes = (r&&r.data)||[]; self.loading = false; }).catch(function() { self.loading = false; });
    },
    flash: function(m){var self=this;this.msg=m;clearTimeout(this._t);this._t=setTimeout(function(){self.msg='';},2000);},
    showDetail: function(d){this.detail=d;},
  }
};
