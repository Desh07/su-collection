// ==========================================
// SU COLLECTION x UVA VEC - Vanilla JS Funnel
// ==========================================

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxq4lWD0PxGjoOg1uG6BDETxRbIqYLCfIkA1IV_tqnG7nlusR-1iYx-tbXJdGM8kFE/exec";

// Helper: bilingual label
const bi = (sin, eng) => `<span class="sin">${sin}</span><br><span class="eng">${eng}</span>`;

const QUIZ_QUESTIONS = [
  // ── STEP 1: Registration ─────────────────────────────────────────────────
  {
    id: 'contact', field: '_contact', type: 'contact-block', phase: 'step1',
    stepLabel: 'Registration',
    title: 'Let\'s get you registered for the Free Workshop'
  },

  // ── STEP 2: Diagnostic ───────────────────────────────────────────────────
  {
    id: 'REG-05', field: 'currentSituation', type: 'single-choice', phase: 'step2',
    stepLabel: bi('ඔබව හොඳින් විස්තර කරන්නේ:', 'Which best describes you?'),
    title: bi(
      'ඔබව වඩාත් හොඳින් විස්තර කරන්නේ පහත කුමක්ද?',
      'Which best describes you?'
    ),
    choices: [
      { key: 'A', value: 'learning', label: bi('මම මැහුම් කටයුතු ඉගෙන ගන්නවා', 'I am learning tailoring') },
      { key: 'B', value: 'job', label: bi('මම මැහුම් කටයුතු රැකියාවක් හෝ සේවාවක් විදිහට කරනවා', 'I do tailoring as a job or service') },
      { key: 'C', value: 'tailoring-biz', label: bi('මම මැහුම් කටයුතු හෝ මැහුම් සම්බන්ධ ව්‍යාපාරයක් කරනවා', 'I run a tailoring or clothing-related business') },
      { key: 'D', value: 'other-biz', label: bi('මම වෙනත් කුඩා ව්‍යාපාරයක් කරනවා', 'I run another small business') },
      { key: 'E', value: 'planning', label: bi('මම ව්‍යාපාරයක් පටන් ගන්න සැලසුම් කරනවා', 'I am planning to start a business') },
      { key: 'F', value: 'other', label: bi('වෙනත් / තාම තීරණය කරලා නැහැ', 'Other / not sure yet') },
    ]
  },
  {
    id: 'REG-06', field: 'primaryGoal', type: 'single-choice', phase: 'step2',
    stepLabel: bi('ප්‍රධාන අරමුණ', 'Primary Goal'),
    title: bi(
      'ප්‍රධාන වශයෙන් ඔබ මෙයට සම්බන්ධ වීමට බලාපොරොත්තු වන්නේ කුමක් සඳහාද?',
      'Primary goal for joining?'
    ),
    choices: [
      { key: 'A', value: 'improve-skills', label: bi('මගේ මැහුම් කුසලතා වැඩිදියුණු කරගන්න', 'Improve my tailoring skills') },
      { key: 'B', value: 'advanced-techniques', label: bi('උසස් මට්ටමේ මැහුම් ක්‍රම ඉගෙන ගන්න', 'Learn advanced tailoring techniques') },
      { key: 'C', value: 'start-earning', label: bi('මැහුම් කටයුතු හරහා ආදායමක් උපයන්න පටන් ගන්න', 'Start earning through tailoring') },
      { key: 'D', value: 'grow-tailoring-biz', label: bi('දැනට කරගෙන යන මැහුම් කටයුතු හෝ ව්‍යාපාරය දියුණු කරගන්න', 'Grow my existing tailoring or clothing business') },
      { key: 'E', value: 'grow-business-online', label: bi('ව්‍යාපාරයක් අන්තර්ජාලය (online) හරහා දියුණු කරගන්න හැටි ඉගෙන ගන්න', 'Learn how to grow a business online') },
      { key: 'F', value: 'understand-tools', label: bi('මගේ ව්‍යාපාරයට අවශ්‍ය ඩිජිටල් මෙවලම් සහ පද්ධති මොනවාද කියලා තේරුම් ගන්න', 'Understand what digital tools/systems my business needs') },
    ]
  },

  // ── STEP 3: Technical Branch ─────────────────────────────────────────────
  {
    id: 'TECH-01', field: 'tailoringSkill', type: 'single-choice', phase: 'step3',
    stepLabel: bi('තාක්‍ෂණික ශාඛාව', 'Technical Branch'),
    title: bi('ඔබේ දැනට පවතින මැහුම් කුසලතා මට්ටම කුමක්ද?', 'Current tailoring skill level'),
    showIf: (a) => isTechnicalBranch(a),
    choices: [
      { key: 'A', value: 3, label: bi('ආධුනිකයි / දැන් පටන් ගන්නවා', 'Beginner / just starting') },
      { key: 'B', value: 5, label: bi('මූලික දැනුම තියෙනවා, තව දියුණු කරගන්න ඕනේ', 'Basic knowledge, want to improve') },
      { key: 'C', value: 8, label: bi('නිතරම මගේ හෝ අනිත් අයට මැහුම් කටයුතු කරනවා', 'I regularly tailor for myself or others') },
      { key: 'D', value: 10, label: bi('මම වෘත්තීය මැහුම් ශිල්පියෙකු/ශිල්පිනියක් විදිහට වැඩ කරනවා', 'I work professionally as a tailor') },
      { key: 'E', value: 9, label: bi('හොඳ පළපුරුද්දක් තියෙනවා, විශේෂිත මඟපෙන්වීමක් අවශ්‍යයි', 'Highly experienced, want specialised guidance') },
    ]
  },
  {
    id: 'INT-01', field: 'technicalInterest', type: 'single-choice', phase: 'step3',
    stepLabel: bi('තාක්‍ෂණික ශාඛාව', 'Technical Branch'),
    title: bi(
      'ඔබේ මැහුම් කටයුතු තවදුරටත් දියුණු කරගන්න නිසි මඟපෙන්වීමක් අවශ්‍යද?',
      'Interested in structured guidance to improve your tailoring?'
    ),
    showIf: (a) => isTechnicalBranch(a),
    choices: [
      { key: 'A', value: 0, label: bi('දැනට කැමති නැහැ', 'Not currently') },
      { key: 'B', value: 3, label: bi('සමහරවිට, තවදුරටත් දැනගන්න කැමතියි', 'Maybe, I\'d like to know more') },
      { key: 'C', value: 7, label: bi('ඔව්, උනන්දුවෙන් ඉන්නවා', 'Yes, I am interested') },
      { key: 'D', value: 10, label: bi('ඔව්, දැනටමත් සොයමින් ඉන්නවා', 'Yes, I am actively looking for this') },
    ]
  },
  {
    id: 'TECH-03', field: 'tailoringYears', type: 'short-text', phase: 'step3',
    stepLabel: bi('තාක්‍ෂණික ශාඛාව', 'Technical Branch'),
    title: bi('මැහුම් පළපුරුද්ද (වසර)', 'Years of tailoring experience'),
    placeholder: 'උදා: 3 අවුරුදු / e.g. 3 years',
    optional: true,
    showIf: (a) => isTechnicalBranch(a),
  },

  // ── STEP 3: Business Branch ───────────────────────────────────────────────
  {
    id: 'BUS-01', field: 'businessOwnership', type: 'single-choice', phase: 'step3',
    stepLabel: bi('ව්‍යාපාර ශාඛාව', 'Business Branch'),
    title: bi(
      'ඔබ දැනට ව්‍යාපාරයක් කරනවාද, නැත්නම් යම් භාණ්ඩයක් හෝ සේවාවක් (product/service) හරහා ආදායමක්(income) උපයනවාද?',
      'Do you currently operate a business or earn income through a product/service?'
    ),
    showIf: (a) => isBusinessBranch(a),
    choices: [
      { key: 'A', value: 0, label: bi('නැහැ', 'No') },
      { key: 'B', value: 3, label: bi('තාම නැහැ, නමුත් පටන් ගන්න සැලසුම් කරනවා', 'Not yet, but planning to start') },
      { key: 'C', value: 7, label: bi('ඔව්, කුඩා ව්‍යාපාරයක් හෝ අර්ධකාලීනව කරනවා (small / part-time)', 'Yes, small or part-time') },
      { key: 'D', value: 10, label: bi('ඔව්, දැනට සක්‍රීයව ව්‍යාපාරය කරගෙන යනවා', 'Yes, actively operating') },
    ]
  },
  {
    id: 'BUS-02', field: 'businessType', type: 'single-choice', phase: 'step3',
    stepLabel: bi('ව්‍යාපාර ශාඛාව', 'Business Branch'),
    title: bi('ව්‍යාපාර වර්ගය / ක්‍ෂේත්‍රය?', 'Business type / industry?'),
    showIf: (a) => isBusinessBranch(a) && (a.businessOwnership || 0) > 3,
    choices: [
      { key: 'A', value: 'tailoring', label: bi('මැහුම් / ඇඳුම්', 'Tailoring / Apparel') },
      { key: 'B', value: 'retail', label: bi('සිල්ලර වෙළඳාම', 'Retail') },
      { key: 'C', value: 'food', label: bi('ආහාර / බේකරි', 'Food / Bakery') },
      { key: 'D', value: 'beauty', label: bi('රූපලාවණ්‍ය', 'Beauty / Salon') },
      { key: 'E', value: 'services', label: bi('සේවා', 'Services') },
      { key: 'F', value: 'handmade', label: bi('අත්කම්', 'Handmade / Crafts') },
      { key: 'G', value: 'other-biz-t', label: bi('වෙනත්', 'Other') },
    ]
  },
  {
    id: 'BUS-03', field: 'businessName', type: 'short-text', phase: 'step3',
    stepLabel: bi('ව්‍යාපාර ශාඛාව', 'Business Branch'),
    title: bi('ව්‍යාපාරයේ නම', 'Business name'),
    placeholder: 'ව්‍යාපාරයේ නම / Enter your business name',
    optional: true,
    showIf: (a) => isBusinessBranch(a) && (a.businessOwnership || 0) > 3,
  },
  {
    id: 'BUS-04', field: 'businessMaturity', type: 'single-choice', phase: 'step3',
    stepLabel: bi('ව්‍යාපාර ශාඛාව', 'Business Branch'),
    title: bi('ව්‍යාපාරයේ වර්ධන මට්ටම?', 'Business maturity'),
    showIf: (a) => isBusinessBranch(a) && (a.businessOwnership || 0) > 3,
    choices: [
      { key: 'A', value: 1, label: bi('ව්‍යාපාර අදහසක් (business idea) තියෙන මට්ටමේ', 'Idea stage') },
      { key: 'B', value: 4, label: bi('පටන් අරගෙන තියෙනවා, නමුත් තවමත් ස්ථාවර නැහැ', 'Started but inconsistent') },
      { key: 'C', value: 8, label: bi('නිත්‍ය ගනුදෙනුකරුවන් ඉන්නවා, නමුත් වර්ධනය සීමිතයි', 'Regular customers, limited growth') },
      { key: 'D', value: 10, label: bi('ස්ථාවර ව්‍යාපාරයක්, තවදුරටත් දියුණු කරගන්න බලාපොරොත්තු වෙනවා', 'Stable business seeking growth') },
      { key: 'E', value: 10.1, label: bi('වර්ධනය වෙමින් පවතින ව්‍යාපාරයක්, නමුත් operational/digital අභියෝග තියෙනවා', 'Growing business with operational/digital challenges') },
    ]
  },
  {
    id: 'BUS-05', field: 'problems', type: 'multi-select', phase: 'step3',
    stepLabel: bi('ව්‍යාපාර ශාඛාව', 'Business Branch'),
    title: bi(
      'දැනට ඔබ මුහුණ දෙන ප්‍රධාන අභියෝග? (අදාළ සියල්ල තෝරන්න)',
      'Main current challenges (select all that apply)'
    ),
    showIf: (a) => isBusinessBranch(a) && (a.businessOwnership || 0) > 3,
    choices: [
      { key: 'A', value: 'more-customers', label: bi('නව ගනුදෙනුකරුවන් හොයාගන්නේ කොහොමද කියලා දන්නේ නැහැ', 'I don\'t know how to get more customers') },
      { key: 'B', value: 'online-marketing', label: bi('ව්‍යාපාරය online හරහා ප්‍රවර්ධනය කරන්නේ කොහොමද කියලා දන්නේ නැහැ', 'I don\'t know how to market my business online') },
      { key: 'C', value: 'content-creation', label: bi('මොනවා post කරන්නද, content creation කරන්නේ කොහොමද කියලා දන්නේ නැහැ', 'I don\'t know what to post or how to create content') },
      { key: 'D', value: 'online-sales', label: bi('online හරහා විකිණීම් සිදු කරන පැහැදිලි ක්‍රමයක් නැහැ', 'I don\'t have a clear online sales process') },
      { key: 'E', value: 'website-system', label: bi('මට website එකක් හෝ digital system එකක් අවශ්‍යයි', 'I need a website or digital system') },
      { key: 'F', value: 'too-many-ops', label: bi('දිනපතා අතින් කරන්න වෙන වැඩ ගොඩක් තියෙනවා', 'I have too many operational/manual tasks') },
      { key: 'G', value: 'unsure-problem', label: bi('මගේ ලොකුම ගැටලුව මොකක්ද කියලා හරියටම තේරෙන්නේ නැහැ', 'I\'m unsure what my biggest problem is') },
    ]
  },
  {
    id: 'BUS-06', field: 'digitalPresence', type: 'single-choice', phase: 'step3',
    stepLabel: bi('ව්‍යාපාර ශාඛාව', 'Business Branch'),
    title: bi('දැනට ඔබේ ව්‍යාපාරය අන්තර්ජාලයේ (online) පවතින ආකාරය?', 'Current digital presence'),
    showIf: (a) => isBusinessBranch(a) && (a.businessOwnership || 0) > 3,
    choices: [
      { key: 'A', value: 'none', label: bi('අන්තර්ජාලය තුළ කිසිදු පැවැත්මක් නැහැ', 'No online presence') },
      { key: 'B', value: 'personal-fb', label: bi('පුද්ගලික Facebook / Instagram / WhatsApp පමණයි', 'Personal Facebook / Instagram / WhatsApp only') },
      { key: 'C', value: 'biz-fb', label: bi('ව්‍යාපාරික Facebook / Instagram page තියෙනවා', 'Business Facebook / Instagram page') },
      { key: 'D', value: 'biz-plus-wa', label: bi('ව්‍යාපාරික Facebook / Instagram Page සහ Business WhatsApp තියෙනවා', 'Business Facebook / Instagram page + Business WhatsApp') },
      { key: 'E', value: 'multi-social', label: bi('සමාජ මාධ්‍ය (Social Channels) කිහිපයක් භාවිතා කරනවා', 'Multiple Social channels') },
      { key: 'F', value: 'full-online', label: bi('සමාජ මාධ්‍ය (Social Channels) සමඟ වෙබ් අඩවියක් (Website) හෝ ක්‍රමවත් අන්තර්ජාල විකිණීම් ක්‍රමයක් (Structured Online Sales) තියෙනවා', 'Social channels + website or structured online sales') },
    ]
  },
  {
    id: 'BUS-07', field: 'salesChannels', type: 'multi-select', phase: 'step3',
    stepLabel: bi('ව්‍යාපාර ශාඛාව', 'Business Branch'),
    title: bi(
      'දැනට ඔබට ගනුදෙනුකරුවන් ලැබෙන්නේ කුමන මාර්ගවලින්ද?',
      'Current sales channels'
    ),
    showIf: (a) => isBusinessBranch(a) && (a.businessOwnership || 0) > 3,
    choices: [
      { key: 'A', value: 'walk-in', label: bi('වෙළඳසැලට / ස්ථානයට පැමිණෙන ගනුදෙනුකරුවන්', 'Walk-in / local customers') },
      { key: 'B', value: 'facebook', label: bi('Facebook හරහා', 'Facebook') },
      { key: 'C', value: 'whatsapp', label: bi('WhatsApp හරහා', 'WhatsApp') },
      { key: 'D', value: 'instagram', label: bi('Instagram හරහා', 'Instagram') },
      { key: 'E', value: 'tiktok', label: bi('TikTok හරහා', 'TikTok') },
      { key: 'F', value: 'website', label: bi('Website / Online Store හරහා', 'Website / online store') },
      { key: 'G', value: 'marketplace', label: bi('Online Marketplace හරහා', 'Marketplace') },
      { key: 'H', value: 'referrals', label: bi('හඳුනන අයගේ නිර්දේශ / කටින් කට', 'Referrals / word-of-mouth') },
      { key: 'I', value: 'other', label: bi('වෙනත්', 'Other') },
    ]
  },

  // ── Shared Intent: Business ──────────────────────────────────────────────
  {
    id: 'INT-02', field: 'diyPreference', type: 'single-choice', phase: 'step3',
    stepLabel: bi('ව්‍යාපාර ශාඛාව', 'Business Branch'),
    title: bi(
      'පැහැදිලිව, පියවරෙන් පියවර මඟපෙන්වීමක් ලැබුණොත්, ඔබටම ඒක ක්‍රියාත්මක කරගෙන යන්න පුළුවන්ද?',
      'If you received a clear step-by-step plan, would you be comfortable implementing it yourself?'
    ),
    showIf: (a) => isBusinessBranch(a),
    choices: [
      { key: 'A', value: 0, label: bi('නැහැ, මට කෙනෙක් මඟපෙන්වලා දෙන්න ඕනේ', 'No, I need someone to guide me') },
      { key: 'B', value: 4, label: bi('සමහරවිට, වැඩේ අමාරුකම අනුව', 'Maybe, depending on the difficulty') },
      { key: 'C', value: 8, label: bi('ඔව්, පැහැදිලි මඟපෙන්වීමක් සහ templates තියෙනවා නම්', 'Yes, with a clear guide and templates') },
      { key: 'D', value: 10, label: bi('ඔව්, මමම ඉගෙනගෙන මමම ක්‍රියාත්මක කරගෙන යන්න කැමතියි', 'Yes, I prefer learning and implementing myself') },
    ]
  },
  {
    id: 'INT-03', field: 'mentorshipInterest', type: 'single-choice', phase: 'step3',
    stepLabel: bi('ව්‍යාපාර ශාඛාව', 'Business Branch'),
    title: bi(
      'ඔබේ ව්‍යාපාරය දියුණු කරගන්න පියවරෙන් පියවර මඟපෙන්වීමක් ලබාගැනීමට ඔබ කැමතිද?',
      'Would you be interested in structured guidance to grow your business?'
    ),
    showIf: (a) => isBusinessBranch(a),
    choices: [
      { key: 'A', value: 0, label: bi('නැහැ', 'No') },
      { key: 'B', value: 3, label: bi('සමහරවිට', 'Maybe') },
      { key: 'C', value: 7, label: bi('ඔව්, ඒක කොහොමද වෙන්නේ කියලා දැනගන්න කැමතියි', 'Yes, I\'d like to understand how it works') },
      { key: 'D', value: 10, label: bi('ඔව්, දැන් මට මඟපෙන්වීමක් ඕනේ', 'Yes, I am looking for guidance now') },
    ]
  },
  {
    id: 'INT-04', field: 'dfyRequirement', type: 'single-choice', phase: 'step3',
    stepLabel: bi('ව්‍යාපාර ශාඛාව', 'Business Branch'),
    title: bi(
      'ඔබේ ව්‍යාපාරයට අවශ්‍ය දෙයක් හදාගන්න හෝ ක්‍රියාත්මක කරගන්න වෘත්තිකයෙකුගේ හෝ කණ්ඩායමකගේ උදව් අවශ්‍යද?',
      'Do you currently need a professional or team to build or implement something for your business?'
    ),
    showIf: (a) => isBusinessBranch(a),
    choices: [
      { key: 'A', value: 0, label: bi('නැහැ', 'No') },
      { key: 'B', value: 2, label: bi('හරියටම දන්නේ නැහැ', 'Not sure') },
      { key: 'C', value: 5, label: bi('සමහරවිට, solution සහ cost අනුව', 'Possibly, depending on the solution and cost') },
      { key: 'D', value: 10, label: bi('ඔව්, මට දැනටමත් කරන්න ඕනේ දේ පැහැදිලිව තියෙනවා', 'Yes, I have a specific requirement') },
    ]
  },
  {
    id: 'INT-05', field: 'dfyNeeds', type: 'multi-select', phase: 'step3',
    stepLabel: bi('ව්‍යාපාර ශාඛාව', 'Business Branch'),
    title: bi(
      'ඔබේ ව්‍යාපාරයට අවශ්‍ය දෙයක් ක්‍රියාත්මක කරගන්න ඔබට උදව් අවශ්‍ය මොනවටද? (අදාළ සියල්ල තෝරන්න)',
      'What do you need help implementing?'
    ),
    showIf: (a) => isBusinessBranch(a) && (a.dfyRequirement || 0) >= 5,
    choices: [
      { key: 'A', value: 'website', label: bi('වෙබ් අඩවියක් (Website)', 'Website') },
      { key: 'B', value: 'online-store', label: bi('අන්තර්ජාල වෙළඳසැලක් (Online Store)', 'Online Store') },
      { key: 'C', value: 'sales-funnel', label: bi('ගනුදෙනුකරුවන් සොයාගැනීම / විකිණීම් වැඩි කරගැනීමේ ක්‍රමයක්', 'Sales Funnel / Lead Generation') },
      { key: 'D', value: 'social-media', label: bi('සමාජ මාධ්‍ය කළමනාකරණ ක්‍රමයක්', 'Social Media System') },
      { key: 'E', value: 'automation', label: bi('ස්වයංක්‍රීය කරගැනීම් (Automation)', 'Automation') },
      { key: 'F', value: 'crm', label: bi('ගනුදෙනුකරුවන් කළමනාකරණය කිරීමේ පද්ධතියක් (CRM)', 'CRM / Customer Management') },
      { key: 'G', value: 'content', label: bi('අන්තර්ගත නිර්මාණය සහ පළ කිරීමේ ක්‍රමයක්', 'Content System') },
      { key: 'H', value: 'other', label: bi('වෙනත්', 'Other') },
    ]
  },

  // ── Closing (both branches) ───────────────────────────────────────────────
  {
    id: 'CLOSING', field: 'closingNote', type: 'short-text', phase: 'step3',
    stepLabel: bi('අවසාන ප්‍රශ්නය', 'Final Question'),
    title: bi(
      'ඔබේ අරමුණ හෝ ඔබ මුහුණ දෙන අභියෝගය ගැන අපි දැනගත යුතු තවත් දෙයක් තියෙනවාද?',
      'Anything else about your goal or challenge you\'d like us to know?'
    ),
    placeholder: 'ලිවිය හැකි නම් ලියන්න... / Optional — share anything you\'d like us to know',
    optional: true,
  },
];

