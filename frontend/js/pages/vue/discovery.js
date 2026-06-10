/* VueDiscovery — Consumer: Discovery / Product Browse */
const VueDiscovery = {
  name: 'VueDiscovery',
  template: '<div class="page-discovery">' +
    /* Banner */
    '<div class="card" style="background:linear-gradient(135deg, var(--co-primary-500), var(--co-primary-700));color:#fff;padding:var(--sp-6);margin-bottom:var(--sp-4);position:relative;overflow:hidden;border-radius:var(--rd-lg);">' +
    '<h2 style="font-size:1.3rem;font-weight:700;">{{ banners[bannerIdx].title }}</h2>' +
    '<p style="font-size:0.85rem;opacity:0.9;margin-top:4px;">{{ banners[bannerIdx].sub }}</p>' +
    '<i :class="\'fas \'+banners[bannerIdx].icon" style="position:absolute;right:20px;top:50%;transform:translateY(-50%);font-size:3.5rem;opacity:0.15;"></i>' +
    '</div>' +
    /* Category Nav */
    '<div class="flex-row" style="gap:4px;padding:0 0 12px;overflow-x:auto;display:flex;">' +
    '<button v-for="c in categories" :key="c.key" class="btn btn-ghost btn-sm" :class="{ \'btn-secondary\': activeCat === c.key }" @click="selectCat(c.key)" style="flex-shrink:0;">' +
    '<i :class="\'fas \' + c.icon" style="margin-right:4px;"></i>{{ c.label }}</button>' +
    '</div>' +
    /* Search Bar */
    '<div class="card" style="padding:var(--sp-4);margin-bottom:var(--sp-4);">' +
    '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
    '<input class="form-input" v-model="searchKeyword" placeholder="搜索农产品名称..." style="flex:2;min-width:150px;" @keyup.enter="doSearch" />' +
    '<select class="form-select" v-model="searchCategory" style="flex:1;min-width:100px;"><option value="">全部分类</option><option v-for="o in catOptions" :key="o" :value="o">{{ o }}</option></select>' +
    '<select class="form-select" v-model="searchOrigin" style="flex:1;min-width:100px;"><option value="">全部产地</option><option v-for="o in originOptions" :key="o" :value="o">{{ o }}</option></select>' +
    '<base-button @click="doSearch"><i class="fas fa-search"></i> 搜索</base-button>' +
    '</div></div>' +
    /* Results */
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">' +
    '<h3 style="font-size:1.05rem;font-weight:600;">🔥 热销推荐</h3>' +
    '<span style="font-size:0.8rem;color:var(--co-neutral-500);">{{ products.length }} 件商品</span>' +
    '</div>' +
    '<base-loading v-if="loading" />' +
    '<base-empty v-else-if="products.length === 0" icon="fa-search" title="未找到匹配商品" description="试试其他关键词或分类" />' +
    '<div v-else class="product-grid">' +
    '<div v-for="p in products" :key="p.id" class="product-card">' +
    /* Clickable area: image + info = open detail */
    '<div @click="viewDetail(p)" class="prod-clickable">' +
    '<div class="prod-img">{{ getEmoji(p) }}<span v-if="p.certification" class="prod-tag">{{ p.certification }}</span></div>' +
    '<div class="prod-body">' +
    '<div class="prod-name">{{ p.name }}</div>' +
    '<div class="prod-shop"><i class="fas fa-store"></i> {{ p.shop_name || "官方直营" }}</div>' +
    '<div class="prod-footer">' +
    '<div class="prod-price"><span class="prod-price-unit">¥</span>{{ (p.price||0).toFixed(1) }}</div>' +
    '<div class="prod-sales">已售 {{ p.sales || 0 }}</div>' +
    '</div></div></div>' +
    /* Cart button: visually separated, only this triggers addToCart */
    '<div class="prod-cart-bar">' +
    '<button class="prod-cart-btn" @click.stop="addToCart(p)"><i class="fas fa-cart-plus"></i> 加入购物车</button>' +
    '</div></div></div>' +
    /* Product Detail Modal */
    '<div v-if="detailProduct" class="modal-overlay" @click.self="detailProduct=null">' +
    '<div class="modal-content" style="max-width:520px;">' +
    '<div class="modal-header"><h3 class="modal-title">商品详情</h3><button class="modal-close" @click="detailProduct=null"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body" style="text-align:center;">' +
    '<div style="font-size:5rem;padding:20px;">{{ getEmoji(detailProduct) }}</div>' +
    '<h3 style="font-size:1.2rem;margin-bottom:4px;">{{ detailProduct.name }}</h3>' +
    '<p style="color:var(--co-neutral-500);font-size:0.85rem;">{{ detailProduct.shop_name || "官方直营" }} · {{ detailProduct.origin || "" }}</p>' +
    '<p style="color:var(--co-neutral-500);font-size:0.8rem;margin-top:4px;">品类: {{ detailProduct.category }} | 认证: {{ detailProduct.certification || "无" }}</p>' +
    '<div style="font-size:1.6rem;font-weight:700;color:var(--co-accent-berry);margin:16px 0;">¥{{ (detailProduct.price||0).toFixed(1) }}</div>' +
    '<div style="display:flex;gap:10px;justify-content:center;">' +
    '<base-button size="lg" @click="addToCart(detailProduct); detailProduct=null"><i class="fas fa-cart-plus"></i> 加入购物车</base-button>' +
    '<base-button variant="outline" @click="detailProduct=null">关闭</base-button>' +
    '</div></div></div></div>' +
    '</div>',
  data: function() {
    return {
      detailProduct: null,
      banners: [
        { title: '产地直供 新鲜到家', sub: '有机认证农产品 限时特惠', icon: 'fa-truck' },
        { title: '私人定制 专属美味', sub: '发布需求 源头厂家接单', icon: 'fa-magic' },
        { title: '全程溯源 安心消费', sub: '区块链追溯 每一口都放心', icon: 'fa-leaf' },
      ],
      bannerIdx: 0,
      categories: [
        { key: 'all', icon: 'fa-globe', label: '全部' },
        { key: 'tea', icon: 'fa-mug-hot', label: '茶叶' },
        { key: 'fruit', icon: 'fa-apple-alt', label: '果蔬' },
        { key: 'grain', icon: 'fa-wheat-alt', label: '谷物' },
        { key: 'meat', icon: 'fa-drumstick-bite', label: '畜牧' },
        { key: 'snack', icon: 'fa-cookie', label: '零食' },
        { key: 'oil', icon: 'fa-oil-can', label: '粮油' },
        { key: 'mushroom', icon: 'fa-seedling', label: '菌菇' },
        { key: 'honey', icon: 'fa-jar', label: '蜂蜜' },
      ],
      activeCat: '', catMap: { tea:'茶叶',fruit:'果蔬',grain:'谷物',meat:'畜牧',snack:'零食',oil:'粮油',mushroom:'菌菇',honey:'蜂蜜' },
      catOptions: ['茶叶','果蔬','谷物','畜牧','零食','粮油','菌菇','蜂蜜'],
      originOptions: ['福建','山东','浙江','云南','安徽','四川','广东','黑龙江','吉林','内蒙古'],
      searchKeyword: '', searchCategory: '', searchOrigin: '',
      products: [], loading: true,
      defaultProducts: [
        { id:'s1',name:'武夷山大红袍',category:'茶叶',origin:'福建',price:388,shop_name:'福建名品茶厂',shop_id:'m01',certification:'有机',image:'🍵',sales:1256 },
        { id:'s2',name:'安溪铁观音',category:'茶叶',origin:'福建',price:268,shop_name:'福建名品茶厂',shop_id:'m01',certification:'地理标志',image:'🫖',sales:2340 },
        { id:'s3',name:'云南野生菌菇礼盒',category:'菌菇',origin:'云南',price:168,shop_name:'山东丰收食品厂',shop_id:'m02',certification:'绿色',image:'🍄',sales:892 },
        { id:'s4',name:'烟台红富士苹果',category:'果蔬',origin:'山东',price:59.9,shop_name:'山东丰收食品厂',shop_id:'m02',certification:'无公害',image:'🍎',sales:4521 },
        { id:'s5',name:'西湖龙井绿茶',category:'茶叶',origin:'浙江',price:298,shop_name:'浙江龙井茶园',shop_id:'m03',certification:'有机',image:'🌿',sales:1876 },
        { id:'s6',name:'有机五常大米',category:'谷物',origin:'黑龙江',price:89.9,shop_name:'福建名品茶厂',shop_id:'m01',certification:'有机',image:'🌾',sales:6720 },
        { id:'s7',name:'长白山椴树蜜',category:'蜂蜜',origin:'吉林',price:128,shop_name:'山东丰收食品厂',shop_id:'m02',certification:'绿色',image:'🍯',sales:2341 },
        { id:'s8',name:'内蒙古风干牛肉',category:'畜牧',origin:'内蒙古',price:99,shop_name:'草原牧业',shop_id:'m04',certification:'无公害',image:'🥩',sales:3890 },
        { id:'s9',name:'黄山毛峰',category:'茶叶',origin:'安徽',price:328,shop_name:'福建名品茶厂',shop_id:'m01',certification:'地理标志',image:'🍵',sales:1560 },
        { id:'s10',name:'普洱茶饼',category:'茶叶',origin:'云南',price:598,shop_name:'浙江龙井茶园',shop_id:'m03',certification:'有机',image:'🫖',sales:980 },
        { id:'s11',name:'福鼎白茶',category:'茶叶',origin:'福建',price:258,shop_name:'福建名品茶厂',shop_id:'m01',certification:'绿色',image:'🍵',sales:2100 },
        { id:'s12',name:'新疆哈密瓜',category:'果蔬',origin:'新疆',price:39.9,shop_name:'山东丰收食品厂',shop_id:'m02',certification:'无公害',image:'🍈',sales:5600 },
        { id:'s13',name:'赣南脐橙',category:'果蔬',origin:'江西',price:49.9,shop_name:'山东丰收食品厂',shop_id:'m02',certification:'绿色',image:'🍊',sales:7800 },
        { id:'s14',name:'海南金煌芒果',category:'果蔬',origin:'海南',price:68,shop_name:'浙江龙井茶园',shop_id:'m03',certification:'无公害',image:'🥭',sales:3200 },
        { id:'s15',name:'吐鲁番无核白葡萄',category:'果蔬',origin:'新疆',price:45,shop_name:'山东丰收食品厂',shop_id:'m02',certification:'绿色',image:'🍇',sales:4100 },
        { id:'s16',name:'东北黑米',category:'谷物',origin:'黑龙江',price:35,shop_name:'福建名品茶厂',shop_id:'m01',certification:'有机',image:'🌾',sales:8900 },
        { id:'s17',name:'宁夏枸杞',category:'谷物',origin:'宁夏',price:78,shop_name:'浙江龙井茶园',shop_id:'m03',certification:'地理标志',image:'🔴',sales:6700 },
        { id:'s18',name:'山西沁州黄小米',category:'谷物',origin:'山西',price:42,shop_name:'山东丰收食品厂',shop_id:'m02',certification:'绿色',image:'🌾',sales:5400 },
        { id:'s19',name:'西藏牦牛肉干',category:'畜牧',origin:'西藏',price:158,shop_name:'草原牧业',shop_id:'m04',certification:'有机',image:'🥩',sales:1250 },
        { id:'s20',name:'金华火腿',category:'畜牧',origin:'浙江',price:288,shop_name:'浙江龙井茶园',shop_id:'m03',certification:'地理标志',image:'🍖',sales:890 },
        { id:'s21',name:'宁夏盐池滩羊肉',category:'畜牧',origin:'宁夏',price:198,shop_name:'草原牧业',shop_id:'m04',certification:'有机',image:'🐑',sales:650 },
        { id:'s22',name:'云南鲜花饼',category:'零食',origin:'云南',price:68,shop_name:'浙江龙井茶园',shop_id:'m03',certification:'绿色',image:'🌸',sales:9800 },
        { id:'s23',name:'天津十八街麻花',category:'零食',origin:'天津',price:35,shop_name:'山东丰收食品厂',shop_id:'m02',certification:'无公害',image:'🥨',sales:7600 },
        { id:'s24',name:'鲁花压榨花生油',category:'粮油',origin:'山东',price:128,shop_name:'山东丰收食品厂',shop_id:'m02',certification:'绿色',image:'🫒',sales:4300 },
        { id:'s25',name:'四川汉源花椒油',category:'粮油',origin:'四川',price:58,shop_name:'浙江龙井茶园',shop_id:'m03',certification:'地理标志',image:'🌶️',sales:3200 },
        { id:'s26',name:'东北黑木耳',category:'菌菇',origin:'黑龙江',price:88,shop_name:'福建名品茶厂',shop_id:'m01',certification:'有机',image:'🍄',sales:2800 },
        { id:'s27',name:'古田银耳',category:'菌菇',origin:'福建',price:68,shop_name:'福建名品茶厂',shop_id:'m01',certification:'绿色',image:'🍄',sales:3500 },
        { id:'s28',name:'秦岭土蜂蜜',category:'蜂蜜',origin:'陕西',price:168,shop_name:'山东丰收食品厂',shop_id:'m02',certification:'有机',image:'🍯',sales:1800 },
      ],
      emojiMap: { '茶叶':'🍵','果蔬':'🍎','谷物':'🌾','畜牧':'🥩','菌菇':'🍄','蜂蜜':'🍯','零食':'🍪','粮油':'🫒' },
      bannerTimer: null
    };
  },
  mounted: function() {
    var self = this;
    this.doSearch();
    this.bannerTimer = setInterval(function() { self.bannerIdx = (self.bannerIdx + 1) % self.banners.length; }, 5000);
  },
  beforeUnmount: function() { if (this.bannerTimer) clearInterval(this.bannerTimer); },
  methods: {
    selectCat: function(key) { this.activeCat = key; this.searchCategory = key === 'all' ? '' : (this.catMap[key] || ''); this.doSearch(); },
    doSearch: function() {
      var self = this; this.loading = true;
      API.getProducts({ keyword: this.searchKeyword, category: this.searchCategory, origin: this.searchOrigin }).then(function(res) {
        var data = res.data || [];
        if (data.length === 0) {
          self.products = self.defaultProducts.filter(function(p) {
            var kw = self.searchKeyword.toLowerCase();
            return (!kw || p.name.toLowerCase().indexOf(kw) >= 0) && (!self.searchCategory || p.category === self.searchCategory) && (!self.searchOrigin || p.origin === self.searchOrigin);
          });
        } else { self.products = data; }
        self.loading = false;
      }).catch(function() { self.products = self.defaultProducts; self.loading = false; });
    },
    getEmoji: function(p) { if (p.image && p.image.length <= 4) return p.image; return this.emojiMap[p.category] || '📦'; },
    addToCart: function(p) {
      var img = this.getEmoji(p);
      window.App.addToCart({ id: p.id, name: p.name, price: p.price, image: img, shop_id: p.shop_id, shop_name: p.shop_name });
    },
    viewDetail: function(p) { this.detailProduct = p; }
  }
};
