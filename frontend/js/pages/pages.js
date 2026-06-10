// ============================================================
// 农淘 — Taobao-style Page Renderers
// ============================================================
var PageRenderers = {

  // ==================== CONSUMER: DISCOVERY (Taobao Homepage) ====================

  discovery: function(container, user) {
    var banners = [
      { title: "产地直供 新鲜到家", sub: "有机认证农产品 限时特惠", icon: "fa-truck", color: "#FF6A00" },
      { title: "私人定制 专属美味", sub: "发布需求 源头厂家接单", icon: "fa-magic", color: "#FF4400" },
      { title: "全程溯源 安心消费", sub: "区块链追溯 每一口都放心", icon: "fa-leaf", color: "#00B578" },
    ];
    var bannerIdx = 0;
    var categories = [
      { key: "tea", icon: "fa-mug-hot", label: "茶叶" },
      { key: "fruit", icon: "fa-apple-alt", label: "果蔬" },
      { key: "grain", icon: "fa-wheat-alt", label: "谷物" },
      { key: "meat", icon: "fa-drumstick-bite", label: "畜牧" },
      { key: "snack", icon: "fa-cookie", label: "零食" },
      { key: "oil", icon: "fa-oil-can", label: "粮油" },
      { key: "mushroom", icon: "fa-seedling", label: "菌菇" },
      { key: "honey", icon: "fa-jar", label: "蜂蜜" },
    ];
    container.innerHTML =
      '<div class="tb-section">' +
      '<div class="tb-banner" id="homeBanner" style="cursor:pointer;">' +
      '<h2 id="bannerTitle">' + banners[0].title + '</h2>' +
      '<p id="bannerSub">' + banners[0].sub + '</p>' +
      '<i class="fas ' + banners[0].icon + ' tb-banner-icon"></i></div>' +
      '<div class="tb-category-nav" id="catNav">' +
      categories.map(function(c) {
        return '<button class="tb-cat-item" data-cat="' + c.key + '">' +
          '<i class="fas ' + c.icon + '"></i><span>' + c.label + '</span></button>';
      }).join("") +
      '</div>' +
      '<div class="glass-card" style="padding:16px;margin-bottom:16px;">' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
      '<input id="searchKeyword" placeholder="搜索农产品名称..." style="flex:2;min-width:160px;" />' +
      '<select id="searchCategory" style="flex:1;min-width:100px;"><option value="">全部分类</option><option>茶叶</option><option>果蔬</option><option>谷物</option><option>畜牧</option></select>' +
      '<select id="searchOrigin" style="flex:1;min-width:100px;"><option value="">全部产地</option><option>福建</option><option>山东</option><option>浙江</option><option>云南</option></select>' +
      '<button class="btn" id="searchBtn"><i class="fas fa-search"></i> 搜索</button></div></div>' +
      '<div class="tb-section-header"><h3>🔥 热销推荐</h3><a class="tb-more" href="#" onclick="App.navigate('discovery');return false;">查看更多 ›</a></div>' +
      '<div id="productResults" class="tb-product-grid"></div></div>';
    var bannerEl = document.getElementById("homeBanner");
    setInterval(function() {
      if (!document.getElementById("homeBanner")) return;
      bannerIdx = (bannerIdx + 1) % banners.length;
      var b = banners[bannerIdx];
      document.getElementById("bannerTitle").textContent = b.title;
      document.getElementById("bannerSub").textContent = b.sub;
      var iconEl = bannerEl.querySelector(".tb-banner-icon");
      if (iconEl) iconEl.className = "fas " + b.icon + " tb-banner-icon";
    }, 5000);
    document.getElementById("catNav").onclick = function(e) {
      var item = e.target.closest(".tb-cat-item");
      if (!item) return;
      document.querySelectorAll(".tb-cat-item").forEach(function(el) { el.classList.remove("active"); });
      item.classList.add("active");
      var catMap = { tea: "茶叶", fruit: "果蔬", grain: "谷物", meat: "畜牧", snack: "零食", oil: "粮油", mushroom: "菌菇", honey: "蜂蜜" };
      var cat = catMap[item.dataset.cat] || "";
      var catSelect = document.getElementById("searchCategory");
      if (catSelect) { catSelect.value = cat; }
      loadProducts();
    };
    function loadProducts() {
      var kw = document.getElementById("searchKeyword").value;
      var cat = document.getElementById("searchCategory").value;
      var ori = document.getElementById("searchOrigin").value;
      API.getProducts({ keyword: kw, category: cat, origin: ori }).then(function(res) {
        var data = res.data || [];
        if (data.length === 0) {
          data = [
            { id: "s1", name: "武夷山大红袍", category: "茶叶", origin: "福建", price: 388, shop_name: "武夷茶庄", certification: "有机", traceable: true, image: "🍵", sales: 1256, rating: 4.8 },
            { id: "s2", name: "安溪铁观音", category: "茶叶", origin: "福建", price: 268, shop_name: "安溪茶厂", certification: "地理标志", traceable: true, image: "🫖", sales: 2340, rating: 4.7 },
            { id: "s3", name: "云南野生菌菇礼盒", category: "菌菇", origin: "云南", price: 168, shop_name: "云菌坊", certification: "绿色", traceable: true, image: "🍄", sales: 892, rating: 4.9 },
            { id: "s4", name: "烟台红富士苹果", category: "果蔬", origin: "山东", price: 59.9, shop_name: "山东果园", certification: "无公害", traceable: true, image: "🍎", sales: 4521, rating: 4.6 },
            { id: "s5", name: "龙井绿茶", category: "茶叶", origin: "浙江", price: 298, shop_name: "西湖龙井园", certification: "有机", traceable: true, image: "🌿", sales: 1876, rating: 4.8 },
            { id: "s6", name: "有机五常大米", category: "谷物", origin: "黑龙江", price: 89.9, shop_name: "五常稻花香", certification: "有机", traceable: true, image: "🌾", sales: 6720, rating: 4.7 },
            { id: "s7", name: "长白山椴树蜜", category: "蜂蜜", origin: "吉林", price: 128, shop_name: "长白山蜂场", certification: "绿色", traceable: true, image: "🍯", sales: 2341, rating: 4.5 },
            { id: "s8", name: "内蒙古风干牛肉", category: "畜牧", origin: "内蒙古", price: 99, shop_name: "草原牧业", certification: "无公害", traceable: true, image: "🥩", sales: 3890, rating: 4.6 },
          ];
        }
        var cards = data.map(function(p) { return ProductCard.render(p); }).join("");
        document.getElementById("productResults").innerHTML = cards ||
          '<p style="text-align:center;padding:40px;color:var(--tb-text-secondary);">未找到匹配商品</p>';
      });
    }
    document.getElementById("searchBtn").addEventListener("click", loadProducts);
    document.getElementById("searchKeyword").addEventListener("keydown", function(e) {
      if (e.key === "Enter") loadProducts();
    });
    loadProducts();
  },
  // ==================== CONSUMER: CUSTOM ORDER ====================

  "custom-order": function(container, user) {
    var condId = "cs_" + Date.now();
    container.innerHTML =
      '<div class="glass-card" style="max-width:800px;margin:0 auto;">' +
      '<div class="section-title"><i class="fas fa-magic"></i> 发布私人定制需求</div>' +
      '<div style="display:grid;gap:16px;">' +
      '<label>需求标题</label><input id="coTitle" placeholder="例如：牛奶味茶饼定制" />' +
      '<label>详细描述</label><textarea id="coDesc" rows="3" placeholder="描述想要的农产品规格、口味、数量等"></textarea>' +
      '<label>期望预算</label><input id="coBudget" placeholder="例如：5000-10000元" />' +
      '<label>设定可见条件（只有满足条件的厂家才能看到您的需求）</label>' +
      '<div id="' + condId + '"></div>' +
      '<div id="policyPreview" style="padding:12px;background:var(--tb-bg);border-radius:var(--tb-radius-sm);font-size:0.85rem;color:var(--tb-text-secondary);"></div>' +
      '<button class="btn" id="submitCustomOrder" style="width:100%;padding:14px;justify-content:center;">' +
      '<i class="fas fa-paper-plane"></i> 定向发布</button></div>' +
      '<div id="coResult" style="margin-top:16px;"></div></div>';
    ConditionSelector.render(document.getElementById(condId), function(conditions, policy) {
      var preview = document.getElementById("policyPreview");
      preview.innerHTML = '<i class="fas fa-shield-alt"></i> <strong>可见条件：</strong>' +
        (policy || "未设定条件（所有人可见）");
    });
    document.getElementById("submitCustomOrder").addEventListener("click", function() {
      var title = document.getElementById("coTitle").value.trim();
      var desc = document.getElementById("coDesc").value.trim();
      var budget = document.getElementById("coBudget").value.trim();
      if (!title) { showToast("请填写需求标题", "error"); return; }
      var params = {
        title: title, description: desc || title, budget: budget,
        conditions: ConditionSelector.getConditions(condId), consumer_id: user.id
      };
      API.createCustomOrder(params).then(function(res) {
        var resultEl = document.getElementById("coResult");
        if (res.status === "success") {
          resultEl.innerHTML =
            '<div class="glass-card" style="border:2px solid var(--tb-green);text-align:center;padding:24px;">' +
            '<i class="fas fa-check-circle" style="font-size:2.5rem;color:var(--tb-green);"></i>' +
            '<h3>定向发布成功！</h3><p>需求编号：' + res.data.id + '</p>' +
            '<p style="color:var(--tb-text-secondary);font-size:0.85rem;">满足条件的厂家将能看到完整需求内容</p></div>';
        } else {
          resultEl.innerHTML = '<p style="color:red;">发布失败: ' + (res.error || "未知错误") + '</p>';
        }
      });
    });
  },

  // ==================== CONSUMER: ORDER SQUARE ====================

  "order-square": function(container) {
    var samples = [
      { title: "🍵 牛奶味茶饼定制", budget: "5000-10000元", publisher: "张果农", date: "2026-06-07", conds: "产地：福建 | 制茶能力" },
      { title: "🌸 有机茉莉花茶", budget: "8000-15000元", publisher: "李茶商", date: "2026-06-06", conds: "产地：福建 | 有机认证" },
      { title: "🍙 低糖梅干加工", budget: "3000-6000元", publisher: "王果商", date: "2026-06-05", conds: "果蔬加工 | 绿色认证" },
    ];
    var cards = samples.map(function(s) {
      return '<div class="tb-card" style="padding:16px;cursor:pointer;">' +
        '<h4>' + s.title + '</h4>' +
        '<p style="font-size:0.85rem;color:var(--tb-text-price);font-weight:600;margin-top:6px;">预算：' + s.budget + '</p>' +
        '<p style="font-size:0.75rem;color:var(--tb-text-secondary);margin-top:4px;"><i class="fas fa-tag"></i> ' + s.conds + '</p>' +
        '<div style="display:flex;justify-content:space-between;margin-top:6px;">' +
        '<span style="font-size:0.7rem;color:var(--tb-text-secondary);">' + s.publisher + '</span>' +
        '<span style="font-size:0.7rem;color:var(--tb-text-secondary);">' + s.date + '</span></div></div>';
    }).join("");
    container.innerHTML =
      '<div class="glass-card">' +
      '<div class="section-title"><i class="fas fa-th-list"></i> 定制广场</div>' +
      '<p style="color:var(--tb-text-secondary);margin-bottom:16px;font-size:0.85rem;">浏览他人公开发布的定制需求摘要</p>' +
      '<div class="grid-2">' + cards + '</div></div>';
  },
  // ==================== CONSUMER: MY ORDERS ====================

  "my-orders": function(container, user) {
    API.getMyCustomOrders(user.id).then(function(res) {
      var orders = res.data || [];
      if (orders.length === 0) {
        container.innerHTML =
          '<div class="glass-card">' +
          '<div class="section-title"><i class="fas fa-clipboard-list"></i> 我的定制需求</div>' +
          '<div style="text-align:center;padding:60px;">' +
          '<i class="fas fa-inbox" style="font-size:3rem;opacity:0.15;"></i>' +
          '<p style="color:var(--tb-text-secondary);margin-top:12px;">暂无定制需求</p>' +
          '<button class="btn" style="margin-top:16px;" onclick="App.navigate('custom-order')">' +
          '<i class="fas fa-plus"></i> 发布第一个定制</button></div></div>';
        return;
      }
      var list = orders.map(function(o) {
        var statusColor = o.status === "active" ? "var(--tb-green)" : "var(--tb-text-secondary)";
        var responsesHtml = "";
        if ((o.responses || []).length > 0) {
          responsesHtml = '<div style="margin-top:8px;"><strong style="font-size:0.8rem;">收到的响应（' + o.responses.length + '）：</strong>' +
            o.responses.map(function(r) {
              return '<div style="margin-top:6px;padding:8px 10px;background:var(--tb-bg);border-radius:var(--tb-radius-sm);border-left:3px solid var(--tb-orange);">' +
                '<div style="display:flex;justify-content:space-between;"><strong>' + r.name + '</strong>' +
                '<span style="color:var(--tb-text-price);font-weight:600;">报价：' + r.price + '</span></div>' +
                '<small style="color:var(--tb-text-secondary);">' + r.message + '</small><br>' +
                '<small style="color:var(--tb-text-secondary);">' + r.created_at + '</small></div>';
            }).join("") + '</div>';
        } else {
          responsesHtml = '<p style="color:var(--tb-text-secondary);font-size:0.8rem;margin-top:8px;">暂无响应</p>';
        }
        return '<div class="tb-order-card">' +
          '<div class="tb-order-header">' +
          '<span class="tb-order-id">#' + o.id + '</span>' +
          '<span class="tb-order-status" style="color:' + statusColor + ';">' +
          (o.status === "active" ? "进行中" : o.status) + '</span></div>' +
          '<h4 style="font-size:0.95rem;">' + o.title + '</h4>' +
          '<p style="font-size:0.8rem;color:var(--tb-text-secondary);margin-top:4px;">预算：' + o.budget + ' | 发布时间：' + o.created_at + '</p>' +
          responsesHtml + '</div>';
      }).join("");
      container.innerHTML =
        '<div class="glass-card">' +
        '<div class="section-title"><i class="fas fa-clipboard-list"></i> 我的定制需求</div>' + list + '</div>';
    });
  },

  // ==================== CONSUMER: CART (Taobao Shopping Cart) ====================

  cart: function(container) {
    var cart = App.cart || [];
    if (cart.length === 0) {
      container.innerHTML =
        '<div class="glass-card">' +
        '<div class="section-title"><i class="fas fa-shopping-cart"></i> 购物车</div>' +
        '<div style="text-align:center;padding:60px;">' +
        '<i class="fas fa-shopping-cart" style="font-size:4rem;opacity:0.1;"></i>' +
        '<h3 style="margin-top:16px;color:var(--tb-text);">购物车是空的</h3>' +
        '<p style="color:var(--tb-text-secondary);margin-top:8px;">去 <a href="#" onclick="App.navigate('discovery');return false;" style="color:var(--tb-orange);font-weight:600;">发现好物</a> 逛逛吧</p></div></div>';
      return;
    }
    var total = 0;
    var items = cart.map(function(item, idx) {
      var subtotal = (item.price || 0) * (item.qty || 1);
      total += subtotal;
      return '<div class="tb-cart-item">' +
        '<div class="tb-cart-img">' + (item.image || "📦") + '</div>' +
        '<div class="tb-cart-info">' +
        '<div class="tb-cart-name">' + (item.name || "商品") + '</div>' +
        '<div class="tb-cart-spec">' + (item.shop_name || "") + '</div></div>' +
        '<div class="tb-cart-price-info">' +
        '<div class="tb-cart-price">¥' + (item.price || 0).toFixed(1) + '</div>' +
        '<div class="tb-cart-qty">' +
        '<button onclick="App.updateCartQty(' + idx + ',' + ((item.qty || 1) - 1) + ');App.navigate('cart')">-</button>' +
        '<input type="text" value="' + (item.qty || 1) + '" readonly />' +
        '<button onclick="App.updateCartQty(' + idx + ',' + ((item.qty || 1) + 1) + ');App.navigate('cart')">+</button></div></div>' +
        '<button class="btn btn-sm btn-danger" style="padding:4px 8px;min-width:auto;" onclick="App.removeFromCart(' + idx + ')"><i class="fas fa-trash"></i></button></div>';
    }).join("");
    container.innerHTML =
      '<div class="glass-card">' +
      '<div class="section-title"><i class="fas fa-shopping-cart"></i> 购物车</div>' +
      '<div class="tb-cart-list">' + items + '</div>' +
      '<div class="tb-cart-footer">' +
      '<div class="tb-cart-total">合计：<span class="tb-cart-total-price"><span class="tb-currency">¥</span>' + total.toFixed(1) + '</span></div>' +
      '<button class="tb-cart-checkout" onclick="showToast(结算功能开发中,info)">去结算</button></div></div>';
  },
  // ==================== CONSUMER: MESSAGES ====================

  messages: function(container) {
    var msgs = [
      { from: "福建茶品茶厂", text: "收到了您的定制需求，可以进一步沟通吗？", time: "2026-06-08 10:30", unread: true, color: "#FF6A00", icon: "fa-store" },
      { from: "系统通知", text: "您的定制需求「牛奶味茶饼」已被3家厂家查看", time: "2026-06-08 09:15", unread: true, color: "#3C8DFF", icon: "fa-bell" },
      { from: "浙江龙井茶园", text: "关于茉莉花茶定制，我们报价6000元/批", time: "2026-06-07 16:45", unread: false, color: "#00B578", icon: "fa-leaf" },
      { from: "系统通知", text: "您的订单已确认，等待厂家发货", time: "2026-06-07 14:20", unread: false, color: "#3C8DFF", icon: "fa-bell" },
    ];
    var list = msgs.map(function(m) {
      return '<div class="tb-msg-item">' +
        '<div class="tb-msg-avatar" style="background:' + m.color + '22;color:' + m.color + ';">' +
        '<i class="fas ' + m.icon + '"></i></div>' +
        '<div class="tb-msg-content">' +
        '<div class="tb-msg-title">' +
        '<strong>' + (m.unread ? '<span style="display:inline-block;width:6px;height:6px;background:var(--tb-red);border-radius:50%;margin-right:4px;"></span>' : '') + m.from + '</strong>' +
        '<span style="font-size:0.65rem;color:var(--tb-text-secondary);">' + m.time + '</span></div>' +
        '<div class="tb-msg-text">' + m.text + '</div></div></div>';
    }).join("");
    container.innerHTML =
      '<div class="glass-card"><div class="section-title"><i class="fas fa-envelope"></i> 消息中心</div>' + list + '</div>';
  },

  // ==================== CONSUMER: PROFILE (Taobao Style) ====================

  profile: function(container, user) {
    container.innerHTML =
      '<div>' +
      '<div class="tb-profile-header">' +
      '<div class="tb-avatar">' + user.name.charAt(0) + '</div>' +
      '<h3>' + user.name + '</h3>' +
      '<p>' + (App.roles[user.role] ? App.roles[user.role].name : "") + ' · ' + (user.location || "未设置所在地") + '</p></div>' +
      '<div class="tb-profile-stats">' +
      '<div class="tb-profile-stat"><div class="num">' + (App.cart ? App.cart.length : 0) + '</div><div class="label">购物车</div></div>' +
      '<div class="tb-profile-stat"><div class="num">0</div><div class="label">收藏</div></div>' +
      '<div class="tb-profile-stat"><div class="num">0</div><div class="label">足迹</div></div></div>' +
      '<div class="tb-profile-menu">' +
      '<button class="tb-profile-menu-item" onclick="App.navigate('my-orders')">' +
      '<i class="fas fa-clipboard-list"></i> 我的需求 <i class="fas fa-chevron-right tb-arrow"></i></button>' +
      '<button class="tb-profile-menu-item" onclick="App.navigate('cart')">' +
      '<i class="fas fa-shopping-cart"></i> 购物车 <i class="fas fa-chevron-right tb-arrow"></i></button>' +
      '<button class="tb-profile-menu-item" onclick="App.navigate('messages')">' +
      '<i class="fas fa-envelope"></i> 消息中心 <i class="fas fa-chevron-right tb-arrow"></i></button>' +
      '<button class="tb-profile-menu-item" onclick="showToast(设置页面开发中,info)">' +
      '<i class="fas fa-cog"></i> 账户设置 <i class="fas fa-chevron-right tb-arrow"></i></button>' +
      '<button class="tb-profile-menu-item" onclick="showToast(功能开发中,info)">' +
      '<i class="fas fa-heart"></i> 我的收藏 <i class="fas fa-chevron-right tb-arrow"></i></button>' +
      '<button class="tb-profile-menu-item" onclick="showToast(功能开发中,info)">' +
      '<i class="fas fa-clock"></i> 浏览记录 <i class="fas fa-chevron-right tb-arrow"></i></button></div></div>';
  },
  // ==================== MERCHANT ====================

  dashboard: function(container, user) {
    Promise.all([
      API.getMyQualifications(user.id), API.getMyProducts(user.id), API.getDemandMarket(user.id)
    ]).then(function(results) {
      var quals = results[0].data || []; var prods = results[1].data || []; var dems = results[2].data || [];
      var matched = dems.filter(function(d) { return d.matched; }).length;
      var activeQuals = quals.filter(function(q) { return q.status === "active"; }).length;
      var expiring = quals.filter(function(q) { return q.status === "active" && q.ExpiresAt && q.ExpiresAt <= "2026-09-01"; }).length;
      container.innerHTML =
        '<div class="grid-3">' +
        '<div class="glass-card"><div class="section-title"><i class="fas fa-boxes"></i> 商品数</div><div class="stat-number">' + prods.length + '</div><div class="subtitle">已上架商品</div></div>' +
        '<div class="glass-card"><div class="section-title"><i class="fas fa-bullseye"></i> 匹配需求</div><div class="stat-number">' + matched + '</div><div class="subtitle">可接单的定制</div></div>' +
        '<div class="glass-card"><div class="section-title"><i class="fas fa-id-card"></i> 有效资质</div><div class="stat-number">' + activeQuals + '</div><div class="subtitle">已认证资质</div></div></div>' +
        '<div class="grid-2" style="margin-top:24px;">' +
        '<div class="glass-card"><div class="section-title"><i class="fas fa-clock"></i> 待办事项</div>' +
        (matched > 0 ? '<p>📦 <a href="#" onclick="App.navigate('demand-market')">' + matched + ' 条匹配需求</a></p>' : '') +
        (expiring > 0 ? '<p style="color:#f59e0b;">⚠️ ' + expiring + ' 项资质即将到期</p>' : '') +
        '<p style="color:var(--tb-text-secondary);">暂无其他待办</p></div>' +
        '<div class="glass-card"><div class="section-title"><i class="fas fa-chart-line"></i> 经营概览</div>' +
        '<p>本月浏览量：--</p><p style="color:var(--tb-text-secondary);">更多数据开发中</p></div></div>';
    });
  },

  "product-list": function(container, user) {
    API.getMyProducts(user.id).then(function(res) {
      var data = res.data || [];
      if (data.length === 0) {
        container.innerHTML =
          '<div class="glass-card">' +
          '<div class="section-title" style="display:flex;justify-content:space-between;align-items:center;">' +
          '<span><i class="fas fa-boxes"></i> 我的商品</span>' +
          '<button class="btn" onclick="App.navigate('product-edit')" style="padding:8px 16px;">+ 发布新商品</button></div>' +
          '<div style="text-align:center;padding:60px;">' +
          '<i class="fas fa-box-open" style="font-size:3rem;opacity:0.15;"></i>' +
          '<p style="color:var(--tb-text-secondary);margin-top:12px;">暂无商品，点击上方按钮发布</p></div></div>';
      } else {
        var cards = data.map(function(p) { return ProductCard.render(p); }).join("");
        container.innerHTML =
          '<div class="glass-card">' +
          '<div class="section-title" style="display:flex;justify-content:space-between;align-items:center;">' +
          '<span><i class="fas fa-boxes"></i> 我的商品</span>' +
          '<button class="btn" onclick="App.navigate('product-edit')" style="padding:8px 16px;">+ 发布新商品</button></div>' +
          '<div class="tb-product-grid">' + cards + '</div></div>';
      }
    });
  },

  "product-edit": function(container, user) {
    container.innerHTML =
      '<div class="glass-card" style="max-width:700px;margin:0 auto;">' +
      '<div class="section-title"><i class="fas fa-cloud-upload-alt"></i> 发布新商品</div>' +
      '<div style="display:grid;gap:14px;">' +
      '<label>商品名称</label><input id="peName" placeholder="例如：有机铁观音" />' +
      '<label>品类</label><select id="peCategory"><option>茶叶</option><option>果蔬</option><option>谷物</option><option>畜牧</option></select>' +
      '<label>产地</label><input id="peOrigin" placeholder="例如：福建安溪" />' +
      '<label>价格（元）</label><input id="pePrice" type="number" placeholder="288" />' +
      '<label>认证类型</label><select id="peCert"><option>有机</option><option>绿色</option><option>地理标志</option><option>无公害</option></select>' +
      '<button class="btn" id="submitProduct" style="padding:14px;justify-content:center;"><i class="fas fa-upload"></i> 确认发布</button></div>' +
      '<div id="peResult" style="margin-top:16px;"></div></div>';
    document.getElementById("submitProduct").addEventListener("click", function() {
      var data = { name: document.getElementById("peName").value.trim(), category: document.getElementById("peCategory").value, origin: document.getElementById("peOrigin").value.trim(), price: parseFloat(document.getElementById("pePrice").value) || 0, certification: document.getElementById("peCert").value, traceable: true, shop_id: user.id, shop_name: user.name, image: "📦" };
      if (!data.name) { showToast("请填写商品名称", "error"); return; }
      API.createProduct(data).then(function(res) {
        document.getElementById("peResult").innerHTML = '<div style="text-align:center;padding:20px;color:var(--tb-green);"><i class="fas fa-check-circle" style="font-size:2rem;"></i><p>商品发布成功！</p></div>';
        showToast(res.message || "发布成功", "success");
        setTimeout(function() { App.navigate("product-list"); }, 1000);
      });
    });
  },

  "product-archive": function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-history"></i> 产品档案管理</div><p style="color:var(--tb-text-secondary);margin-bottom:16px;">为商品添加追溯节点，构建全链路档案</p><div style="display:grid;gap:12px;max-width:600px;"><select id="paProduct"><option>P001 - 有机铁观音</option><option>P002 - 武夷山大红袍</option></select><input id="paStep" placeholder="环节名称（如：采摘）" /><input id="paLocation" placeholder="地点" /><input id="paDesc" placeholder="描述" /><button class="btn">添加节点</button></div></div>';
  },

  "demand-market": function(container, user) {
    API.getDemandMarket(user.id).then(function(res) {
      var data = res.data || [];
      var list = data.map(function(d) {
        var matchTag = d.matched ? '<span style="background:var(--tb-orange-light);color:var(--tb-orange);border-radius:12px;padding:2px 10px;font-size:0.75rem;font-weight:600;">✅ 已匹配</span>' : '<span style="background:#f1f5f9;color:#64748b;border-radius:12px;padding:2px 10px;font-size:0.75rem;">未匹配</span>';
        return '<div class="glass-card" style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;align-items:start;"><h4>' + d.title + '</h4>' + matchTag + '</div><p style="font-size:0.85rem;color:var(--tb-text-secondary);">预算：' + d.budget + ' | ' + d.location + '</p><p style="font-size:0.8rem;">' + (d.policy || "") + '</p></div>';
      }).join("");
      container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-bullseye"></i> 需求市场</div>' + (list || '<p style="text-align:center;padding:40px;">暂无匹配需求</p>') + '</div>';
    });
  },

  qualifications: function(container, user) {
    API.getMyQualifications(user.id).then(function(res) {
      container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-id-card"></i> 我的资质</div>' + QualificationTags.render(res.data || []) + '<button class="btn btn-outline" onclick="App.navigate('apply-qual')" style="margin-top:12px;"><i class="fas fa-plus"></i> 申请新资质</button></div>';
    });
  },

  "apply-qual": function(container, user) {
    var selId = "aqType";
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-plus-circle"></i> 申请资质</div><div style="display:grid;gap:12px;max-width:500px;"><label>资质类型</label><select id="' + selId + '"><option value="Location=福建">Location=福建（产地认证）</option><option value="Capability=制茶">Capability=制茶（加工能力）</option><option value="Quality=有机">Quality=有机（品质认证）</option><option value="Grade=3">Grade=3（等级评定）</option></select><label>说明</label><textarea id="aqDesc" rows="2" placeholder="补充说明"></textarea><button class="btn" id="submitQual"><i class="fas fa-paper-plane"></i> 提交申请</button></div><div id="aqResult"></div></div>';
    document.getElementById("submitQual").addEventListener("click", function() {
      var val = document.getElementById(selId).value; var parts = val.split("=");
      API.applyQualification({ holder_id: user.id, holder_name: user.name, Type: parts[0], Value: parts[1] }).then(function(res) { document.getElementById("aqResult").innerHTML = '<p style="color:var(--tb-green);margin-top:8px;">✅ 申请已提交，等待审核</p>'; });
    });
  },

  orders: function(container) { container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-truck"></i> 订单管理</div><p style="color:var(--tb-text-secondary);">暂无订单</p></div>'; },

  "my-shop": function(container, user) {
    container.innerHTML = '<div><div class="tb-store-header"><div class="tb-store-logo"><i class="fas fa-store"></i></div><div class="tb-store-info"><h3>' + user.name + '</h3><p>店铺主人 · ' + (user.location || "未设置") + '</p></div></div><div class="glass-card"><div class="section-title"><i class="fas fa-cog"></i> 店铺设置</div><div style="display:grid;gap:12px;max-width:500px;"><label>店铺名称</label><input value="' + user.name + '" /><label>店铺简介</label><textarea rows="2" placeholder="介绍您的店铺和产品"></textarea><label>联系方式</label><input placeholder="手机号" /><button class="btn" onclick="showToast(店铺信息已保存,success)" style="justify-content:center;">保存设置</button></div></div></div>';
  },
  // ==================== CERTIFIER ====================

  "review-list": function(container, user) {
    API.getReviewList().then(function(res) {
      var items = res.data || [];
      if (items.length === 0) { container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-check-double"></i> 审核列表</div><p style="text-align:center;padding:40px;color:var(--tb-text-secondary);">暂无待审核的资质申请</p></div>'; return; }
      var list = items.map(function(item) {
        return '<div class="glass-card" style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;"><h4>' + item.holder_name + '</h4><span class="badge">' + item.Type + '=' + item.Value + '</span></div><p style="font-size:0.8rem;color:var(--tb-text-secondary);margin-top:4px;">申请时间：' + item.created_at + '</p><div style="display:flex;gap:8px;margin-top:10px;"><button class="btn btn-sm" onclick="handleApprove(' + "'" + item.id + "'" + ')">通过</button><button class="btn btn-sm btn-outline" style="color:var(--tb-red);border-color:var(--tb-red);" onclick="handleReject(' + "'" + item.id + "'" + ')">拒绝</button></div></div>';
      }).join("");
      container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-check-double"></i> 审核列表</div>' + list + '</div>';
      window.handleApprove = function(id) { API.approveReview(id, user.id).then(function(res) { showToast("已批准通过", "success"); App.navigate("review-list"); }); };
      window.handleReject = function(id) { API.rejectReview(id).then(function() { showToast("已拒绝", "info"); App.navigate("review-list"); }); };
    });
  },

  "review-history": function(container) {
    var rows = '<tr><td>福建茶品茶厂</td><td>Location=福建</td><td><span style="color:var(--tb-green);">通过</span></td><td>2026-01-01</td></tr><tr><td>福建茶品茶厂</td><td>Capability=制茶</td><td><span style="color:var(--tb-green);">通过</span></td><td>2026-01-01</td></tr><tr><td>山东丰收食品厂</td><td>Quality=有机</td><td><span style="color:var(--tb-red);">拒绝</span></td><td>2026-04-01</td></tr>';
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-history"></i> 审核历史</div><p style="color:var(--tb-text-secondary);margin-bottom:16px;">已处理的资质申请记录</p><table><thead><tr><th>申请人</th><th>类型</th><th>结果</th><th>日期</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  },

  "qual-management": function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-medal"></i> 全平台资质管理</div><p style="color:var(--tb-text-secondary);margin-bottom:16px;">管理已颁发的全部资质</p><table><thead><tr><th>持有方</th><th>资质</th><th>状态</th><th>到期</th><th>操作</th></tr></thead><tbody><tr><td>福建茶品茶厂</td><td>Location=福建</td><td><span class="badge">有效</span></td><td>2027-01-01</td><td><button class="btn btn-outline btn-sm" onclick="showToast(资质已收回,info)">收回</button></td></tr><tr><td>福建茶品茶厂</td><td>Grade=3</td><td><span class="badge" style="background:#fef3c7;color:#92400e;">即将到期</span></td><td>2026-08-01</td><td><button class="btn btn-sm" onclick="showToast(已续期,success)">续期</button></td></tr></tbody></table></div>';
  },

  "revoke-qual": function(container) {
    container.innerHTML = '<div class="glass-card" style="max-width:500px;margin:0 auto;"><div class="section-title"><i class="fas fa-ban"></i> 收回资质</div><p style="color:var(--tb-text-secondary);margin-bottom:12px;">收回资质将导致持有方立即失去对应的访问权限</p><input id="rqId" placeholder="资质编号" /><textarea id="rqReason" rows="2" placeholder="收回原因"></textarea><button class="btn" style="margin-top:12px;background:var(--tb-red);" onclick="showToast(资质已收回,info)"><i class="fas fa-check"></i> 确认收回</button></div>';
  },

  "scope-config": function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-sliders-h"></i> 管辖范围配置</div><p style="color:var(--tb-text-secondary);">配置本机构管理的资质类型和审核标准</p><select multiple style="height:120px;margin-bottom:12px;"><option selected>Location - 产地认证</option><option selected>Capability - 加工能力</option><option>Quality - 品质认证</option><option>Grade - 等级评定</option></select><button class="btn" onclick="showToast(配置已保存,success)">保存配置</button></div>';
  },

  statistics: function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-chart-bar"></i> 统计分析</div><div class="grid-2"><div class="glass-card"><h4>月度趋势</h4><p style="font-size:2rem;text-align:center;color:var(--tb-orange);">↑23%</p><p style="text-align:center;color:var(--tb-text-secondary);">本月审核量</p></div><div class="glass-card"><h4>类型分布</h4><p style="text-align:center;">Location: 40% | Capability: 35% | Quality: 25%</p></div></div></div>';
  },

  "operation-log": function(container) {
    var logs = [{ action: "审批通过", target: "福建茶品茶厂", detail: "Location=福建", time: "2026-01-01 10:00" },{ action: "审批通过", target: "福建茶品茶厂", detail: "Capability=制茶", time: "2026-01-01 10:05" },{ action: "收回资质", target: "某食品厂", detail: "Quality=有机", time: "2026-05-15 14:30" }];
    var rows = logs.map(function(l) { return '<tr><td>' + l.action + '</td><td>' + l.target + '</td><td>' + l.detail + '</td><td>' + l.time + '</td></tr>'; }).join("");
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-clipboard-list"></i> 操作记录</div><table><thead><tr><th>操作</th><th>对象</th><th>详情</th><th>时间</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  },

  "org-profile": function(container, user) {
    container.innerHTML = '<div class="glass-card" style="max-width:600px;margin:0 auto;"><div class="section-title"><i class="fas fa-building"></i> 机构信息</div><div style="display:grid;gap:12px;"><label>机构名称</label><input value="' + user.name + '" /><label>管辖范围描述</label><textarea rows="2">负责审核农产品相关企业资质</textarea><button class="btn" onclick="showToast(信息已保存,success)">保存</button></div></div>';
  },
  // ==================== ADMIN ====================

  "user-management": function(container) {
    API.getAllUsers().then(function(res) {
      var users = res.data || []; var names = { consumer: "消费者", merchant: "商家", certifier: "审核方", admin: "管理员", regulator: "监管方" };
      var rows = users.map(function(u) { return '<tr><td>' + u.id + '</td><td>' + u.name + '</td><td>' + (names[u.role] || u.role) + '</td><td>' + (u.location || "--") + '</td><td><button class="btn btn-outline btn-sm">查看</button> <button class="btn btn-outline btn-sm" style="color:var(--tb-red);border-color:var(--tb-red);">禁用</button></td></tr>'; }).join("");
      container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-users"></i> 用户管理</div><table><thead><tr><th>ID</th><th>姓名</th><th>角色</th><th>所在地</th><th>操作</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    });
  },

  "certifier-management": function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-building"></i> 审核方管理</div><table><thead><tr><th>名称</th><th>管辖范围</th><th>状态</th><th>操作</th></tr></thead><tbody><tr><td>福建省工商认证中心</td><td>Location, Grade</td><td><span class="badge">正常</span></td><td><button class="btn btn-outline btn-sm">查看</button></td></tr><tr><td>有机食品认证协会</td><td>Quality, Organic</td><td><span class="badge">正常</span></td><td><button class="btn btn-outline btn-sm">查看</button></td></tr></tbody></table><button class="btn btn-outline" style="margin-top:12px;" onclick="showToast(新审核方已添加,success)">+ 添加审核方</button></div>';
  },

  "rule-management": function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-gear"></i> 平台认证规则</div><p style="color:var(--tb-text-secondary);margin-bottom:16px;">管理全局认证体系配置，规则更新将影响所有通行证</p><div class="glass-card" style="margin-bottom:12px;"><h4>当前规则版本</h4><p>v1.0 — 已生效</p></div><button class="btn" id="sysUpdBtn" style="background:#f59e0b;"><i class="fas fa-sync"></i> 更新认证规则</button><p style="font-size:0.8rem;color:var(--tb-red);margin-top:8px;">⚠️ 更新后所有受影响的通行证需重新获取</p><div id="sysUpdResult" style="margin-top:12px;"></div></div>';
    document.getElementById("sysUpdBtn").addEventListener("click", function() { API.sysUpdate().then(function(res) { document.getElementById("sysUpdResult").innerHTML = '<p style="color:var(--tb-green);">' + res.message + '</p>'; }); });
  },

  "rule-update": function(container) { App.navigate("rule-management"); },

  "sys-config": function(container) { container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-cogs"></i> 系统配置</div><div style="display:grid;gap:12px;"><label>平台服务地址</label><input value="http://localhost:8080" /><label>数据保留策略（天）</label><input value="365" /><button class="btn" onclick="showToast(配置已保存,success)">保存</button></div></div>'; },

  "content-audit": function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-eye"></i> 内容审核</div><table><thead><tr><th>类型</th><th>内容</th><th>发布者</th><th>操作</th></tr></thead><tbody><tr><td>商品</td><td>有机铁观音</td><td>福建茶品茶厂</td><td><button class="btn btn-sm">通过</button> <button class="btn btn-outline btn-sm">下架</button></td></tr><tr><td>定制</td><td>牛奶味茶饼</td><td>张果农</td><td><button class="btn btn-sm">通过</button> <button class="btn btn-outline btn-sm">删除</button></td></tr></tbody></table></div>';
  },

  dispute: function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-gavel"></i> 纠纷处理</div><p style="color:var(--tb-text-secondary);">交易纠纷仲裁平台（管理员可查看全部加密信息）</p><div class="glass-card" style="margin-top:12px;"><h4>案例 #D001</h4><p>消费者张果农 vs 山东丰收食品厂</p><p style="font-size:0.8rem;">争议：产品质量不符 — <a href="#">查看详情</a></p><button class="btn btn-sm" style="margin-top:8px;">裁决</button></div></div>';
  },

  "audit-log": function(container) {
    var logs = [{ user: "平台管理员", action: "更新认证规则", target: "全局", time: "2026-06-08 11:30" },{ user: "福建省工商认证中心", action: "审批通过", target: "福建茶品茶厂/Location", time: "2026-01-01 10:00" },{ user: "平台管理员", action: "禁用用户", target: "某商家", time: "2026-05-01" }];
    var rows = logs.map(function(l) { return '<tr><td>' + l.user + '</td><td>' + l.action + '</td><td>' + l.target + '</td><td>' + l.time + '</td></tr>'; }).join("");
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-book"></i> 操作审计</div><table><thead><tr><th>操作人</th><th>操作</th><th>对象</th><th>时间</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  },

  reports: function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-file-alt"></i> 数据报表</div><div class="grid-3"><div class="glass-card"><h4>📊 用户增长</h4><p style="font-size:2rem;color:var(--tb-green);">+12%</p><p style="font-size:0.8rem;">本月新增</p></div><div class="glass-card"><h4>📝 交易量</h4><p style="font-size:2rem;color:#3b82f6;">247</p><p style="font-size:0.8rem;">本月订单</p></div><div class="glass-card"><h4>🔼 资质认证</h4><p style="font-size:2rem;color:#f59e0b;">8</p><p style="font-size:0.8rem;">有效资质</p></div></div><button class="btn btn-outline" style="margin-top:16px;"><i class="fas fa-download"></i> 导出- 报表</button></div>';
  },
  // ==================== REGULATOR ====================

  "archive-search": function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-search"></i> 产品档案全链路查询</div><div style="display:flex;gap:12px;margin-bottom:20px;"><input id="arcKeyword" placeholder="输入产品名称/编号/批次" style="flex:1;"/><button class="btn" id="arcSearchBtn"><i class="fas fa-search"></i> 查询</button></div><div id="arcResult"></div></div>';
    document.getElementById("arcSearchBtn").addEventListener("click", function() {
      var kw = document.getElementById("arcKeyword").value.trim();
      if (!kw) return;
      API.regulatorSearch(kw).then(function(res) {
        var data = res.data || [];
        var html = data.map(function(d) {
          var timeline = (d.archive || []).map(function(n) { return '<div class="timeline-step"><div class="timeline-icon"><i class="fas fa-circle"></i></div><div><strong>' + n.step + '</strong> <span style="font-size:0.8rem;">' + n.location + ' · ' + n.time + '</span><br><small>' + n.desc + '</small></div></div>'; }).join("");
          return '<div class="glass-card" style="margin-bottom:12px;"><h4>' + d.product.name + ' <span class="badge" style="background:#fee2e2;color:#991b1b;">监管完整可见</span></h4><p>产地：' + d.product.origin + ' | 品类：' + d.product.category + ' | ¥' + d.product.price + '</p><div style="margin-top:8px;">' + timeline + '</div></div>';
        }).join("");
        document.getElementById("arcResult").innerHTML = html || '<p style="padding:40px;text-align:center;">未找到匹配产品</p>';
      });
    });
  },

  "archive-report": function(container) { container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-file-pdf"></i> 档案报告</div><p style="color:var(--tb-text-secondary);">从产品档案查询页面点击"生成报告"</p><button class="btn" style="margin-top:12px;"><i class="fas fa-download"></i> 下载最近报告</button></div>'; },

  "merchant-audit": function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-building"></i> 商家合规检查</div><table><thead><tr><th>商家</th><th>资质量</th><th>合规状态</th><th>上次检查</th><th>操作</th></tr></thead><tbody><tr><td>福建茶品茶厂</td><td>4项</td><td><span style="color:var(--tb-green);">合规</span></td><td>2026-05-01</td><td><button class="btn btn-outline btn-sm">检查</button></td></tr><tr><td>山东丰收食品厂</td><td>2项</td><td><span style="color:#f59e0b;">待核查</span></td><td>2026-04-15</td><td><button class="btn btn-outline btn-sm">检查</button></td></tr><tr><td>浙江龙井茶园</td><td>2项</td><td><span style="color:var(--tb-green);">合规</span></td><td>2026-05-20</td><td><button class="btn btn-outline btn-sm">检查</button></td></tr></tbody></table></div>';
  },

  "product-spot": function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-check-circle"></i> 商品抽检</div><p style="color:var(--tb-text-secondary);margin-bottom:12px;">随机抽检商品追溯信息完整性</p><button class="btn" id="randomSpotBtn"><i class="fas fa-random"></i> 随机抽检</button><div id="spotResult" style="margin-top:16px;"></div></div>';
    document.getElementById("randomSpotBtn").addEventListener("click", function() {
      var samples = ["P001-有机铁观音", "P002-大红袍", "P003-龙井绿茶", "P004-红富士苹果", "P005-阳光玫瑰"];
      var idx = Math.floor(Math.random() * samples.length);
      document.getElementById("spotResult").innerHTML = '<div class="glass-card"><h4>抽检结果：' + samples[idx] + '</h4><p style="color:var(--tb-green);">✅ 追溯档案完整，检测报告齐全</p></div>';
    });
  },

  emergency: function(container) {
    container.innerHTML = '<div class="glass-card" style="max-width:600px;margin:0 auto;border:2px solid var(--tb-red);"><div class="section-title" style="color:var(--tb-red);"><i class="fas fa-exclamation-triangle"></i> 应急处理</div><p style="margin-bottom:16px;color:var(--tb-text-secondary);">紧急情况下可查看全部加密档案信息</p><input id="emProdId" placeholder="输入产品编号/批次号" /><button class="btn" id="emDecryptBtn" style="margin-top:12px;background:var(--tb-red);justify-content:center;"><i class="fas fa-unlock"></i> 紧急查看完整档案</button><p style="font-size:0.75rem;color:var(--tb-red);margin-top:4px;">⚠️ 此操作将被记录并上报</p><div id="emResult" style="margin-top:16px;"></div></div>';
    document.getElementById("emDecryptBtn").addEventListener("click", function() {
      var pid = document.getElementById("emProdId").value.trim();
      if (!pid) { showToast("请输入产品编号", "error"); return; }
      API.emergencyDecrypt(pid).then(function(res) {
        document.getElementById("emResult").innerHTML = '<div class="glass-card" style="border:1px solid var(--tb-green);"><h4>紧急解密结果</h4><pre style="font-size:0.8rem;white-space:pre-wrap;">' + JSON.stringify(res.data || [], null, 2) + '</pre></div>';
        showToast("紧急解密已记录", "info");
      });
    });
  },

  "emergency-detail": function(container) { App.navigate("emergency"); },

  permission: function(container) {
    container.innerHTML = '<div class="glass-card"><div class="section-title"><i class="fas fa-shield-alt"></i> 监管权限管理</div><div class="glass-card" style="background:#e6f4ea;"><p>✅ 当前权限：<strong>全部监管权限</strong></p><p style="font-size:0.8rem;">有效期至：2027-01-01 | 使用次数：12次</p></div><p style="margin-top:12px;color:var(--tb-text-secondary);">权限使用记录</p><table><tr><td>2026-06-08 10:30</td><td>档案查询</td><td>P001</td></tr><tr><td>2026-06-07 15:00</td><td>紧急解密</td><td>P003</td></tr></table></div>';
  },
};

