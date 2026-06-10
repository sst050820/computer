/* BaseToast — global toast notification manager */
var toastId = 0;

function useToast() {
  var toasts = Vue.ref([]);

  function show(message, type) {
    type = type || 'info';
    var id = ++toastId;
    toasts.value.push({ id: id, message: message, type: type });
    setTimeout(function() {
      toasts.value = toasts.value.filter(function(t) { return t.id !== id; });
    }, 3000);
  }

  function success(msg) { show(msg, 'success'); }
  function error(msg) { show(msg, 'error'); }
  function warning(msg) { show(msg, 'warning'); }
  function info(msg) { show(msg, 'info'); }

  return { toasts: toasts, show: show, success: success, error: error, warning: warning, info: info };
}

const BaseToastContainer = {
  name: 'BaseToastContainer',
  props: {
    toasts: { type: Array, default: function() { return []; } }
  },
  template: '<div class="toast-container">' +
    '<TransitionGroup name="toast-slide">' +
    '<div v-for="t in toasts" :key="t.id" class="toast-item" :class="\'toast-\' + t.type">' +
    '<i v-if="t.type === \'success\'" class="fas fa-check-circle" style="color:var(--co-success);"></i>' +
    '<i v-else-if="t.type === \'error\'" class="fas fa-times-circle" style="color:var(--co-error);"></i>' +
    '<i v-else-if="t.type === \'warning\'" class="fas fa-exclamation-triangle" style="color:var(--co-warning);"></i>' +
    '<i v-else class="fas fa-info-circle" style="color:var(--co-info);"></i>' +
    '{{ t.message }}' +
    '</div>' +
    '</TransitionGroup>' +
    '</div>'
};
