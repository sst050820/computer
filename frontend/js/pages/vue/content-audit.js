var VueContentAudit = {
  name: 'VueContentAudit',
  template: '<div class="card"><div class="card-header"><i class="fas fa-eye card-icon" style="background:#f3e8ff;color:#6b21a8;"></i><span class="card-title">内容审核</span></div>' +
    '<base-loading v-if="loading" />' +
    '<div v-else>' +
    '<div style="margin-bottom:20px;"><h4 style="margin-bottom:8px;">待审商品（{{ products.length }}）</h4>' +
    '<table v-if="products.length" class="data-table"><thead><tr><th>商品</th><th>发布者</th><th>品类</th><th>价格</th><th>操作</th></tr></thead><tbody>' +
    '<tr v-for="p in products" :key="p.id"><td><strong>{{ p.name }}</strong></td><td>{{ p.shop_name }}</td><td>{{ p.category }}</td><td>¥{{ (p.price||0).toFixed(1) }}</td>' +
    '<td><button @click="approve(p)" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:none;border-radius:var(--rd-sm);font-size:0.8rem;font-weight:600;cursor:pointer;margin-right:4px;background:linear-gradient(135deg,#2D6A4F,#40916C);color:#fff;box-shadow:0 1px 4px rgba(45,106,79,0.2);transition:all 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 3px 8px rgba(45,106,79,0.3)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 1px 4px rgba(45,106,79,0.2)\'"><i class="fas fa-check"></i> 通过</button>' +
    '<button @click="remove(p)" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1.5px solid #e0c0c0;border-radius:var(--rd-sm);font-size:0.8rem;font-weight:500;cursor:pointer;background:#fff;color:#B85450;transition:all 0.2s;" onmouseover="this.style.background=\'#fef5f5\';this.style.borderColor=\'#D14343\';this.style.color=\'#D14343\'" onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'#e0c0c0\';this.style.color=\'#B85450\'"><i class="fas fa-ban"></i> 下架</button></td></tr></tbody></table>' +
    '<base-empty v-else icon="fa-check-circle" title="暂无待审商品" /></div>' +
    '<div><h4 style="margin-bottom:8px;">待审定需求（{{ customs.length }}）</h4>' +
    '<table v-if="customs.length" class="data-table"><thead><tr><th>需求</th><th>发布者</th><th>预算</th><th>操作</th></tr></thead><tbody>' +
    '<tr v-for="c in customs" :key="c.id"><td><strong>{{ c.title }}</strong></td><td>{{ c.consumer_name }}</td><td>{{ c.budget }}</td>' +
    '<td><button @click="approveCustom(c)" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:none;border-radius:var(--rd-sm);font-size:0.8rem;font-weight:600;cursor:pointer;margin-right:4px;background:linear-gradient(135deg,#2D6A4F,#40916C);color:#fff;box-shadow:0 1px 4px rgba(45,106,79,0.2);transition:all 0.2s;" onmouseover="this.style.transform=\'translateY(-1px)\';this.style.boxShadow=\'0 3px 8px rgba(45,106,79,0.3)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 1px 4px rgba(45,106,79,0.2)\'"><i class="fas fa-check"></i> 通过</button>' +
    '<button @click="removeCustom(c)" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1.5px solid #e0c0c0;border-radius:var(--rd-sm);font-size:0.8rem;font-weight:500;cursor:pointer;background:#fff;color:#B85450;transition:all 0.2s;" onmouseover="this.style.background=\'#fef5f5\';this.style.borderColor=\'#D14343\';this.style.color=\'#D14343\'" onmouseout="this.style.background=\'#fff\';this.style.borderColor=\'#e0c0c0\';this.style.color=\'#B85450\'"><i class="fas fa-ban"></i> 删除</button></td></tr></tbody></table>' +
    '<base-empty v-else icon="fa-check-circle" title="暂无待审定需求" /></div></div>' +
    /* feedback toast */
    '<div v-if="msg" style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#fff;padding:12px 24px;border-radius:var(--rd-full);box-shadow:var(--sh-lg);z-index:999;font-weight:500;">{{ msg }}</div>' +
    '</div>',
  data: function() { return { products:[], customs:[], loading:true, msg:'' }; },
  mounted: function() {
    var self = this;
    Promise.all([API._fetch('/api/products'), API._fetch('/api/public-orders')]).then(function(r) {
      self.products = ((r[0]&&r[0].data)||[]).slice(0,8);
      self.customs = ((r[1]&&r[1].data)||[]);
      self.loading = false;
    }).catch(function(){self.loading=false;});
  },
  methods: {
    flash: function(m){var self=this;this.msg=m;clearTimeout(this._t);this._t=setTimeout(function(){self.msg='';},2000);},
    approve: function(p){this.flash('✅ 已通过: '+p.name); this.products=this.products.filter(function(x){return x.id!==p.id;});},
    remove: function(p){
      if(!confirm('确定下架商品「'+p.name+'」吗？')) return;
      var self=this;
      API._fetch('/api/products/'+p.id,{method:'DELETE'}).then(function(r){
        if(r&&r.status==='success'){self.flash('❌ 已下架: '+p.name); self.products=self.products.filter(function(x){return x.id!==p.id;});}
        else{self.flash('操作失败');}
      }).catch(function(){self.flash('网络错误');});
    },
    approveCustom: function(c){this.flash('✅ 已通过: '+c.title); this.customs=this.customs.filter(function(x){return x.id!==c.id;});},
    removeCustom: function(c){
      if(!confirm('确定删除需求「'+c.title+'」吗？')) return;
      var self=this;
      API._fetch('/api/custom-orders/'+c.id,{method:'DELETE'}).then(function(r){
        if(r&&r.status==='success'){self.flash('❌ 已删除: '+c.title); self.customs=self.customs.filter(function(x){return x.id!==c.id;});}
        else{self.flash('操作失败');}
      }).catch(function(){self.flash('网络错误');});
    }
  }
};
