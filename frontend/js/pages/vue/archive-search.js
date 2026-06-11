var VueArchiveSearch = {
  name: 'VueArchiveSearch',
  template: '<div class="card"><div class="card-header"><i class="fas fa-search card-icon" style="background:#e0f2fe;color:var(--co-info);"></i><span class="card-title">产品档案全链路查询</span></div>' +
    '<div style="display:flex;gap:10px;margin-bottom:16px;">' +
    '<select class="form-select" v-model="pid" style="flex:1;"><option value="">-- 选择要查询的产品 --</option>' +
    '<option v-for="p in allProducts" :key="p.id" :value="p.id">{{ p.name }} · {{ p.origin }} · ¥{{ (p.price||0).toFixed(1) }}</option></select>' +
    '<button class="btn" style="background:var(--co-error);color:#fff;font-weight:600;border:none;cursor:pointer;padding:10px 24px;" @click="doSearch"><i class="fas fa-search"></i> 查询</button></div>' +
    '<div v-if="loading" style="text-align:center;padding:60px;"><i class="fas fa-spinner fa-spin" style="font-size:2rem;color:var(--co-primary-400);display:block;margin-bottom:12px;"></i>查询中...</div>' +
    '<div v-if="!loading && !done" style="text-align:center;padding:60px;color:var(--co-neutral-500);"><i class="fas fa-search" style="font-size:3rem;opacity:0.1;display:block;margin-bottom:12px;"></i>请选择产品后点击查询</div>' +
    '<div v-if="!loading && done && !product" style="text-align:center;padding:60px;color:var(--co-neutral-500);"><i class="fas fa-box-open" style="font-size:3rem;opacity:0.1;display:block;margin-bottom:12px;"></i>未找到该产品档案</div>' +
    '<div v-if="!loading && done && product">' +
    '<div style="display:flex;gap:16px;align-items:start;padding-bottom:16px;border-bottom:1px solid var(--co-neutral-100);margin-bottom:16px;">' +
    '<div style="font-size:3rem;">{{ icon }}</div><div style="flex:1;"><h3 style="font-size:1.1rem;">{{ product.name }}</h3>' +
    '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">' +
    '<base-badge color="red">监管完整可见</base-badge>' +
    '<base-badge v-if="product.certification" color="green">{{ product.certification }}</base-badge></div>' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:10px;">' +
    '<div style="background:var(--co-neutral-50);border-radius:6px;padding:8px;text-align:center;"><div style="font-size:0.65rem;color:var(--co-neutral-500);">产地</div><div style="font-weight:600;">{{ product.origin||"-" }}</div></div>' +
    '<div style="background:var(--co-neutral-50);border-radius:6px;padding:8px;text-align:center;"><div style="font-size:0.65rem;color:var(--co-neutral-500);">品类</div><div style="font-weight:600;">{{ product.category||"-" }}</div></div>' +
    '<div style="background:var(--co-neutral-50);border-radius:6px;padding:8px;text-align:center;"><div style="font-size:0.65rem;color:var(--co-neutral-500);">价格</div><div style="font-weight:600;color:var(--co-accent-berry);">¥{{ (product.price||0).toFixed(1) }}</div></div>' +
    '<div style="background:var(--co-neutral-50);border-radius:6px;padding:8px;text-align:center;"><div style="font-size:0.65rem;color:var(--co-neutral-500);">店铺</div><div style="font-weight:600;">{{ product.shop_name||"-" }}</div></div></div></div></div>' +
    '<h4 style="margin-bottom:10px;">全链路追溯档案（{{ archive.length }} 节点）</h4>' +
    '<div v-if="archive.length" class="timeline" style="margin-left:8px;">' +
    '<div v-for="n in archive" :key="n.step" class="timeline-step"><div style="display:flex;justify-content:space-between;"><h5>{{ n.step }}<span v-if="!n.public" style="font-size:0.65rem;color:var(--co-error);margin-left:4px;">🔒加密</span></h5><base-badge :color="n.public?\'green\':\'red\'">{{ n.public?"公开":"加密" }}</base-badge></div><p style="font-size:0.8rem;">{{ n.location }} · {{ n.time }}</p><p style="font-size:0.75rem;color:var(--co-neutral-500);">{{ n.desc }}</p></div></div>' +
    '<div v-else style="text-align:center;padding:30px;color:var(--co-neutral-500);">该产品尚未建立追溯档案节点</div>' +
    '</div></div>',
  data: function() { return { pid:'',allProducts:[],product:null,archive:[],icon:'📦',loading:false,done:false }; },
  mounted: function() { var self=this; API._fetch('/api/products').then(function(r){self.allProducts=(r&&r.data)||[];}).catch(function(){}); },
  methods: {
    doSearch: function() {
      if (!this.pid) { window.showToast&&window.showToast('请先选择产品','info'); return; }
      var self=this; this.loading=true; this.done=true;
      API.regulatorSearch(this.pid).then(function(r) {
        var d = (r&&r.data&&r.data.length) ? r.data[0] : null;
        self.product = d ? d.product : null;
        self.archive = d ? (d.archive||[]) : [];
        var m={茶叶:'🍵',果蔬:'🍎',谷物:'🌾',畜牧:'🥩',菌菇:'🍄',蜂蜜:'🍯',零食:'🍪',粮油:'🫒'};
        self.icon = (self.product&&m[self.product.category])||'📦';
        self.loading = false;
      }).catch(function(){self.loading=false;});
    }
  }
};
