/* BaseInput — form input wrapper with label and error */
const BaseInput = {
  name: 'BaseInput',
  props: {
    modelValue: { type: String, default: '' },
    type: { type: String, default: 'text' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    error: { type: String, default: '' },
    hint: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    rows: { type: Number, default: 3 },
    options: { type: Array, default: null },
  },
  emits: ['update:modelValue'],
  computed: {
    inputAttrs: function() {
      return {
        value: this.modelValue,
        placeholder: this.placeholder,
        disabled: this.disabled,
        required: this.required,
      };
    }
  },
  methods: {
    onInput: function(e) {
      this.$emit('update:modelValue', e.target.value);
    }
  },
  template: '<div class="form-group">' +
    '<label v-if="label" class="form-label">{{ label }}<span v-if="required" style="color:var(--co-error);"> *</span></label>' +
    '<select v-if="options" class="form-select" :value="modelValue" :disabled="disabled" @change="onInput">' +
    '<option v-for="opt in options" :key="opt.value || opt" :value="opt.value || opt">{{ opt.label || opt }}</option>' +
    '</select>' +
    '<textarea v-else-if="type === \'textarea\'" class="form-textarea" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :rows="rows" @input="onInput"></textarea>' +
    '<input v-else class="form-input" :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled" @input="onInput" />' +
    '<div v-if="error" class="form-error">{{ error }}</div>' +
    '<div v-if="hint && !error" class="form-hint">{{ hint }}</div>' +
    '</div>'
};
