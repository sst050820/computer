/* BaseCard — container card with optional hover effect */
const BaseCard = {
  name: 'BaseCard',
  props: {
    hover: { type: Boolean, default: false },
    padding: { type: String, default: 'md' },
    flat: { type: Boolean, default: false },
  },
  template: '<div class="card" :class="{ \'card-hover\': hover, \'card-flat\': flat }" :style="{ padding: padMap[padding] || \'var(--sp-6)\' }"><slot /></div>',
  setup: function() {
    var padMap = {
      sm: 'var(--sp-3)',
      md: 'var(--sp-6)',
      lg: 'var(--sp-8)',
      xl: 'var(--sp-10)',
    };
    return { padMap: padMap };
  }
};
