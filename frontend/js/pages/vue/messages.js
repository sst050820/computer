/* VueMessages — Message Center with tabs, expand, delete */
var VueMessages = {
  name: 'VueMessages',
  template: '<div>' +
    '<div class="card" style="padding:0;overflow:hidden;">' +
    /* Header */
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:var(--sp-5) var(--sp-6);border-bottom:1px solid var(--co-neutral-100);">' +
    '<div style="display:flex;align-items:center;gap:var(--sp-3);">' +
    '<i class="fas fa-envelope" style="font-size:1.2rem;color:var(--co-info);"></i>' +
    '<span style="font-weight:600;font-size:1.05rem;">消息中心</span>' +
    '<span v-if="unreadCount>0" style="background:var(--co-error);color:#fff;border-radius:var(--rd-full);padding:2px 9px;font-size:0.7rem;font-weight:700;">{{ unreadCount }}</span>' +
    '</div>' +
    '<button class="btn btn-ghost btn-sm" @click="markAll" v-if="unreadCount>0"><i class="fas fa-check-double"></i> 全部已读</button>' +
    '</div>' +
    /* Tabs */
    '<div style="display:flex;border-bottom:1px solid var(--co-neutral-100);">' +
    '<button v-for="t in tabs" :key="t.key" @click="tab=t.key" style="flex:1;padding:12px;border:none;background:none;cursor:pointer;font-size:0.85rem;font-weight:500;color:var(--co-neutral-600);border-bottom:2px solid transparent;transition:all 0.15s;font-family:inherit;" :style="tab===t.key?{color:\'var(--co-primary-500)\',borderBottomColor:\'var(--co-primary-500)\',fontWeight:\'600\'}:{}">{{ t.label }}<span v-if="t.key===\'unread\'&&unreadCount>0" style="margin-left:4px;color:var(--co-error);">({{ unreadCount }})</span></button>' +
    '</div>' +
    /* Message list */
    '<div style="max-height:60vh;overflow-y:auto;">' +
    '<div v-if="filtered.length===0" style="text-align:center;padding:40px;color:var(--co-neutral-500);"><i class="fas fa-inbox" style="font-size:2.5rem;opacity:0.15;display:block;margin-bottom:12px;"></i>暂无消息</div>' +
    '<div v-for="m in filtered" :key="m.id" style="padding:14px 20px;border-bottom:1px solid var(--co-neutral-100);cursor:pointer;transition:background 0.15s;display:flex;gap:12px;align-items:flex-start;" :style="{background:m.unread?\'var(--co-primary-50)\':\'#fff\'}" @click="openMsg(m)">' +
    '<div style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1rem;" :style="{background:m.color+\'22\',color:m.color}"><i :class="\'fas \'+m.icon"></i></div>' +
    '<div style="flex:1;min-width:0;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;">' +
    '<strong style="font-size:0.9rem;" :style="{color:m.unread?\'var(--co-neutral-800)\':\'var(--co-neutral-600)\'}">{{ m.from }}</strong>' +
    '<span style="font-size:0.7rem;color:var(--co-neutral-400);white-space:nowrap;margin-left:8px;">{{ m.time }}</span>' +
    '</div>' +
    '<p style="font-size:0.8rem;color:var(--co-neutral-500);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ m.text }}</p>' +
    '</div>' +
    '<button class="btn btn-ghost btn-sm" style="min-width:auto;padding:4px 6px;flex-shrink:0;opacity:0.4;" @click.stop="delMsg(m.id)" title="删除"><i class="fas fa-times"></i></button>' +
    '</div></div></div>' +
    /* Detail modal */
    '<div v-if="detail" class="modal-overlay" @click.self="detail=null">' +
    '<div class="modal-content" style="max-width:500px;">' +
    '<div class="modal-header"><h3 class="modal-title">消息详情</h3><button class="modal-close" @click="detail=null"><i class="fas fa-times"></i></button></div>' +
    '<div class="modal-body">' +
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">' +
    '<div style="width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.3rem;" :style="{background:detail.color+\'22\',color:detail.color}"><i :class="\'fas \'+detail.icon"></i></div>' +
    '<div><strong>{{ detail.from }}</strong><p style="font-size:0.75rem;color:var(--co-neutral-500);">{{ detail.time }}</p></div>' +
    '</div>' +
    '<div style="background:var(--co-neutral-50);border-radius:var(--rd-md);padding:16px;font-size:0.9rem;line-height:1.7;white-space:pre-wrap;">{{ detail.text }}</div>' +
    '<div v-if="detail.reply" style="margin-top:12px;padding:12px;background:#e8f5ee;border-radius:var(--rd-md);border-left:3px solid var(--co-primary-400);"><strong style="font-size:0.8rem;">回复：</strong><p style="font-size:0.85rem;margin-top:4px;">{{ detail.reply }}</p></div>' +
    '<div style="margin-top:16px;display:flex;gap:8px;">' +
    '<base-button variant="outline" @click="detail=null"><i class="fas fa-arrow-left"></i> 返回</base-button>' +
    '<base-button variant="danger-ghost" size="sm" @click="delMsg(detail.id); detail=null"><i class="fas fa-trash"></i> 删除</base-button>' +
    '</div></div></div></div>' +
    '</div>',
  data: function() {
    return {
      tab: 'all',
      detail: null,
      tabs: [{ key:'all',label:'全部' },{ key:'unread',label:'未读' },{ key:'system',label:'系统通知' }],
      msgs: []
    };
  },
  mounted: function() { this.loadMsgs(); },
  watch: {
    msgs: { deep: true, handler: function(v) { this.saveMsgs(); } }
  },
  computed: {
    unreadCount: function() {
      var c = 0; this.msgs.forEach(function(m) { if (m.unread) c++; }); return c;
    },
    filtered: function() {
      var self = this;
      return this.msgs.filter(function(m) {
        if (self.tab === 'unread') return m.unread;
        if (self.tab === 'system') return m.type === 'system';
        return true;
      });
    }
  },
  methods: {
    defaultMsgs: function() {
      var now = new Date().toLocaleString('zh-CN');
      var userName = (window.App&&window.App.currentUser) ? window.App.currentUser.name : '用户';
      return [
        { id:1, from:'系统通知', text:'欢迎「'+userName+'」加入农禾坊平台！您现在可以浏览28种特色农产品、发布私人定制需求、下单购买。祝您购物愉快！', time:now, unread:true, color:'#4A90B8', icon:'fa-bell', type:'system' },
        { id:2, from:'系统通知', text:'农禾坊平台提示：发布定制需求时，您可以设定产地、加工能力等条件，只有满足条件的厂家才能看到您的需求详情，保护您的隐私。', time:now, unread:true, color:'#4A90B8', icon:'fa-bell', type:'system' },
      ];
    },
    loadMsgs: function() {
      try {
        var uid = (window.App&&window.App.currentUser) ? window.App.currentUser.id : 'guest'; var saved = localStorage.getItem('fruit_msgs_'+uid);
        if (saved) { this.msgs = JSON.parse(saved); return; }
      } catch(e) {}
      this.msgs = this.defaultMsgs();
    },
    saveMsgs: function() {
      var uid = (window.App&&window.App.currentUser) ? window.App.currentUser.id : 'guest'; try { localStorage.setItem('fruit_msgs_'+uid, JSON.stringify(this.msgs)); } catch(e) {}
    },
    openMsg: function(m) {
      m.unread = false;
      this.detail = m;
    },
    markAll: function() {
      this.msgs.forEach(function(m) { m.unread = false; });
      window.showToast && window.showToast('全部已读', 'success');
    },
    delMsg: function(id) {
      this.msgs = this.msgs.filter(function(m) { return m.id !== id; });
      window.showToast && window.showToast('已删除', 'info');
    }
  }
};
