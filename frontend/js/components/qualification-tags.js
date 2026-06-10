var QualificationTags = {
  typeColors: {
    Location:   { bg: "#e0f2fe", color: "#0369a1", icon: "fa-map-marker-alt" },
    Capability: { bg: "#fef3c7", color: "#92400e", icon: "fa-tools" },
    Quality:    { bg: "#e6f4ea", color: "#0e6a3b", icon: "fa-check-circle" },
    Grade:      { bg: "#f3e8ff", color: "#6b21a8", icon: "fa-star" },
    Organic:    { bg: "#d1fae5", color: "#065f46", icon: "fa-leaf" },
  },

  render: function(quals) {
    if (!quals || quals.length === 0) {
      return '<p style="color:var(--text-secondary);padding:20px;text-align:center;">' +
        '暂无资质 — 申请资质后可在需求市场看到匹配的定制订单</p>';
    }

    var active = quals.filter(function(q) { return q.status === 'active'; });
    var pending = quals.filter(function(q) { return q.status === 'pending'; });
    var expired = quals.filter(function(q) {
      return q.status === 'expired' || q.status === 'revoked';
    });
    var html = "";
    var self = this;

    if (active.length > 0) {
      html += '<h4 style="margin-bottom:8px;">✅ 有效资质（' + active.length + '）</h4>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">';
      active.forEach(function(q) {
        var tc = self.typeColors[q.Type] || { bg: "#f1f5f9", color: "#475569", icon: "fa-tag" };
        html += '<div style="background:' + tc.bg + ';color:' + tc.color +
          ';border-radius:16px;padding:8px 16px;font-weight:500;font-size:0.85rem;">' +
          '<i class="fas ' + tc.icon + '"></i> ' + q.Type + '=' + q.Value +
          '<span style="font-size:0.7rem;opacity:0.7;display:block;">到期: ' + q.ExpiresAt + '</span></div>';
      });
      html += '</div>';
    }

    if (pending.length > 0) {
      html += '<h4 style="margin-bottom:8px;">⏳ 待审核（' + pending.length + '）</h4>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">';
      pending.forEach(function(q) {
        html += '<div style="background:#fef3c7;color:#92400e;border-radius:16px;' +
          'padding:8px 16px;font-weight:500;font-size:0.85rem;">' +
          q.Type + '=' + q.Value + ' <span style="font-size:0.7rem;">审核中</span></div>';
      });
      html += '</div>';
    }

    if (expired.length > 0) {
      html += '<h4 style="margin-bottom:8px;">❌ 已失效（' + expired.length + '）</h4>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">';
      expired.forEach(function(q) {
        html += '<div style="background:#fee2e2;color:#991b1b;border-radius:16px;' +
          'padding:8px 16px;font-weight:500;font-size:0.85rem;text-decoration:line-through;">' +
          q.Type + '=' + q.Value + '</div>';
      });
      html += '</div>';
    }

    return html || '<p>暂无资质</p>';
  }
};
