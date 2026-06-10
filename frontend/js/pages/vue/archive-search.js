/* VueArchiveSearch — Regulator: Product Archive Traceability Search */
const VueArchiveSearch = {
  name: 'VueArchiveSearch',
  template: '<div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-search card-icon" style="background:#e0f2fe;color:var(--co-info);"></i><span class="card-title">产品档案全链路查询</span></div>' +
    '<div style="display:flex;gap:12px;margin-bottom:20px;">' +
    '<input class="form-input" v-model="keyword" placeholder="输入产品名称/编号/批次" style="flex:1;" @keyup.enter="doSearch" />' +
    '<base-button @click="doSearch" :loading="loading"><i class="fas fa-search"></i> 查询</base-button></div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="!searched" icon="fa-search" title="输入关键词查询产品档案" />' +
    '<base-empty v-else-if="results.length === 0" icon="fa-box-open" title="未找到匹配产品" />' +
    '<div v-else>' +
    '<div v-for="r in results" :key="r.product?.id" class="card" style="margin-bottom:12px;">' +
    '<h4>{{ r.product?.name || "" }} <base-badge color="red">监管完整可见</base-badge></h4>' +
    '<p style="font-size:0.85rem;color:var(--co-neutral-500);margin:4px 0;">产地：{{ r.product?.origin }} | 品类：{{ r.product?.category }} | ¥{{ (r.product?.price||0).toFixed(1) }}</p>' +
    '<div v-if="(r.archive||[]).length" class="timeline" style="margin-top:12px;">' +
    '<div v-for="n in r.archive" :key="n.step" class="timeline-step">' +
    '<h5>{{ n.step }}</h5><p>{{ n.location }} · {{ n.time }} · {{ n.desc }}</p></div></div></div></div>' +
    '</div></div>',
  data: function() { return { keyword: '', results: [], loading: false, searched: false }; },
  methods: {
    doSearch: function() {
      var kw = this.keyword.trim();
      if (!kw) return;
      var self = this;
      this.loading = true; this.searched = true;
      API.regulatorSearch(kw).then(function(res) {
        self.results = res.data || [];
        self.loading = false;
      }).catch(function() { self.loading = false; });
    }
  }
};