// ── Branch helpers ────────────────────────────────────────────────────────────
function isTechnicalBranch(a) {
  const techSit = ['learning', 'job', 'tailoring-biz'].includes(a.currentSituation);
  const techGoal = ['improve-skills', 'advanced-techniques', 'start-earning', 'grow-tailoring-biz'].includes(a.primaryGoal);
  return techSit || techGoal;
}
function isBusinessBranch(a) {
  const bizSit = ['tailoring-biz', 'other-biz', 'planning'].includes(a.currentSituation);
  const bizGoal = ['grow-tailoring-biz', 'grow-business-online', 'understand-tools', 'start-earning'].includes(a.primaryGoal);
  return bizSit || bizGoal;
}

// ── Score calculation ─────────────────────────────────────────────────────────
const PROBLEM_WEIGHTS = {
  'more-customers': { business: 3, diy: 2, dfy: 1 },
  'online-marketing': { business: 3, diy: 3, dfy: 1 },
  'content-creation': { business: 2, diy: 3, dfy: 1 },
  'online-sales': { business: 3, diy: 2, dfy: 3 },
  'website-system': { business: 2, diy: 0, dfy: 5 },
  'too-many-ops': { business: 3, diy: 1, dfy: 5 },
  'unsure-problem': { business: 2, diy: 3, dfy: 0 },
};
const DIGITAL_GAP = { 'none': 10, 'personal-fb': 8, 'biz-fb': 5, 'biz-plus-wa': 4, 'multi-social': 3, 'full-online': 0 };

