/* VueProductList — Merchant: Product Management */
const VueProductList = {
  name: 'VueProductList',
  template: '<div>' +
    '<div class="card"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">' +
    '<span style="display:flex;align-items:center;gap:8px;"><i class="fas fa-boxes card-icon" style="background:var(--co-primary-50);color:var(--co-primary-500);"></i><span class="card-title">我的商品</span></span>' +
    '<button class="btn" style="background:linear-gradient(135deg,#2D6A4F,#235740);color:#fff;padding:8px 18px;font-weight:600;box-shadow:0 4px 12px rgba(45,106,79,0.3);" @click="showForm=true"><i class="fas fa-plus"></i> 发布新商品</button></div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="products.length === 0 && !showForm" icon="fa-box-open" title="暂无商品" description="点击上方按钮发布第一个商品" />' +
    '<div v-else>' +
    '<div class="product-grid" v-if="products.length > 0">' +
    '<div v-for="p in products" :key="p.id" class="product-card">' +
    '<div class="prod-img">{{ getEmoji(p) }}<span v-if="p.certification" class="prod-tag">{{ p.certification }}</span></div>' +
    '<div class="prod-body"><div class="prod-name">{{ p.name }}</div>' +
    '<div class="prod-shop">{{ p.origin || "" }} · ¥{{ (p.price||0).toFixed(1) }}</div></div></div></div>' +
    '<div v-if="showForm" class="card" style="margin-top:16px;border:2px solid var(--co-primary-200);">' +
    '<h4 style="margin-bottom:12px;"><i class="fas fa-cloud-upload-alt"></i> 发布新商品</h4>' +
    '<div style="display:grid;gap:12px;max-width:500px;">' +
    '<div class="form-group"><label class="form-label">商品名称</label><input class="form-input" v-model="form.name" placeholder="例如：有机铁观音" /></div>' +
    '<div class="form-group"><label class="form-label">品类</label><select class="form-select" v-model="form.category"><option>茶叶</option><option>果蔬</option><option>谷物</option><option>畜牧</option></select></div>' +
    '<div class="form-group"><label class="form-label">产地</label><input class="form-input" v-model="form.origin" placeholder="例如：福建安溪" /></div>' +
    '<div class="form-group"><label class="form-label">价格（元）</label><input class="form-input" type="number" v-model="form.price" placeholder="288" /></div>' +
    '<div class="form-group"><label class="form-label">认证类型</label><select class="form-select" v-model="form.certification"><option>有机</option><option>绿色</option><option>地理标志</option><option>无公害</option></select></div>' +
    '<div style="display:flex;gap:8px;">' +
    '<button class="btn" style="background:linear-gradient(135deg,#2D6A4F,#235740);color:#fff;box-shadow:0 4px 12px rgba(45,106,79,0.3);" @click="createProduct" :disabled="saving"><i v-if="saving" class="fas fa-spinner fa-spin"></i><i v-else class="fas fa-upload"></i> {{ saving?"发布中...":"确认发布" }}</button>' +
    '<button class="btn" style="background:#fff;color:var(--co-neutral-600);border:2px solid var(--co-neutral-300);font-weight:600;" @click="showForm=false">取消</button></div></div>' +
    '<div v-if="saveOk" style="color:var(--co-success);margin-top:8px;">✅ 商品发布成功！</div></div>' +
    '</div></div>' +
    '</div>',
  data: function() {
    return {
      loading: true, products: [], saving: false, saveOk: false,
      showForm: false,
      form: { name: '', category: '茶叶', origin: '', price: '', certification: '有机' },
      emojiMap: { '茶叶':'🍵','果蔬':'🍎','谷物':'🌾','畜牧':'🥩','菌菇':'🍄','蜂蜜':'🍯' },
    };
  },
  mounted: function() { this.fetchProducts(); },
  methods: {
    fetchProducts: function() {
      var self = this;
      var user = window.App.currentUser;
      if (!user) { self.loading = false; return; }
      API.getMyProducts(user.id).then(function(res) {
        self.products = res.data || [];
        self.loading = false;
      }).catch(function() { self.loading = false; });
    },
    getEmoji: function(p) { return this.emojiMap[p.category] || '📦'; },
    createProduct: function() {
      var self = this;
      if (!this.form.name.trim()) { window.showToast('请填写商品名称', 'error'); return; }
      var user = window.App.currentUser;
      this.saving = true;
      API.createProduct({
        name: this.form.name.trim(), category: this.form.category,
        origin: this.form.origin.trim(), price: parseFloat(this.form.price) || 0,
        certification: this.form.certification, traceable: true,
        shop_id: user.id, shop_name: user.name, image: '📦'
      }).then(function(res) {
        self.saving = false; self.saveOk = true; self.showForm = false;
        window.showToast('发布成功', 'success');
        self.fetchProducts();
      }).catch(function() { self.saving = false; });
    }
  }
};
