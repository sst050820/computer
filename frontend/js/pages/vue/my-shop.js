var VueMyShop = {
  name: 'VueMyShop',
  template: '<div>' +
    '<div class="card" style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">' +
    '<div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--co-primary-50),var(--co-primary-500));display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--co-primary-500);"><i class="fas fa-store"></i></div>' +
    '<div><h3 style="font-size:1.05rem;">{{ user?.name }}</h3><p style="font-size:0.75rem;color:var(--co-neutral-500);">店铺主人 · {{ user?.location || "未设置" }}</p></div></div>' +
    '<div class="card"><div class="card-header"><i class="fas fa-cog card-icon" style="background:var(--co-neutral-100);color:var(--co-neutral-600);"></i><span class="card-title">店铺设置</span></div>' +
    '<div style="display:grid;gap:12px;max-width:500px;">' +
    '<div class="form-group"><label class="form-label">店铺名称</label><input class="form-input" v-model="form.name" /></div>' +
    '<div class="form-group"><label class="form-label">店铺简介</label><textarea class="form-textarea" v-model="form.desc" rows="2" placeholder="介绍您的店铺和产品"></textarea></div>' +
    '<div class="form-group"><label class="form-label">所在地</label><input class="form-input" v-model="form.location" placeholder="省/市" /></div>' +
    '<div class="form-group"><label class="form-label">联系方式</label><input class="form-input" v-model="form.phone" placeholder="手机号" /></div>' +
    '<base-button @click="doSave" :loading="saving"><i class="fas fa-save"></i> 保存设置</base-button>' +
    '<div v-if="saved" style="color:var(--co-success);margin-top:4px;">✅ {{ saved }}</div>' +
    '</div></div></div>',
  data: function() { return { form: { name:'', desc:'', location:'', phone:'' }, saving: false, saved: '' }; },
  computed: { user: function() { return window.App && window.App.currentUser; } },
  mounted: function() {
    var u = this.user;
    if (u) {
      this.form.name = u.name || '';
      this.form.location = u.location || '';
      this.form.phone = u.phone || '';
    }
  },
  methods: {
    doSave: function() {
      var self = this; this.saving = true; this.saved = '';
      var user = this.user;
      API._fetch('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: this.form.name, location: this.form.location, phone: this.form.phone, desc: this.form.desc, user_id: user ? user.id : '' })
      }).then(function(res) {
        self.saving = false;
        if (res && res.status === 'success') {
          self.saved = '店铺信息已保存';
          if (user) { user.name = self.form.name; user.location = self.form.location; user.phone = self.form.phone; }
        }
      }).catch(function() { self.saving = false; });
    }
  }
};
