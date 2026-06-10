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
      return [
        { id:1, from:'福建名品茶厂', text:'收到了您的定制需求「牛奶味茶饼定制」，我们可以满足您的需求。我们有20年制茶经验，可提供有机认证的茶叶原料，加工能力达到Grade 3标准。请确认是否进一步沟通合作细节？', time:'2026-06-10 10:30', unread:true, color:'#2D6A4F', icon:'fa-store', type:'merchant' },
        { id:2, from:'系统通知', text:'您的定制需求「牛奶味茶饼」已被3家厂家查看，其中2家满足可见条件。系统将自动匹配符合条件的厂家。', time:'2026-06-10 09:15', unread:true, color:'#4A90B8', icon:'fa-bell', type:'system' },
        { id:3, from:'浙江龙井茶园', text:'关于茉莉花茶定制需求，我们报价6000元/批。我们位于浙江杭州，拥有有机认证和地理标志认证，等级评定Grade 5。可提供样品先测试。', time:'2026-06-09 16:45', unread:false, color:'#00B578', icon:'fa-leaf', type:'merchant', reply:'已与浙江龙井茶园达成初步合作意向，样品将于下周寄出。' },
        { id:4, from:'系统通知', text:'您的订单 #ORD001 已确认，福建名品茶厂已接单，预计3个工作日内发货。您可以在"我的需求"页面查看订单进度。', time:'2026-06-09 14:20', unread:false, color:'#4A90B8', icon:'fa-bell', type:'system' },
        { id:5, from:'系统通知', text:'欢迎加入农淘平台！您已成功注册为消费者。您可以浏览商品、发布定制需求、下单购买。如有疑问，请联系平台客服。', time:'2026-06-08 08:00', unread:false, color:'#4A90B8', icon:'fa-bell', type:'system' },
        { id:6, from:'山东丰收食品厂', text:'我们看到了您的定制需求。山东丰收食品厂可提供果蔬加工服务，拥有有机认证和无公害认证。我们使用先进的冷链技术，可保证产品新鲜度。报价范围8000-12000元。', time:'2026-06-07 11:20', unread:true, color:'#E8A838', icon:'fa-store', type:'merchant' },
        { id:7, from:'有机食品认证协会', text:'通知：您申请的资质已审核通过。您的有机认证资质现已生效，有效期至2027年6月。', time:'2026-06-05 15:00', unread:false, color:'#8B5CF6', icon:'fa-certificate', type:'system' },
        { id:8, from:'平台管理员', text:'平台的认证规则已于2026年6月1日更新至v2.0版本。所有已颁发的通行证将在30天内自动更新。如有疑问请联系管理员。', time:'2026-06-01 10:00', unread:false, color:'#6b21a8', icon:'fa-shield', type:'system' },
      ];
    },
    loadMsgs: function() {
      try {
        var saved = localStorage.getItem('fruit_msgs');
        if (saved) { this.msgs = JSON.parse(saved); return; }
      } catch(e) {}
      this.msgs = this.defaultMsgs();
    },
    saveMsgs: function() {
      try { localStorage.setItem('fruit_msgs', JSON.stringify(this.msgs)); } catch(e) {}
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