function calculateScores(answers) {
  // Technical
  const technical = Math.min(30, (answers.tailoringSkill || 0) + (answers.technicalInterest || 0));

  // Business
  const problemBiz = (answers.problems || []).reduce((s, p) => s + (PROBLEM_WEIGHTS[p]?.business || 0), 0);
  const business = Math.min(35, (answers.businessOwnership || 0) + (answers.businessMaturity || 0) + Math.min(10, problemBiz));

  // DIY
  const bm = answers.businessMaturity || 0;
  const earlyBizStage = bm <= 1 ? 10 : bm <= 4 ? 8 : bm <= 7 ? 5 : 2;
  const problemDiy = (answers.problems || []).reduce((s, p) => s + (PROBLEM_WEIGHTS[p]?.diy || 0), 0);
  const digitalGap = DIGITAL_GAP[answers.digitalPresence] || 5;
  const diy = Math.min(30, (answers.diyPreference || 0) + Math.min(10, problemDiy + digitalGap) + earlyBizStage);

  // DFY
  const problemDfy = (answers.problems || []).reduce((s, p) => s + (PROBLEM_WEIGHTS[p]?.dfy || 0), 0);
  const dfyReq = answers.dfyRequirement || 0;
  const dfy = Math.min(35, dfyReq + Math.min(10, problemDfy) + (dfyReq >= 10 ? 10 : dfyReq >= 5 ? 5 : 0));

  let routes = [];
  if (dfy >= 18) routes.push({ route: 'DFY_CONSULTATION', score: dfy });
  if (business >= 18 && (answers.mentorshipInterest || 0) >= 7) routes.push({ route: 'BUSINESS_GROWTH_MENTORSHIP', score: business });
  if (technical >= 18 && (answers.technicalInterest || 0) >= 7) routes.push({ route: 'TECHNICAL_TAILORING', score: technical });
  if (business >= 10 && diy >= 18 && dfy < 18) routes.push({ route: 'DIY_BUSINESS_GROWTH', score: diy });

  routes.sort((a, b) => b.score - a.score);
  const primary = routes.length > 0 ? routes[0].route : 'NURTURE';
  return { technical, business, diy, dfy, primary };
}

