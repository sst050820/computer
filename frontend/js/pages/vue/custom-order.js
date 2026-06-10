/* VueCustomOrder — Consumer: ABE Condition-based Custom Order */
var VueCustomOrder = {
  name: 'VueCustomOrder',
  template: '<div style="max-width:800px;margin:0 auto;">' +
    '<div class="card">' +
    '<div class="card-header"><i class="fas fa-magic card-icon" style="background:var(--co-primary-50);color:var(--co-primary-500);"></i><span class="card-title">发布私人定制需求</span></div>' +
    '<div style="display:grid;gap:14px;">' +
    '<div class="form-group"><label class="form-label">需求标题 *</label><input class="form-input" v-model="title" placeholder="例如：牛奶味茶饼定制" /></div>' +
    '<div class="form-group"><label class="form-label">详细描述</label><textarea class="form-textarea" v-model="description" rows="3" placeholder="描述想要的农产品规格、口味、数量等"></textarea></div>' +
    '<div class="form-group"><label class="form-label">期望预算</label><input class="form-input" v-model="budget" placeholder="例如：5000-10000元" /></div>' +
    '<div class="form-group"><label class="form-label">设定可见条件（满足条件的厂家才能看到您的需求）</label>' +
    '<div class="cond-selector">' +
    '<div v-for="ct in conditionTypes" :key="ct.key" class="cond-row">' +
    '<label>{{ ct.label }}</label>' +
    '<select class="form-select" v-model="conditions[ct.key]">' +
    '<option v-for="o in ct.options" :key="o" :value="o">{{ o || "不限" }}</option></select></div></div></div>' +
    '' +
    '<button class="custom-order-submit-btn" @click="submit" :disabled="submitting" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:16px 32px;background:linear-gradient(135deg,#2D6A4F,#1A4330);color:#fff;border:none;border-radius:var(--rd-md);font-size:1.1rem;font-weight:700;cursor:pointer;box-shadow:0 6px 24px rgba(45,106,79,0.35);transition:all 0.25s ease;font-family:inherit;letter-spacing:0.05em;"><i v-if="submitting" class="fas fa-spinner fa-spin"></i><i v-else class="fas fa-paper-plane"></i><span v-if="submitting">发布中...</span><span v-else>发布需求</span></button>' +
    '</div>' +
    '<div v-if="result" style="margin-top:16px;text-align:center;padding:24px;border:2px solid var(--co-success);border-radius:var(--rd-lg);">' +
    '<i class="fas fa-check-circle" style="font-size:2.5rem;color:var(--co-success);display:block;margin-bottom:8px;"></i>' +
    '<h3>发布成功！</h3><p>需求编号：{{ result.id }}</p>' +
    '<p style="color:var(--co-neutral-500);font-size:0.85rem;">满足条件的厂家将能看到完整需求内容</p></div>' +
    '<div v-if="errorMsg" style="margin-top:12px;color:var(--co-error);">{{ errorMsg }}</div>' +
    '</div></div>',
  data: function() {
    return {
      title: '', description: '', budget: '',
      conditions: { Location: '', Capability: '', Quality: '', Grade: '', Organic: '' },
      submitting: false, result: null, errorMsg: '',
      conditionTypes: [
        { key: 'Location', label: '产地要求', options: ['', '福建', '山东', '浙江', '云南', '安徽', '四川', '广东'] },
        { key: 'Capability', label: '加工能力', options: ['', '制茶', '果蔬加工', '糕点制作', '酿造', '干货加工', '冷冻加工'] },
        { key: 'Quality', label: '品质认证', options: ['', '有机', '绿色', '地理标志', '无公害'] },
        { key: 'Grade', label: '等级要求', options: ['', '1', '2', '3', '4', '5'] },
        { key: 'Organic', label: '有机认证', options: ['', '是', '否'] },
      ]
    };
  },
  methods: {
    submit: function() {
      var self = this;
      if (!this.title.trim()) { this.errorMsg = '请填写需求标题'; return; }
      this.submitting = true; this.errorMsg = '';
      var user = window.App && window.App.currentUser;
      var conds = {};
      for (var k in this.conditions) { if (this.conditions[k]) conds[k] = this.conditions[k]; }
      API.createCustomOrder({
        title: this.title.trim(), description: this.description.trim() || this.title.trim(),
        budget: this.budget.trim(), conditions: conds, consumer_id: user ? user.id : ''
      }).then(function(res) {
        self.submitting = false;
        if (res.status === 'success') { self.result = res.data || { id: 'N/A' }; }
        else { self.errorMsg = res.error || '发布失败'; }
      }).catch(function() {
        self.submitting = false; self.errorMsg = '网络错误，请重试';
      });
    }
  }
};
