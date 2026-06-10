/* BaseBadge — colored pill badge */
const BaseBadge = {
  name: 'BaseBadge',
  props: {
    color: { type: String, default: 'green' },
    dot: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
  },
  computed: {
    classes: function() {
      var cls = ['badge'];
      if (this.dot) cls.push('badge-dot-only');
      if (this.outline) cls.push('badge-outline');
      cls.push('badge-' + this.color);
      return cls;
    }
  },
  template: '<span :class="classes"><slot /></span>'
};
