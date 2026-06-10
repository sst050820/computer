var ProductCard = {
  render: function(p) {
    var emojiMap = {
      "茶叶": "🍵", "果蔬": "🍎", "谷物": "🌾", "畜牧": "🥩",
      "菌菇": "🍄", "蜂蜜": "🍯", "零食": "🍪", "粮油": "🫒"
    };
    var imgEmoji = p.image && p.image !== "📦" && p.image !== "📦" ? p.image : (emojiMap[p.category] || "📦");
    var sales = p.sales || Math.floor(Math.random() * 5000) + 100;
    var rating = p.rating || (4 + Math.random()).toFixed(1);
    var stars = "";
    var r = parseFloat(rating);
    for (var i = 0; i < 5; i++) { stars += i < Math.floor(r) ? "★" : "☆"; }

    return '<div class="tb-product-card" onclick="showToast(' + "'" + p.name + ' - ¥' + p.price + "'" + ',info)">' +
      '<div class="tb-prod-img">' +
      (p.certification ? '<span class="tb-prod-tag">' + p.certification + '</span>' : '') +
      imgEmoji + '</div>' +
      '<div class="tb-prod-body">' +
      '<div class="tb-prod-name">' + p.name + '</div>' +
      '<div class="tb-prod-shop"><i class="fas fa-store"></i> ' + (p.shop_name || "官方直营") + '</div>' +
      '<div class="tb-prod-meta">' +
      '<div class="tb-prod-price"><span class="tb-prod-price-symbol">¥</span>' + (p.price || 0).toFixed(1) + '</div>' +
      '<div class="tb-prod-sales">已售 ' + sales + '</div></div>' +
      '<div class="tb-prod-rating">' + stars + ' ' + rating + '</div>' +
      '<button class="btn btn-sm" style="width:100%;margin-top:6px;justify-content:center;" onclick="event.stopPropagation();App.addToCart({id:' + "'" + (p.id || "") + "'" + ',name:' + "'" + (p.name || "") + "'" + ',price:' + (p.price || 0) + ',image:' + "'" + imgEmoji + "'" + ',shop_name:' + "'" + (p.shop_name || "") + "'" + '})"><i class="fas fa-cart-plus"></i> 加入购物车</button></div></div>';
  }
};
