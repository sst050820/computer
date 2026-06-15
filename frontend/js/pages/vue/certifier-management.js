var VueCertifierManagement = {
  name: 'VueCertifierManagement',
  template: '<div class="card"><div class="card-header"><i class="fas fa-building card-icon" style="background:#f3e8ff;color:#6b21a8;"></i><span class="card-title">审核方管理</span></div>' +
    '<div v-if="loading" style="text-align:center;padding:40px;">加载中...</div>' +
    '<div v-else-if="err" style="text-align:center;padding:40px;color:var(--co-error);">{{ err }}</div>' +
    '<div v-else-if="list.length===0" style="text-align:center;padding:40px;color:var(--co-neutral-500);">暂无审核方数据</div>' +
    '<div v-else><table class="data-table"><thead><tr><th>名称</th><th>管辖类型</th><th>已颁发</th><th>操作</th></tr></thead><tbody>' +
    '<tr v-for="c in list" :key="c.id"><td><strong>{{ c.name }}</strong></td>' +
    '<td><span v-for="t in c.types" :key="t" class="tag" style="margin-right:4px;font-size:0.75rem;">{{ t }}</span></td>' +
    '<td>{{ c.count }} 项</td>' +
    '<td><button @click="showDetail(c)" style="display:inline-flex;align-items:center;gap:4px;padding:5px 12px;border:none;border-radius:var(--rd-sm);font-size:0.78rem;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#2D6A4F,#40916C);color:#fff;box-shadow:0 1px 4px rgba(45,106,79,0.2);transition:all 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 3px 8px rgba(45,106,79,0.3)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 1px 4px rgba(45,106,79,0.2)\'">查看</button></td>' +
    '</tr></tbody></table></div>' +
    '<div v-if="detail" class="modal-overlay" @click.self="detail=null"><div class="modal-content" style="max-width:520px;">' +
    '<div class="modal-header"><h3>{{ detail.name }}</h3><button class="modal-close" @click="detail=null"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body"><p style="margin-bottom:8px;">管辖类型: <span v-for="t in detail.types" :key="t" class="tag tag-active" style="margin-right:4px;">{{ t }}</span></p>' +
    '<p style="margin-bottom:12px;">已颁发: <strong>{{ detail.count }}</strong> 项</p>' +
    '<div v-if="detail.quals&&detail.quals.length"><div v-for="q in detail.quals" :key="q.id" style="padding:10px;border-bottom:1px solid var(--co-neutral-100);display:flex;justify-content:space-between;">' +
    '<div><strong>{{ typeLabel[q.type]||q.type }}={{ q.value }}</strong><br><small style="color:var(--co-neutral-500);">{{ q.holder_name }}</small></div>' +
    '<base-badge :color="q.status===\'active\'?\'green\':\'red\'">{{ q.status==="active"?"有效":"失效" }}</base-badge></div></div>' +
    '<button @click="detail=null" style="width:100%;justify-content:center;padding:10px 20px;border:1px solid var(--co-neutral-300);border-radius:var(--rd-md);font-size:0.88rem;font-weight:500;cursor:pointer;margin-top:12px;background:#fff;color:var(--co-neutral-600);transition:all 0.2s;" onmouseover="this.style.background=\'var(--co-neutral-50)\';this.style.borderColor=\'var(--co-neutral-400)\'" onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'var(--co-neutral-300)\'">关闭</button>' +
    '</div></div></div></div>',
  data: function() { return { list:[], loading:true, err:'', detail:null, typeLabel:{Location:'产地',Capability:'加工能力',Quality:'品质认证',Grade:'等级',Organic:'有机认证'} }; },
  mounted: function() { this.load(); },
  methods: {
    load: function() {
      var self = this;
      this.loading = true; this.err = '';
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/admin/qualifications');
      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            var res = JSON.parse(xhr.responseText);
            var quals = (res && res.data) ? res.data : [];
            var map = {};
            for (var i = 0; i < quals.length; i++) {
              var q = quals[i];
              var cid = q.certifier_id || '';
              var cname = q.certifier_name || '';
              if (!cid || !cname) continue;
              if (!map[cid]) map[cid] = { id: cid, name: cname, types: {}, count: 0, quals: [] };
              map[cid].types[q.type] = true;
              map[cid].count++;
              map[cid].quals.push(q);
            }
            var result = [];
            for (var k in map) {
              var c = map[k];
              result.push({ id: c.id, name: c.name, types: Object.keys(c.types), count: c.count, quals: c.quals });
            }
            self.list = result;
          } catch(e) { self.err = '数据解析错误'; }
        } else { self.err = '请求失败: ' + xhr.status; }
        self.loading = false;
      };
      xhr.onerror = function() { self.err = '网络错误'; self.loading = false; };
      xhr.send();
    },
    showDetail: function(c) { this.detail = c; }
  }
};
