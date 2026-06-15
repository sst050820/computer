/* VueReviewList — Certifier: Review/Audit Management */
const VueReviewList = {
  name: 'VueReviewList',
  template: '<div>' +
    '<div class="card"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">' +
    '<span style="display:flex;align-items:center;gap:8px;"><i class="fas fa-check-double card-icon" style="background:#fef3c7;color:var(--co-warning);"></i><span class="card-title">资质审核</span></span>' +
    '<span style="font-size:0.8rem;color:var(--co-neutral-500);">待审 {{ reviews.length }} 项</span>' +
    '</div>' +
    /* Jurisdiction hint */
    '<div v-if="jurisdiction.length" style="padding:10px 16px;background:var(--co-primary-50);border-bottom:1px solid var(--co-neutral-100);display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
    '<span style="font-size:0.75rem;color:var(--co-neutral-500);">管辖类型：</span>' +
    '<span v-for="j in jurisdiction" :key="j" class="tag tag-active" style="font-size:0.7rem;">{{ j }}</span>' +
    '</div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="reviews.length === 0" icon="fa-check-double" title="暂无待审核申请" description="所有资质申请已处理完毕">' +
    '<button @click="goTo(\'review-history\')" style="display:inline-flex;align-items:center;gap:6px;margin-top:12px;padding:10px 24px;border:none;border-radius:var(--rd-md);font-size:0.88rem;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#2D6A4F,#40916C);color:#fff;box-shadow:0 2px 8px rgba(45,106,79,0.25);transition:all 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 4px 14px rgba(45,106,79,0.35)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 8px rgba(45,106,79,0.25)\'"><i class="fas fa-history"></i> 查看审核历史</button>' +
    '</base-empty>' +
    '<div v-else>' +
    /* Review cards */
    '<div v-for="r in reviews" :key="r.id" class="card" style="padding:0;margin:12px 16px;overflow:hidden;">' +
    /* Header */
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:var(--co-neutral-50);border-bottom:1px solid var(--co-neutral-100);">' +
    '<div style="display:flex;align-items:center;gap:10px;">' +
    '<div style="width:36px;height:36px;border-radius:50%;background:#fef3c7;display:flex;align-items:center;justify-content:center;color:var(--co-warning);font-size:0.9rem;"><i class="fas fa-clock"></i></div>' +
    '<div><strong style="font-size:0.9rem;">{{ r.holder_name }}</strong>' +
    '<p style="font-size:0.7rem;color:var(--co-neutral-500);">{{ r.created_at || "刚刚" }}</p></div>' +
    '</div>' +
    '<span class="tag" :style="tagStyle(r.type)" style="font-size:0.75rem;font-weight:600;">' +
    '<i :class="\'fas \'+(typeIcons[r.type]||\'fa-tag\')" style="margin-right:3px;"></i>{{ typeLabel[r.type]||r.type }}={{ r.value }}</span>' +
    '</div>' +
    /* Body */
    '<div style="padding:14px 16px;">' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.82rem;margin-bottom:12px;">' +
    '<div><span style="color:var(--co-neutral-500);">申请人ID</span><div style="font-weight:500;">{{ r.holder_id }}</div></div>' +
    '<div><span style="color:var(--co-neutral-500);">资质类型</span><div style="font-weight:500;">{{ typeLabel[r.type]||r.type }}</div></div>' +
    '<div><span style="color:var(--co-neutral-500);">资质值</span><div style="font-weight:500;">{{ r.value }}</div></div>' +
    '<div><span style="color:var(--co-neutral-500);">管辖匹配</span>' +
    '<span v-if="inJurisdiction(r)" style="color:var(--co-success);font-weight:600;"><i class="fas fa-check-circle"></i> 是</span>' +
    '<span v-else style="color:var(--co-error);font-weight:600;"><i class="fas fa-times-circle"></i> 否</span></div>' +
    '</div></div>' +
    /* Actions */
    '<div style="padding:10px 16px;border-top:1px solid var(--co-neutral-100);background:var(--co-neutral-50);display:flex;gap:8px;">' +
    '<span style="font-size:0.7rem;color:var(--co-neutral-400);text-transform:uppercase;letter-spacing:0.05em;align-self:center;flex-shrink:0;">审核</span>' +
    '<button @click="approveReview(r)" style="display:inline-flex;align-items:center;gap:5px;padding:7px 18px;border:none;border-radius:var(--rd-sm);font-size:0.84rem;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#2D6A4F,#40916C);color:#fff;box-shadow:0 2px 6px rgba(45,106,79,0.2);transition:all 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 3px 10px rgba(45,106,79,0.3)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 2px 6px rgba(45,106,79,0.2)\'"><i class="fas fa-check"></i> 通过</button>' +
    '<button @click="rejectReview(r)" style="display:inline-flex;align-items:center;gap:5px;padding:7px 18px;border:1.5px solid #e0c0c0;border-radius:var(--rd-sm);font-size:0.84rem;font-weight:500;cursor:pointer;background:#fff;color:#B85450;transition:all 0.2s;" onmouseover="this.style.background=\'#fef5f5\';this.style.borderColor=\'#D14343\';this.style.color=\'#D14343\'" onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'#e0c0c0\';this.style.color=\'#B85450\'"><i class="fas fa-times"></i> 拒绝</button>' +
    '</div>' +
    '</div></div>' +
    '</div></div>',
  data: function() { return {
    reviews: [], loading: true,
    typeColors: {Location:{color:'#0369a1',bg:'#e0f2fe'},Capability:{color:'#92400e',bg:'#fef3c7'},Quality:{color:'#0e6a3b',bg:'#e6f4ea'},Grade:{color:'#6b21a8',bg:'#f3e8ff'},Organic:{color:'#065f46',bg:'#d1fae5'}},
    typeIcons: {Location:'fa-map-marker-alt',Capability:'fa-tools',Quality:'fa-check-circle',Grade:'fa-star',Organic:'fa-leaf'},
    typeLabel: {Location:'产地',Capability:'加工能力',Quality:'品质认证',Grade:'等级',Organic:'有机认证'},
    jurisdictionMap: {u5:['Location','Grade'], u6:['Quality','Capability','Organic']},
  };},
  computed: {
    jurisdiction: function() {
      var user = window.App && window.App.currentUser;
      return (user && this.jurisdictionMap[user.id]) || [];
    },
  },
  mounted: function() { this.fetchData(); },
  methods: {
    fetchData: function() {
      var self = this;
      API.getReviewList().then(function(res) {
        self.reviews = res.data || [];
        self.loading = false;
      }).catch(function() { self.loading = false; });
    },
    inJurisdiction: function(r) {
      return this.jurisdiction.indexOf(r.type) >= 0;
    },
    tagStyle: function(type) {
      var tc = this.typeColors[type] || {color:'#475569',bg:'#f1f5f9'};
      return {color:tc.color,borderColor:tc.color,background:tc.bg};
    },
    approveReview: function(r) {
      if (!confirm('确认通过「' + r.holder_name + '」的 ' + r.type + '=' + r.value + ' 资质申请？')) return;
      var self = this;
      var user = window.App.currentUser;
      API.approveReview(r.id, user.id).then(function() {
        window.showToast('已批准通过', 'success');
        self.fetchData();
      }).catch(function() { window.showToast('操作失败', 'error'); });
    },
    rejectReview: function(r) {
      if (!confirm('确认拒绝「' + r.holder_name + '」的 ' + r.type + '=' + r.value + ' 资质申请？')) return;
      var self = this;
      API.rejectReview(r.id).then(function() {
        window.showToast('已拒绝', 'info');
        self.fetchData();
      }).catch(function() { window.showToast('操作失败', 'error'); });
    },
    goTo: function(page) { if (window.navigateTo) window.navigateTo(page); }
  }
};
