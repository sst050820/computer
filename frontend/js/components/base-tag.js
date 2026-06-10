/* BaseTag — closable tag chip */
const BaseTag = {
  name: 'BaseTag',
  props: {
    active: { type: Boolean, default: false },
    closable: { type: Boolean, default: false },
    color: { type: String, default: '' },
  },
  emits: ['close'],
  template: '<span class="tag" :class="{ \'tag-active\': active }" :style="color ? { borderColor: color, color: color } : {}">' +
    '<slot />' +
    '<button v-if="closable" class="tag-close" @click.stop="$emit(\'close\')">&times;</button>' +
    '</span>'
};
