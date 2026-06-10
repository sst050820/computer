/* VueUserManagement — Admin: User Management */
const VueUserManagement = {
  name: 'VueUserManagement',
  template: '<div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-users card-icon" style="background:#f3e8ff;color:#6b21a8;"></i><span class="card-title">用户管理</span></div>' +
    '<base-loading v-if="loading" />' +
    '<div v-else>' +
    '<table class="data-table">' +
    '<thead><tr><th>ID</th><th>姓名</th><th>角色</th><th>所在地</th><th>操作</th></tr></thead>' +
    '<tbody><tr v-for="u in users" :key="u.id">' +
    '<td>{{ u.id }}</td><td>{{ u.name }}</td>' +
    '<td><base-badge :color="roleColor(u.role)">{{ roleNames[u.role] || u.role }}</base-badge></td>' +
    '<td>{{ u.location || "--" }}</td>' +
    '<td><base-button size="sm" variant="ghost">查看</base-button> ' +
    '<base-button size="sm" variant="danger-ghost">禁用</base-button></td>' +
    '</tr></tbody></table></div>' +
    '</div></div>',
  data: function() {
    return {
      users: [], loading: true,
      roleNames: { consumer:'消费者', merchant:'商家', certifier:'审核方', admin:'管理员', regulator:'监管方' }
    };
  },
  mounted: function() {
    var self = this;
    API.getAllUsers().then(function(res) {
      self.users = res.data || [];
      self.loading = false;
    }).catch(function() { self.loading = false; });
  },
  methods: {
    roleColor: function(role) {
      var map = { consumer:'green', merchant:'blue', certifier:'amber', admin:'purple', regulator:'red' };
      return map[role] || 'neutral';
    }
  }
};
