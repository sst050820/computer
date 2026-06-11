var VueProductList = {
  name: 'VueProductList',
  template: '<div>' +
    '<div class="card">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:16px;border-bottom:1px solid var(--co-neutral-100);margin-bottom:16px;">' +
    '<h3 style="margin:0;font-size:1.05rem;"><i class="fas fa-boxes" style="color:var(--co-primary-500);margin-right:8px;"></i>我的商品（{{ products.length }}）</h3>' +
    '<button class="btn" style="background:linear-gradient(135deg,#2D6A4F,#235740);color:#fff;font-weight:600;border:none;cursor:pointer;padding:10px 20px;" @click="showForm=true"><i class="fas fa-plus"></i> 发布新商品</button>' +
    '</div>' +
    '<div v-if="loading" style="text-align:center;padding:60px;"><i class="fas fa-spinner fa-spin" style="font-size:2rem;color:var(--co-primary-400);display:block;margin-bottom:12px;"></i>加载中...</div>' +
    '<div v-else-if="products.length===0" style="text-align:center;padding:60px;color:var(--co-neutral-500);"><i class="fas fa-box-open" style="font-size:3rem;opacity:0.1;display:block;margin-bottom:12px;"></i>暂无商品<br><button class="btn" style="margin-top:12px;background:#2D6A4F;color:#fff;border:none;cursor:pointer;" @click="showForm=true">发布第一个商品</button></div>' +
    '<div v-else><div class="product-grid"><div v-for="p in products" :key="p.id" class="product-card">' +
    '<div class="prod-img">{{ getEmoji(p) }}<span v-if="p.certification" class="prod-tag">{{ p.certification }}</span></div>' +
    '<div class="prod-body"><div class="prod-name">{{ p.name }}</div><div class="prod-shop">{{ p.origin||"" }} · ¥{{ (p.price||0).toFixed(1) }}</div>' +
    '<button class="btn btn-sm" style="background:#fff;color:var(--co-error);border:2px solid var(--co-error);font-weight:600;width:100%;margin-top:8px;cursor:pointer;" @click="delProduct(p)"><i class="fas fa-arrow-down"></i> 下架</button>' +
    '</div></div></div></div></div>' +

    /* Publish Modal */
    '<div v-if="showForm" class="modal-overlay" @click.self="showForm=false">' +
    '<div class="modal-content" style="max-width:520px;">' +
    '<div class="modal-header"><h3 class="modal-title"><i class="fas fa-cloud-upload-alt"></i> 发布新商品</h3><button class="modal-close" @click="showForm=false"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    '<div class="form-group"><label class="form-label">商品名称 *</label><input class="form-input" v-model="f.name" placeholder="例如：有机铁观音" /></div>' +
    '<div class="form-group"><label class="form-label">品类</label><select class="form-select" v-model="f.category"><option>茶叶</option><option>果蔬</option><option>谷物</option><option>畜牧</option><option>菌菇</option><option>蜂蜜</option><option>零食</option><option>粮油</option></select></div>' +
    '<div class="form-group"><label class="form-label">产地</label><input class="form-input" v-model="f.origin" placeholder="例如：福建安溪" /></div>' +
    '<div class="form-group"><label class="form-label">价格（元）</label><input class="form-input" type="number" v-model.number="f.price" placeholder="288" /></div>' +
    '<div class="form-group"><label class="form-label">认证类型</label><select class="form-select" v-model="f.certification"><option>有机</option><option>绿色</option><option>地理标志</option><option>无公害</option></select></div>' +
    '<div style="display:flex;gap:8px;margin-top:12px;">' +
    '<button class="btn" style="flex:1;justify-content:center;background:linear-gradient(135deg,#2D6A4F,#235740);color:#fff;font-weight:600;border:none;cursor:pointer;" @click="doCreate" :disabled="saving"><i v-if="saving" class="fas fa-spinner fa-spin"></i><i v-else class="fas fa-upload"></i> {{ saving?"发布中...":"确认发布" }}</button>' +
    '<button class="btn" style="flex:1;justify-content:center;background:#fff;color:var(--co-neutral-600);border:2px solid var(--co-neutral-300);font-weight:600;cursor:pointer;" @click="showForm=false">取消</button></div>' +
    '<div v-if="ok" style="margin-top:12px;color:var(--co-success);text-align:center;font-weight:600;">✅ 商品发布成功！</div>' +
    '<div v-if="err" style="margin-top:8px;color:var(--co-error);text-align:center;">{{ err }}</div>' +
    '</div></div></div>' +
    '</div>',
  data: function() {
    return {
      loading:true, products:[], showForm:false, saving:false, ok:false, err:'',
      f: { name:'', category:'茶叶', origin:'', price:'', certification:'有机' },
      emojiMap:{茶叶:'🍵',果蔬:'🍎',谷物:'🌾',畜牧:'🥩',菌菇:'🍄',蜂蜜:'🍯',零食:'🍪',粮油:'🫒'}
    };
  },
  mounted: function() { this.fetchProducts(); },
  methods: {
    fetchProducts: function() {
      var self=this; var user=window.App.currentUser;
      if(!user){self.loading=false;return;}
      API.getMyProducts(user.id).then(function(r){self.products=r.data||[];self.loading=false;}).catch(function(){self.loading=false;});
    },
    getEmoji: function(p) { return (p&&this.emojiMap[p.category])||'📦'; },
    doCreate: function() {
      var self=this; this.err=''; this.ok=false;
      if(!this.f.name.trim()){this.err='请填写商品名称';return;}
      var user=window.App.currentUser; this.saving=true;
      API.createProduct({
        name:this.f.name.trim(), category:this.f.category, origin:this.f.origin.trim(),
        price:parseFloat(this.f.price)||0, certification:this.f.certification,
        traceable:true, shop_id:user.id, shop_name:user.name, image:'📦'
      }).then(function(r){
        self.saving=false;
        if(r&&r.status==='success'){self.ok=true;self.f={name:'',category:'茶叶',origin:'',price:'',certification:'有机'};self.fetchProducts();setTimeout(function(){self.showForm=false;self.ok=false;},1200);}
        else{self.err='发布失败';}
      }).catch(function(){self.saving=false;self.err='网络错误';});
    },
    delProduct: function(p) {
      if(!confirm('确定下架「'+p.name+'」？'))return;
      var self=this;
      API._fetch('/api/products/'+p.id,{method:'DELETE'}).then(function(r){if(r&&r.status==='success'){window.showToast&&window.showToast('已下架','info');self.fetchProducts();}});
    }
  }
};
