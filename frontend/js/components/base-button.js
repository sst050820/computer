/* BaseButton — polymorphic button with variants */
const BaseButton = {
  name: 'BaseButton',
  props: {
    variant: { type: String, default: 'primary' },
    size: { type: String, default: 'md' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
  },
  emits: ['click'],
  computed: {
    classes: function() {
      var cls = ['btn'];
      cls.push('btn-' + this.variant);
      if (this.size === 'sm') cls.push('btn-sm');
      if (this.size === 'lg') cls.push('btn-lg');
      if (this.block) cls.push('btn-block');
      if (this.disabled || this.loading) cls.push('btn-disabled');
      return cls;
    }
  },
  template: '<button :class="classes" :disabled="disabled || loading" @click="$emit(\'click\', $event)">' +
    '<i v-if="loading" class="fas fa-spinner fa-spin" style="margin-right:4px;"></i>' +
    '<slot />' +
    '</button>'
};
