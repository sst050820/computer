/* BaseModal — teleported overlay modal with transition */
const BaseModal = {
  name: 'BaseModal',
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: '' },
    width: { type: String, default: '520px' },
    closable: { type: Boolean, default: true },
  },
  emits: ['close'],
  methods: {
    onOverlayClick: function(e) {
      if (e.target === this.$refs.overlay && this.closable) {
        this.$emit('close');
      }
    },
    onEsc: function(e) {
      if (e.key === 'Escape' && this.closable) {
        this.$emit('close');
      }
    }
  },
  mounted: function() {
    document.addEventListener('keydown', this.onEsc);
  },
  beforeUnmount: function() {
    document.removeEventListener('keydown', this.onEsc);
  },
  template: '<Teleport to="body">' +
    '<Transition name="modal-fade">' +
    '<div v-if="show" ref="overlay" class="modal-overlay" @click="onOverlayClick">' +
    '<Transition name="modal-slide">' +
    '<div v-if="show" class="modal-content" :style="{ maxWidth: width }">' +
    '<div class="modal-header" v-if="title || closable">' +
    '<h3 class="modal-title">{{ title }}</h3>' +
    '<button v-if="closable" class="modal-close" @click="$emit(\'close\')"><i class="fas fa-times"></i></button>' +
    '</div>' +
    '<div class="modal-body"><slot /></div>' +
    '<div class="modal-footer" v-if="$slots.footer"><slot name="footer" /></div>' +
    '</div>' +
    '</Transition>' +
    '</div>' +
    '</Transition>' +
    '</Teleport>'
};
