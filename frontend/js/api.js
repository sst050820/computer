var API = {
  _fetch: function(url, opts) {
    opts = opts || {};
    opts.headers = Object.assign(
      { "Content-Type": "application/json" },
      opts.headers || {}
    );
    return fetch(url, opts).then(function(r) { return r.json(); });
  },

  // 认证
  loginByRole: function(role) {
    var body = JSON.stringify({ role: role });
    return this._fetch("/api/auth/login", { method: "POST", body: body });
  },
  loginWithPassword: function(username, password) {
    var body = JSON.stringify({ username: username, password: password });
    return this._fetch("/api/auth/login", { method: "POST", body: body });
  },
  register: function(username, password, name, role, phone, location) {
    var body = JSON.stringify({
      username: username, password: password, name: name,
      role: role || "consumer", phone: phone || "", location: location || ""
    });
    return this._fetch("/api/auth/register", { method: "POST", body: body });
  },
  login: function(role) { return this.loginByRole(role); },

  // 商品
  getProducts: function(params) {
    var q = new URLSearchParams(params || {}).toString();
    return this._fetch("/api/products?" + q);
  },
  getProductDetail: function(id) {
    return this._fetch("/api/products/" + id);
  },
  getMyProducts: function(shopId) {
    return this._fetch("/api/my-products?shop_id=" + shopId);
  },
  createProduct: function(data) {
    return this._fetch("/api/products", { method: "POST", body: JSON.stringify(data) });
  },

  // 产品档案
  getArchive: function(productId, role) {
    return this._fetch("/api/archive/" + productId + "?role=" + role);
  },

  // 定制需求
  createCustomOrder: function(data) {
    return this._fetch("/api/custom-order", { method: "POST", body: JSON.stringify(data) });
  },
  getMyCustomOrders: function(consumerId) {
    return this._fetch("/api/custom-orders?consumer_id=" + consumerId);
  },
  getCustomOrderDetail: function(id) {
    return this._fetch("/api/custom-orders/" + id);
  },
  respondToOrder: function(orderId, data) {
    return this._fetch("/api/custom-orders/" + orderId + "/respond",
      { method: "POST", body: JSON.stringify(data) });
  },

  // 需求市场
  getDemandMarket: function(merchantId) {
    return this._fetch("/api/demand-market?merchant_id=" + merchantId);
  },

  // 资质
  getMyQualifications: function(holderId) {
    return this._fetch("/api/my-qualifications?holder_id=" + holderId);
  },
  applyQualification: function(data) {
    return this._fetch("/api/qualifications/apply",
      { method: "POST", body: JSON.stringify(data) });
  },

  // 审核方
  getReviewList: function() { return this._fetch("/api/review-list"); },
  approveReview: function(id, certifierId) {
    return this._fetch("/api/review/" + id + "/approve",
      { method: "POST", body: JSON.stringify({ certifier_id: certifierId }) });
  },
  rejectReview: function(id) {
    return this._fetch("/api/review/" + id + "/reject", { method: "POST" });
  },
  revokeQualification: function(id) {
    return this._fetch("/api/qualifications/" + id + "/revoke", { method: "POST" });
  },

  // 管理员
  getAllUsers: function() { return this._fetch("/api/admin/users"); },
  getAllQualifications: function() { return this._fetch("/api/admin/qualifications"); },
  getAllCustomOrders: function() { return this._fetch("/api/admin/orders"); },
  sysUpdate: function() {
    return this._fetch("/api/admin/sys-update", { method: "POST" });
  },

  // 监管方
  regulatorSearch: function(keyword) {
    return this._fetch("/api/regulator/search?keyword=" + encodeURIComponent(keyword));
  },
  emergencyDecrypt: function(productId) {
    return this._fetch("/api/regulator/emergency",
      { method: "POST", body: JSON.stringify({ product_id: productId }) });
  },

  // ABE 解密
  decryptABE: function(sessionId, ciphertext, merchantId) {
    return this._fetch("/api/abe/decrypt", {
      method: "POST",
      body: JSON.stringify({
        session_id: sessionId, ciphertext: ciphertext, merchant_id: merchantId
      })
    });
  },
};
