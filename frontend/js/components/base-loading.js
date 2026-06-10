/* BaseLoading — loading spinner / skeleton */
const BaseLoading = {
  name: 'BaseLoading',
  props: {
    text: { type: String, default: '加载中...' },
    skeleton: { type: Boolean, default: false },
    lines: { type: Number, default: 3 },
  },
  template: '<div class="loading-wrap">' +
    '<template v-if="!skeleton">' +
    '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>' +
    '<p class="loading-text">{{ text }}</p>' +
    '</template>' +
    '<template v-else>' +
    '<div v-for="i in lines" :key="i" class="skeleton-line" :style="{ width: (100 - i * 15) + \'%\' }"></div>' +
    '</template>' +
    '</div>'
};
