var VueUserManagement = {
  name: 'VueUserManagement',
  template: '<div>' +
    '<div class="card"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">' +
    '<span style="display:flex;align-items:center;gap:8px;"><i class="fas fa-users card-icon" style="background:#f3e8ff;color:#6b21a8;"></i><span class="card-title">用户管理（{{ users.length }} 人）</span></span>' +
    '<input class="form-input" v-model="search" placeholder="搜索用户..." style="max-width:220px;" />' +
    '</div>' +
    '<base-loading v-if="loading" />' +
    '<div v-else>' +
    '<table class="data-table"><thead><tr><th>ID</th><th>姓名</th><th>用户名</th><th>角色</th><th>所在地</th><th>操作</th></tr></thead><tbody>' +
    '<tr v-for="u in filtered" :key="u.id" >' +
    '<td style="font-size:0.75rem;color:var(--co-neutral-500);">{{ u.id }}</td>' +
    '<td><strong>{{ u.name }}</strong></td><td>{{ u.username }}</td>' +
    '<td><base-badge :color="roleColor(u.role)">{{ roleNames[u.role]||u.role }}</base-badge></td>' +
    '<td>{{ u.location||"--" }}</td>' +
    '<td >' +
    '<button class="btn btn-sm" style="background:var(--co-primary-50);color:var(--co-primary-600);font-weight:600;margin-right:4px;border:none;cursor:pointer;" @click="viewUser(u)"><i class="fas fa-eye"></i></button>' +
    '<button class="btn btn-sm" :style="(u.status===\'disabled\'?{background:\'var(--co-success)\',color:\'#fff\'}:{background:\'#fff\',color:\'var(--co-error)\',border:\'2px solid var(--co-error)\'})" @click="toggleUser(u)" style="font-weight:600;cursor:pointer;">' +
    '{{ u.status==="disabled"?"启用":"禁用" }}</button>' +
    '<button v-if="u.role===\'consumer\'||u.role===\'merchant\'" class="btn btn-sm" style="background:#fff;color:var(--co-error);border:2px solid var(--co-error);font-weight:600;margin-left:4px;cursor:pointer;" @click="delUser(u)"><i class="fas fa-trash"></i></button></td>' +
    '</tr></tbody></table></div></div>' +
    /* Detail modal */
    '<div v-if="detail" class="modal-overlay" @click.self="detail=null">' +
    '<div class="modal-content" style="max-width:480px;">' +
    '<div class="modal-header"><h3 class="modal-title">用户详情</h3><button class="modal-close" @click="detail=null"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    '<div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">' +
    '<div style="width:56px;height:56px;border-radius:50%;background:var(--co-primary-50);display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--co-primary-500);font-weight:700;">{{ (detail.name||"U")[0] }}</div>' +
    '<div><h3>{{ detail.name }}</h3><base-badge :color="roleColor(detail.role)">{{ roleNames[detail.role]||detail.role }}</base-badge></div></div>' +
    '<div style="display:grid;gap:8px;">' +
    '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--co-neutral-100);"><span style="color:var(--co-neutral-500);">用户ID</span><strong>{{ detail.id }}</strong></div>' +
    '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--co-neutral-100);"><span style="color:var(--co-neutral-500);">用户名</span><strong>{{ detail.username }}</strong></div>' +
    '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--co-neutral-100);"><span style="color:var(--co-neutral-500);">角色</span><strong>{{ roleNames[detail.role]||detail.role }}</strong></div>' +
    '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--co-neutral-100);"><span style="color:var(--co-neutral-500);">所在地</span><strong>{{ detail.location||"-" }}</strong></div>' +
    '<div style="display:flex;justify-content:space-between;padding:8px 0;"><span style="color:var(--co-neutral-500);">手机号</span><strong>{{ detail.phone||"-" }}</strong></div></div>' +
    '<div style="margin-top:16px;display:flex;gap:8px;">' +
    '<button class="btn" :style="(detail.status===\'disabled\'?{background:\'var(--co-success)\',color:\'#fff\'}:{background:\'#fff\',color:\'var(--co-error)\',border:\'2px solid var(--co-error)\'})" @click="toggleUser(detail); detail=null" style="flex:1;justify-content:center;font-weight:600;">{{ detail.status==="disabled"?"启用该用户":"禁用该用户" }}</button>' +
    '<button class="btn" style="flex:1;justify-content:center;background:var(--co-neutral-100);color:var(--co-neutral-600);border:none;" @click="detail=null">关闭</button></div>' +
    '</div></div></div></div>',
  data: function() { return { users:[], loading:true, search:'', detail:null, roleNames:{consumer:'消费者',merchant:'商家',certifier:'审核方',admin:'管理员',regulator:'监管方'} }; },
  computed: { filtered:function(){var s=this.search.toLowerCase();return this.users.filter(function(u){return !s||u.name.toLowerCase().indexOf(s)>=0||u.username.toLowerCase().indexOf(s)>=0;});} },
  mounted:function(){var self=this;API.getAllUsers().then(function(r){self.users=(r.data||[]).map(function(u){u.status=u.status||'active';return u;});self.loading=false;}).catch(function(){self.loading=false;});},
  methods:{
    roleColor:function(r){var m={consumer:'green',merchant:'blue',certifier:'amber',admin:'purple',regulator:'red'};return m[r]||'neutral';},
    viewUser:function(u){this.detail=u;},
    toggleUser:function(u){u.status=u.status==='disabled'?'active':'disabled';window.showToast&&window.showToast((u.status==='disabled'?'已禁用':'已启用')+': '+u.name,(u.status==='disabled'?'info':'success'));},
    delUser:function(u){
      if(!confirm('确定删除账号「'+u.name+'」（'+u.username+'）吗？此操作不可恢复！')) return;
      var self=this;
      API._fetch('/api/admin/users/'+u.id,{method:'DELETE'}).then(function(r){
        if(r&&r.status==='success'){self.users=self.users.filter(function(x){return x.id!==u.id;});window.showToast&&window.showToast('已删除: '+u.name,'success');}
        else{window.showToast&&window.showToast('删除失败：只能删除消费者和商家账号','error');}
      }).catch(function(){window.showToast&&window.showToast('删除失败','error');});
    }
  }
};
