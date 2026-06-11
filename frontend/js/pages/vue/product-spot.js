var VueProductSpot = {
  name: 'VueProductSpot',
  template: '<div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-check-circle card-icon" style="background:#fee2e2;color:var(--co-error);"></i><span class="card-title">商品抽检合规仪表盘</span></div>' +
    '<p style="color:var(--co-neutral-500);margin-bottom:16px;font-size:0.85rem;">随机抽检商品追溯信息完整性，快速发现档案缺失问题</p>' +
    '<div style="display:flex;gap:10px;margin-bottom:16px;">' +
    '<button class="btn" style="padding:12px 24px;background:linear-gradient(135deg,var(--co-error),#b91c1c);color:#fff;font-weight:700;box-shadow:0 4px 16px rgba(209,67,67,0.3);border:none;cursor:pointer;" @click="doSpot" :disabled="loading"><i v-if="loading" class="fas fa-spinner fa-spin"></i><i v-else class="fas fa-random"></i> 开始抽检</button>' +
    '<span style="font-size:0.8rem;color:var(--co-neutral-500);align-self:center;">共 {{ samples.length }} 件商品 · 每次随机抽取 5 件</span></div>' +
    '<div v-if="results.length">' +
    /* Stats */
    '<div class="stat-grid" style="margin-bottom:16px;">' +
    '<div class="stat-card" style="text-align:center;"><div style="font-size:1.8rem;font-weight:700;color:var(--co-primary-500);">{{ results.length }}</div><div style="font-size:0.75rem;color:var(--co-neutral-500);">抽检数量</div></div>' +
    '<div class="stat-card" style="text-align:center;"><div style="font-size:1.8rem;font-weight:700;color:var(--co-success);">{{ okCount }}</div><div style="font-size:0.75rem;color:var(--co-neutral-500);">有档案</div></div>' +
    '<div class="stat-card" style="text-align:center;"><div style="font-size:1.8rem;font-weight:700;color:var(--co-error);">{{ results.length-okCount }}</div><div style="font-size:0.75rem;color:var(--co-neutral-500);">缺档案</div></div>' +
    '<div class="stat-card" style="text-align:center;"><div style="font-size:1.8rem;font-weight:700;" :style="{color:rate>=80?\'var(--co-success)\':rate>=50?\'var(--co-warning)\':\'var(--co-error)\'}">{{ rate }}%</div><div style="font-size:0.75rem;color:var(--co-neutral-500);">合规率</div></div></div>' +
    /* Results table */
    '<div class="card" style="padding:0;overflow:hidden;"><div style="padding:12px 16px;font-weight:600;border-bottom:1px solid var(--co-neutral-100);background:var(--co-neutral-50);">抽检明细</div>' +
    '<table class="data-table"><thead><tr><th>商品</th><th>产地</th><th>店铺</th><th>追溯档案</th><th>合规</th></tr></thead><tbody>' +
    '<tr v-for="r in results" :key="r.id"><td><strong>{{ r.name }}</strong></td><td>{{ r.origin }}</td><td>{{ r.shop_name }}</td>' +
    '<td>{{ r.archiveNodes }} 节点</td>' +
    '<td><base-badge :color="r.archiveNodes>0?\'green\':\'red\'">{{ r.archiveNodes>0?"✅":"❌" }}</base-badge></td></tr></tbody></table></div>' +
    /* Detail */
    '<div v-if="results.some(function(x){return x.archiveNodes>0;})" style="margin-top:16px;">' +
    '<h4 style="margin-bottom:8px;">有档案商品的追溯摘要</h4>' +
    '<div v-for="r in results" :key="\'a\'+r.id">' +
    '<div v-if="r.archiveNodes>0" class="card" style="margin-bottom:8px;padding:var(--sp-4);">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><strong>{{ r.name }}</strong><span style="font-size:0.75rem;color:var(--co-neutral-500);">{{ r.archiveNodes }} 个追溯节点</span></div>' +
    '<div class="timeline" style="margin-left:8px;"><div v-for="n in (r.archive||[]).slice(0,3)" :key="n.step" class="timeline-step" style="padding-bottom:4px;">' +
    '<h5 style="font-size:0.75rem;">{{ n.step }}<span v-if="!n.public" style="color:var(--co-error);font-size:0.6rem;"> 🔒</span></h5><p style="font-size:0.65rem;">{{ n.location }} · {{ n.time }}</p></div></div>' +
    '<p v-if="r.archiveNodes>3" style="font-size:0.7rem;color:var(--co-neutral-400);text-align:center;">...还有 {{ r.archiveNodes-3 }} 个节点</p></div></div></div></div>' +
    '<div v-else-if="samples.length===0" style="text-align:center;padding:40px;color:var(--co-neutral-500);">暂无商品数据</div>' +
    '</div></div>',
  data: function() { return { samples:[],results:[],loading:false }; },
  computed: {
    okCount: function() { var c=0; this.results.forEach(function(r){if(r.archiveNodes>0)c++;}); return c; },
    rate: function() { return this.results.length>0 ? Math.round(this.okCount/this.results.length*100) : 0; }
  },
  mounted: function() { var self=this; API._fetch('/api/products').then(function(r){self.samples=(r&&r.data)||[];}).catch(function(){}); },
  methods: {
    doSpot: function() {
      if (this.samples.length===0) { window.showToast&&window.showToast("暂无商品","info"); return; }
      var s=this.samples.slice().sort(function(){return Math.random()-0.5;});
      var picked = s.slice(0,5);
      var self=this; this.loading=true;
      Promise.all(picked.map(function(p){
        return API.regulatorSearch(p.id).then(function(r){var d=(r&&r.data&&r.data.length)?r.data[0]:null;p.archive=d?(d.archive||[]):[];p.archiveNodes=p.archive.length;return p;}).catch(function(){p.archive=[];p.archiveNodes=0;return p;});
      })).then(function(enriched){self.results=enriched;self.loading=false;}).catch(function(){self.results=picked;self.loading=false;});
    }
  }
};