const ROUTE_LABELS = {
  TECHNICAL_TAILORING: 'Technical Tailoring Mentorship',
  DIY_BUSINESS_GROWTH: 'DIY Business Growth',
  BUSINESS_GROWTH_MENTORSHIP: 'Business Growth Mentorship',
  DFY_CONSULTATION: 'Done-For-You Consultation',
  NURTURE: 'Workshop Participant',
};

// ── State ─────────────────────────────────────────────────────────────────────
let state = {
  isOpen: false,
  phase: 'step1',
  qIndex: 0,
  answers: {},
  multiVals: [],
  lastRenderedQ: null
};

// ── App Logic ─────────────────────────────────────────────────────────────────
window.Funnel = {
  openQuiz: () => {
    document.getElementById('quiz-overlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    state.isOpen = true;
    window.Funnel.render();
  },

  closeQuiz: () => {
    document.getElementById('quiz-overlay').style.display = 'none';
    document.body.style.overflow = '';
    state.isOpen = false;
  },

  getActiveQuestions: () => {
    return QUIZ_QUESTIONS.filter(q =>
      q.phase === state.phase && (!q.showIf || q.showIf(state.answers))
    );
  },

  render: () => {
    if (state.phase === 'result') { window.Funnel.renderResult(); return; }

    const activeQ = window.Funnel.getActiveQuestions();
    const currentQ = activeQ[state.qIndex];
    const contentArea = document.getElementById('quiz-content-area');
    const headerLabel = document.getElementById('quiz-progress-label');
    const navBar = document.getElementById('quiz-nav');
    const nextNavBtn = document.getElementById('btn-next-nav');
    if (nextNavBtn) nextNavBtn.style.display = 'none';

    const isSameQ = state.lastRenderedQ === currentQ.id;
    state.lastRenderedQ = currentQ.id;

    if (!isSameQ) {
      const panel = document.getElementById('quiz-main-panel');
      if (panel) panel.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Header label
    if (state.phase === 'step1') {
      headerLabel.innerHTML = '';
    } else {
      const phaseLabel = state.phase === 'step2' ? 'Diagnostic' : 'Assessment';
      headerLabel.innerHTML = `${phaseLabel} &mdash; ${state.qIndex + 1} / ${activeQ.length}`;
    }

    contentArea.innerHTML = '';

    // ── Registration form ──────────────────────────────────────────────────
    if (currentQ.type === 'contact-block') {
      navBar.style.display = 'none';
      contentArea.innerHTML = `
        <div class="quiz-question ${isSameQ ? 'no-anim' : ''}" style="padding-top: 0.5rem; padding-bottom: 0.75rem;">
          <h2 class="quiz-q-title" style="color:var(--rose-deep); margin-bottom:0.25rem;">Registration</h2>
          <p style="color:var(--ink-muted); margin-bottom: 2rem; line-height: 1.5;">
            නොමිලේ පැවැත්වෙන වැඩමුළුව සඳහා ලියාපදිංචි වෙමු<br>
            <span style="font-size:0.85em; color:var(--ink-light);">Let's get you registered for the Free Workshop</span>
          </p>
          <form id="contact-form" onsubmit="window.Funnel.submitContact(event)">
            <div class="contact-grid">
              <div class="cf-field">
                <label class="cf-label">සම්පූර්ණ නම / Full Name <span class="cf-req">*</span></label>
                <input type="text" id="cf_name" class="cf-input" placeholder="ඔබේ නම / Your name" required>
              </div>
              <div class="cf-field">
                <label class="cf-label">දුරකථන අංකය / WhatsApp Number <span class="cf-req">*</span></label>
                <input type="tel" id="cf_phone" class="cf-input" placeholder="07XXXXXXXX" required>
              </div>
              <div class="cf-field">
                <label class="cf-label">විද්‍යුත් තැපැල් / Email <span class="cf-req">*</span></label>
                <input type="email" id="cf_email" class="cf-input" placeholder="you@email.com" required>
              </div>
              <div class="cf-field">
                <label class="cf-label">දිස්ත්‍රික්කය / District or City <span class="cf-req">*</span></label>
                <input type="text" id="cf_location" class="cf-input" placeholder="උදා: Badulla / Colombo" required>
              </div>
            </div>
            <label class="cf-consent-label">
              <input type="checkbox" id="cf_consent" required>
              <span>Free Workshop එක ඉදිරි පියවරයන් පිළිබඳව මා හා සම්බන්ධ වීමට අවසර ලබා දෙමි. <br><em>I agree to be contacted about the workshop and next steps.</em></span>
            </label>
            <button type="submit" class="btn btn-primary cf-submit">Continue →</button>
          </form>
        </div>
      `;
    }

    // ── Single-choice ─────────────────────────────────────────────────────
    else if (currentQ.type === 'single-choice') {
      navBar.style.display = 'flex';
      const hasAnswer = state.answers[currentQ.field] !== undefined;
      if (hasAnswer && nextNavBtn) nextNavBtn.style.display = 'inline-flex';

      let html = `
        <div class="quiz-question ${isSameQ ? 'no-anim' : ''}">
          <h2 class="quiz-q-title">${currentQ.title}</h2>
          <div class="quiz-choices">
      `;
      currentQ.choices.forEach(c => {
        const isSel = state.answers[currentQ.field] === c.value;
        const vStr = typeof c.value === 'string' ? `'${c.value}'` : c.value;
        html += `
          <button class="quiz-choice ${isSel ? 'selected' : ''}"
            onclick="window.Funnel.selectSingle('${currentQ.field}', ${vStr})">
            <span class="quiz-choice-key">${c.key}</span>
            <span class="quiz-choice-label">${c.label}</span>
          </button>
        `;
      });
      html += `</div></div>`;
      contentArea.innerHTML = html;
    }

    // ── Multi-select ──────────────────────────────────────────────────────
    else if (currentQ.type === 'multi-select') {
      navBar.style.display = 'flex';
      // Restore prior selections
      if (!state.multiVals.length && state.answers[currentQ.field]) {
        state.multiVals = [...state.answers[currentQ.field]];
      }
      let html = `
        <div class="quiz-question ${isSameQ ? 'no-anim' : ''}">
          <h2 class="quiz-q-title">${currentQ.title}</h2>
          <div class="quiz-choices multi-select-choices">
      `;
      currentQ.choices.forEach(c => {
        const isSel = state.multiVals.includes(c.value);
        html += `
          <button class="quiz-choice ${isSel ? 'selected' : ''}"
            onclick="window.Funnel.toggleMulti('${c.value}', '${currentQ.field}')">
            <span class="quiz-choice-key multi-check">${isSel ? '✓' : c.key}</span>
            <span class="quiz-choice-label">${c.label}</span>
          </button>
        `;
      });
      html += `</div>
        <button class="quiz-ok-btn" onclick="window.Funnel.commitMulti('${currentQ.field}')"
          ${state.multiVals.length === 0 ? 'disabled' : ''}>
          OK ✓
        </button>
      </div>`;
      contentArea.innerHTML = html;
    }

    // ── Short-text ────────────────────────────────────────────────────────
    else if (currentQ.type === 'short-text') {
      navBar.style.display = 'flex';
      const existing = state.answers[currentQ.field] || '';
      const hasText = existing.trim().length > 0;

      contentArea.innerHTML = `
        <div class="quiz-question ${isSameQ ? 'no-anim' : ''}">
          <h2 class="quiz-q-title">${currentQ.title}</h2>
          ${currentQ.optional ? '<p class="quiz-optional-note">අත්‍යාවශ්‍ය නොවේ &mdash; Optional</p>' : ''}
          <input type="text" class="quiz-text-input" id="short-text-input"
            placeholder="${currentQ.placeholder || ''}"
            value="${existing}"
            oninput="window.Funnel.saveText('${currentQ.field}', this.value)">
          <div style="display:flex; gap:1rem; margin-top:1.5rem;">
            <button class="btn-skip" id="short-text-skip" onclick="window.Funnel.saveText('${currentQ.field}', ''); window.Funnel.goNext()" style="${hasText ? 'display:none;' : 'display:inline-flex;'}">මඟහරින්න / Skip ➔</button>
            <button class="quiz-ok-btn" id="short-text-ok" onclick="window.Funnel.goNext()" style="${hasText ? 'display:inline-flex;' : 'display:none;'}">ඉදිරියට / Next ➔</button>
          </div>
        </div>
      `;
    }
  },

  submitContact: (e) => {
    e.preventDefault();
    state.answers.name = document.getElementById('cf_name').value;
    state.answers.phone = document.getElementById('cf_phone').value;
    state.answers.email = document.getElementById('cf_email').value;
    state.answers.location = document.getElementById('cf_location').value;
    window.Funnel.submitToWebhook(false);
    window.Funnel.goNext();
  },

  selectSingle: (field, value) => {
    if (state.answers[field] !== value) {
      window.Funnel.clearAnswersAfterCurrentIndex();
    }
    state.answers[field] = value;
    setTimeout(() => window.Funnel.goNext(), 220);
  },

  toggleMulti: (value, field) => {
    if (state.multiVals.includes(value)) {
      state.multiVals = state.multiVals.filter(v => v !== value);
    } else {
      state.multiVals.push(value);
    }
    window.Funnel.render();
  },

  commitMulti: (field) => {
    const currentAns = state.answers[field] || [];
    const newAns = [...state.multiVals];
    
    // Check if array contents actually changed
    const isSame = currentAns.length === newAns.length && currentAns.every(v => newAns.includes(v));
    if (!isSame) {
      window.Funnel.clearAnswersAfterCurrentIndex();
    }

    state.answers[field] = newAns;
    state.multiVals = [];
    window.Funnel.goNext();
  },

  saveText: (field, value) => {
    state.answers[field] = value;
    const okBtn = document.getElementById('short-text-ok');
    const skipBtn = document.getElementById('short-text-skip');
    if (value.trim().length > 0) {
      if (okBtn) okBtn.style.display = 'inline-flex';
      if (skipBtn) skipBtn.style.display = 'none';
    } else {
      if (okBtn) okBtn.style.display = 'none';
      if (skipBtn) skipBtn.style.display = 'inline-flex';
    }
  },

  goNext: () => {
    const activeQ = window.Funnel.getActiveQuestions();
    if (state.qIndex < activeQ.length - 1) {
      state.qIndex++;
      state.multiVals = [];
      window.Funnel.render();
    } else {
      if (state.phase === 'step1') {
        state.phase = 'step2'; state.qIndex = 0;
      } else if (state.phase === 'step2') {
        state.phase = 'step3'; state.qIndex = 0;
      } else if (state.phase === 'step3') {
        state.phase = 'result';
        window.Funnel.submitToWebhook(true);
      }
      state.multiVals = [];
      window.Funnel.render();
    }
  },

  goPrev: () => {
    if (state.qIndex > 0) {
      state.qIndex--;
      state.multiVals = state.answers[window.Funnel.getActiveQuestions()[state.qIndex].field] || [];
      window.Funnel.render();
    }
  },

  clearAnswersAfterCurrentIndex: () => {
    const activeQ = window.Funnel.getActiveQuestions();
    const currentQ = activeQ[state.qIndex];
    if (!currentQ) return;
    
    const globalIdx = QUIZ_QUESTIONS.findIndex(q => q.id === currentQ.id);
    if (globalIdx === -1) return;

    for (let i = globalIdx + 1; i < QUIZ_QUESTIONS.length; i++) {
      delete state.answers[QUIZ_QUESTIONS[i].field];
    }
  },

  renderResult: () => {
    const scores = calculateScores(state.answers);
    const contentArea = document.getElementById('quiz-content-area');
    document.getElementById('quiz-nav').style.display = 'none';
    document.getElementById('quiz-header-progress').style.display = 'none';
    const firstName = (state.answers.name || 'ඔබ').split(' ')[0];
    contentArea.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-icon">✓</div>
        <h2>ස්තූතියි, ${firstName}! <br><em style="font-size:1.2rem; font-style:normal;">Thank you!</em></h2>
        <div class="quiz-result-route">${ROUTE_LABELS[scores.primary]}</div>
        <p class="quiz-result-message">
          ඔබේ තොරතුරු සාර්ථකව ලැබී ඇත. <br>
          Workshop එකට සාදරයෙන් පිළිගනිමු!<br><br>
          <em>Your details have been received. Our team will be in touch with your personalised growth path.</em>
        </p>
        <button class="btn btn-primary" onclick="window.Funnel.closeQuiz()">Back to Website</button>
      </div>
    `;
  },

  renderPathPanel: () => {
    // Disabled
  },

  submitToWebhook: async (isFinal) => {
    if (!WEBHOOK_URL || WEBHOOK_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE") return;
    const scores = calculateScores(state.answers);
    const payload = {
      isFinal,
      timestamp: new Date().toLocaleString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', hour12: true 
      }),
      name: state.answers.name,
      phone: state.answers.phone,
      email: state.answers.email,
      location: state.answers.location,
      primaryRoute: scores.primary,
      technicalScore: scores.technical,
      businessScore: scores.business,
      diyScore: scores.diy,
      dfyScore: scores.dfy,
      rawAnswers: JSON.stringify(state.answers)
    };
    try {
      fetch(WEBHOOK_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
      console.log("Submitted to Webhook:", payload);
    } catch (err) {
      console.error("Webhook error:", err);
    }
  }
};


window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const popup = document.getElementById('promo-popup');
    if (popup && !state.isOpen) popup.style.display = 'flex';
  }, 1500);
});
