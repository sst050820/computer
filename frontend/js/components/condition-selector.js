var ConditionSelector = {
  conditionTypes: [
    { key: "Location",   label: "产地要求", options: ["", "福建", "山东", "浙江", "云南", "安徽", "四川", "广东"] },
    { key: "Capability", label: "加工能力", options: ["", "制茶", "果蔬加工", "糕点制作", "酿造", "干货加工", "冷冻加工"] },
    { key: "Quality",    label: "品质认证", options: ["", "有机", "绿色", "地理标志", "无公害"] },
    { key: "Grade",      label: "等级要求", options: ["", "1", "2", "3", "4", "5"] },
    { key: "Organic",    label: "有机认证", options: ["", "是", "否"] },
  ],
  _listeners: {},

  render: function(el, onChange) {
    if (typeof el === "string") el = document.getElementById(el);
    if (!el) return;
    var idPrefix = "cs_" + Math.random().toString(36).slice(2, 6);
    el.dataset.idPrefix = idPrefix;
    var self = this;

    var html = "";
    this.conditionTypes.forEach(function(ct) {
      var optionsHtml = ct.options.map(function(o) {
        return '<option value="' + o + '">' + (o || "不限") + '</option>';
      }).join("");
      html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">' +
        '<label style="min-width:90px;font-weight:500;font-size:0.9rem;">' + ct.label + '</label>' +
        '<select id="' + idPrefix + '_' + ct.key + '" style="flex:1;"' +
        ' onchange="ConditionSelector._emit(\'' + idPrefix + '\')">' +
        optionsHtml + '</select></div>';
    });
    el.innerHTML = html;
    if (onChange) this._listeners[idPrefix] = onChange;
    this._emit(idPrefix);
  },

  _emit: function(idPrefix) {
    var conds = this.getConditions(idPrefix);
    var policy = this.toPolicy(conds);
    var fn = this._listeners[idPrefix];
    if (fn) fn(conds, policy);
  },

  getConditions: function(elOrId) {
    var idPrefix = typeof elOrId === "string"
      ? elOrId : (elOrId.dataset && elOrId.dataset.idPrefix);
    var conds = {};
    this.conditionTypes.forEach(function(ct) {
      var sel = document.getElementById(idPrefix + "_" + ct.key);
      if (sel && sel.value) conds[ct.key] = sel.value;
    });
    return conds;
  },

  toPolicy: function(conds) {
    var parts = [], count = 0;
    for (var k in conds) {
      if (conds[k] && conds[k] !== "否") {
        parts.push(k + "=" + conds[k]); count++;
      }
    }
    return count === 0 ? "" : "(" + parts.join(", ") + "; " + count + ")";
  },
};
