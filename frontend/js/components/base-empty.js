/* BaseEmpty — empty state placeholder */
const BaseEmpty = {
  name: 'BaseEmpty',
  props: {
    icon: { type: String, default: 'fa-inbox' },
    title: { type: String, default: '暂无数据' },
    description: { type: String, default: '' },
  },
  template: '<div class="empty-state">' +
    '<div class="empty-icon"><i class="fas" :class="icon"></i></div>' +
    '<h4>{{ title }}</h4>' +
    '<p v-if="description">{{ description }}</p>' +
    '<slot />' +
    '</div>'
};
