/* VueCart — reliable: local data copy + splice triggering */
var VueCart = {
  name: 'VueCart',
  template: '<div>' +
    '<base-empty v-if="list.length===0" icon="fa-shopping-cart" title="购物车是空的">' +
    '<base-button variant="secondary" @click="goShop">去逛逛</base-button>' +
    '</base-empty>' +

    '<div v-if="list.length>0">' +
    '<div class="cart-list">' +
    '<div v-for="(item, idx) in list" :key="idx" class="cart-item">' +
    '<div class="cart-item-img">{{ item.image || "📦" }}</div>' +
    '<div class="cart-item-info">' +
    '<div class="cart-item-name">{{ item.name }}</div>' +
    '<div class="cart-item-shop">{{ item.shop_name || "" }}</div>' +
    '</div>' +
    '<div style="text-align:right;">' +
    '<div class="cart-item-price">¥{{ ((item.price||0)*(item.qty||1)).toFixed(1) }}</div>' +
    '<div class="cart-qty">' +
    '<button @click="dec(idx)">−</button>' +
    '<span style="display:inline-block;width:36px;text-align:center;line-height:28px;">{{ item.qty||1 }}</span>' +
    '<button @click="inc(idx)">+</button>' +
    '</div></div>' +
    '<button class="btn btn-danger-ghost btn-sm" style="min-width:auto;padding:6px 10px;" @click="del(idx)"><i class="fas fa-trash"></i></button>' +
    '</div></div>' +

    '<div class="cart-summary">' +
    '<div class="cart-total">合计 <span class="total-price">¥{{ total.toFixed(1) }}</span></div>' +
    '<base-button size="lg" @click="openPay">去结算</base-button>' +
    '</div></div>' +

    /* Payment modal */
    '<div v-if="paying" class="modal-overlay" @click.self="paying=false">' +
    '<div class="modal-content" style="max-width:500px;">' +
    '<div class="modal-header"><h3 class="modal-title">确认订单</h3><button class="modal-close" @click="paying=false"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    '<div style="margin-bottom:16px;">' +
    '<div v-for="(item, idx) in list" :key="\'p\'+idx" style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--co-neutral-100);">' +
    '<div style="flex:1;"><div style="font-weight:500;font-size:0.9rem;">{{ item.name }}</div><div style="font-size:0.75rem;color:var(--co-neutral-500);">{{ item.shop_name || "" }} × {{ item.qty||1 }}</div></div>' +
    '<div style="font-weight:600;font-size:0.95rem;color:var(--co-accent-berry);">¥{{ ((item.price||0)*(item.qty||1)).toFixed(1) }}</div>' +
    '</div></div>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;margin-bottom:12px;">' +
    '<span style="font-weight:600;">应付金额</span>' +
    '<span style="font-size:1.4rem;font-weight:700;color:var(--co-accent-berry);">¥{{ total.toFixed(1) }}</span></div>' +
    '<div style="text-align:center;padding:24px;background:var(--co-neutral-50);border-radius:var(--rd-lg);margin-bottom:12px;border:2px dashed var(--co-neutral-300);">' +
    '<div style="width:170px;height:170px;background:#fff;border:1px solid var(--co-neutral-200);border-radius:var(--rd-md);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;">' +
    '<div style="text-align:center;color:var(--co-neutral-400);"><i class="fas fa-qrcode" style="font-size:3rem;display:block;margin-bottom:6px;"></i><span style="font-size:0.8rem;">微信/支付宝扫码</span></div></div>' +
    '<p style="font-size:0.75rem;color:var(--co-neutral-500);">二维码区域 · 接入真实支付后替换</p></div>' +
    '<div style="display:flex;gap:10px;">' +
    '<base-button block variant="outline" @click="paying=false">返回</base-button>' +
    '<base-button block @click="doPay" :loading="submitting">确认支付 ¥{{ total.toFixed(1) }}</base-button></div>' +
    '<div v-if="err" style="margin-top:10px;color:var(--co-error);text-align:center;font-size:0.85rem;">{{ err }}</div>' +
    '</div></div></div>' +

    '<div v-if="done" class="card" style="text-align:center;border:2px solid var(--co-success);">' +
    '<i class="fas fa-check-circle" style="font-size:3rem;color:var(--co-success);display:block;margin-bottom:10px;"></i>' +
    '<h3>支付成功！</h3><p>共 {{ cnt }} 笔订单已生成</p>' +
    '<base-button variant="secondary" @click="reset">继续逛逛</base-button></div>' +
    '</div>',

  data: function() {
    return {
      list: [],
      paying: false,
      submitting: false,
      done: false,
      cnt: 0,
      err: ''
    };
  },
  computed: {
    total: function() {
      var t = 0;
      for (var i = 0; i < this.list.length; i++) {
        t += (this.list[i].price || 0) * (this.list[i].qty || 1);
      }
      return t;
    }
  },
  mounted: function() { this.load(); },
  methods: {
    load: function() {
      var src = (window.App && window.App.cart) ? window.App.cart : [];
      // Deep clone so Vue tracks our own copies
      var arr = [];
      for (var i = 0; i < src.length; i++) {
        var s = src[i];
        arr.push({ id: s.id, name: s.name, price: s.price, image: s.image, qty: s.qty || 1, shop_id: s.shop_id || '', shop_name: s.shop_name || '' });
      }
      this.list = arr;
    },
    save: function() {
      if (window.App && window.App.cart) {
        window.App.cart.splice(0, window.App.cart.length);
        for (var i = 0; i < this.list.length; i++) {
          var item = this.list[i];
          window.App.cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, qty: item.qty, shop_id: item.shop_id, shop_name: item.shop_name });
        }
        localStorage.setItem(window.cartKey ? window.cartKey() : 'fruit_cart_guest', JSON.stringify(window.App.cart));
      }
    },
    inc: function(idx) {
      var old = this.list[idx];
      var newQty = (old.qty || 1) + 1;
      if (newQty > 99) newQty = 99;
      this.list.splice(idx, 1, { id:old.id, name:old.name, price:old.price, image:old.image, qty:newQty, shop_id:old.shop_id, shop_name:old.shop_name });
      this.save();
      this.save();
    },
    dec: function(idx) {
      var old = this.list[idx];
      var newQty = (old.qty || 1) - 1;
      if (newQty < 1) newQty = 1;
      this.list.splice(idx, 1, { id:old.id, name:old.name, price:old.price, image:old.image, qty:newQty, shop_id:old.shop_id, shop_name:old.shop_name });
      this.save();
    },
    del: function(idx) {
      this.list.splice(idx, 1);
      this.save();
    },
    openPay: function() { this.paying = true; this.err = ''; },
    doPay: function() {
      var self = this;
      var user = window.App && window.App.currentUser;
      if (!user) { this.err = '请先登录'; return; }
      if (this.list.length === 0) return;
      this.submitting = true;
      this.err = '';

      var promises = [];
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        promises.push(
          API._fetch('/api/orders', {
            method: 'POST',
            body: JSON.stringify({
              consumer_id: user.id, consumer_name: user.name || '',
              merchant_id: item.shop_id || '', product_id: item.id || '',
              product_name: item.name || '', quantity: item.qty || 1, price: item.price || 0
            })
          })
        );
      }

      Promise.all(promises).then(function(results) {
        self.submitting = false;
        var ok = 0;
        for (var j = 0; j < results.length; j++) {
          if (results[j] && results[j].status === 'success') ok++;
        }
        if (ok > 0) {
          self.cnt = ok; self.done = true; self.paying = false;
          self.list = [];
          if (window.App && window.App.cart) window.App.cart.splice(0, window.App.cart.length);
          window.showToast && window.showToast('支付成功！' + ok + ' 笔订单', 'success');
        } else {
          self.err = '支付失败，请重试';
        }
      }).catch(function(e) {
        self.submitting = false;
        self.err = '网络错误: ' + (e && e.message ? e.message : '请检查服务');
      });
    },
    reset: function() { this.list = []; this.done = false; this.cnt = 0; if (window.App && window.App.cart) { window.App.cart.splice(0, window.App.cart.length); localStorage.setItem(window.cartKey ? window.cartKey() : 'fruit_cart_guest', '[]'); } },
    goShop: function() { if (window.navigateTo) window.navigateTo('discovery'); }
  }
};
