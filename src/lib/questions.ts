// Quiz question definitions — 100% compliant with Milestone 2 §1.1 + §2.1–2.10 and Appx A

export interface ChoiceOption {
  key: string;
  label: string;
  value: any;
}

export interface QuizQuestion {
  id: string;
  field: string;
  type: 'contact-block' | 'single-choice' | 'multi-choice';
  phase: 'step1' | 'step2' | 'step3'; // New phase categorization
  stepLabel: string;
  title: string;
  subtitle?: string;
  hint?: string;
  choices?: ChoiceOption[];
  showIf?: (answers: Record<string, any>) => boolean;
}

// ─── Relevance Helpers ───────────────────────────────────────────

export function isTechnicalRelevant(a: Record<string, any>): boolean {
  const sit = a.currentSituation;
  const goal = a.primaryGoal;
  const sitTech = ['learning', 'job', 'tailoring-biz'].includes(sit);
  const goalTech = ['improve-skills', 'advanced-techniques', 'start-earning'].includes(goal);
  return sitTech || goalTech;
}

export function isBusinessRelevant(a: Record<string, any>): boolean {
  const sit = a.currentSituation;
  const goal = a.primaryGoal;
  const sitBiz = ['tailoring-biz', 'other-biz', 'planning'].includes(sit);
  const goalBiz = ['grow-tailoring-biz', 'grow-business-online', 'understand-tools'].includes(goal);
  return sitBiz || goalBiz;
}

// ─── ALL QUESTIONS ───────────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [

  // ══ STEP 1: CONTACT BLOCK ═════════════════════════════════════
  {
    id: 'contact',
    field: '_contact',
    type: 'contact-block',
    phase: 'step1',
    stepLabel: 'Registration',
    title: 'Let\'s get you registered for the Free Workshop',
    subtitle: 'Your details are secured immediately. We\'ll then personalise your path based on a few quick questions.',
  },

  // ══ STEP 2: DIAGNOSTIC QUESTIONS ════════════════════════════════

  // TECH-01 — §2.1 Tailoring Skill Level
  {
    id: 'tailoringSkill',
    field: 'tailoringSkill',
    type: 'single-choice',
    phase: 'step2',
    stepLabel: 'Question',
    title: 'How would you describe your current tailoring skill level?',
    hint: 'Press A–E on your keyboard to select instantly.',
    showIf: isTechnicalRelevant,
    choices: [
      { key: 'A', label: 'Beginner — just starting out',                              value: 3  },
      { key: 'B', label: 'I know the basics but want to improve',                     value: 5  },
      { key: 'C', label: 'I regularly do tailoring for myself or others',             value: 8  },
      { key: 'D', label: 'I work professionally as a tailor',                         value: 10 },
      { key: 'E', label: 'I am highly experienced and mainly want specialised guidance', value: 9  },
    ],
  },

  // BUS-01 — §2.2 Business Ownership
  {
    id: 'businessOwnership',
    field: 'businessOwnership',
    type: 'single-choice',
    phase: 'step2',
    stepLabel: 'Question',
    title: 'Do you currently operate a business or earn income through a product or service?',
    choices: [
      { key: 'A', label: 'No — I am not in business yet',               value: 0  },
      { key: 'B', label: 'Not yet, but I am planning to start',         value: 3  },
      { key: 'C', label: 'Yes — small or part-time income',             value: 7  },
      { key: 'D', label: 'Yes — I am actively operating a business',    value: 10 },
    ],
  },

  // BUS-04 — §2.3 Business Maturity
  {
    id: 'businessMaturity',
    field: 'businessMaturity',
    type: 'single-choice',
    phase: 'step2',
    stepLabel: 'Question',
    title: 'Which best describes where your business is right now?',
    showIf: (a) => (a.businessOwnership ?? 0) > 0,
    choices: [
      { key: 'A', label: 'Idea stage — not started yet',                        value: 1  },
      { key: 'B', label: 'Started but inconsistent — some income, not reliable', value: 4  },
      { key: 'C', label: 'Regular customers but growth is limited',             value: 8  },
      { key: 'D', label: 'Stable business — seeking meaningful growth',         value: 10 },
      { key: 'E', label: 'Growing business with operational or digital challenges', value: 10.1 },
    ],
  },

  // BUS-05 — §2.4 Business Problems
  {
    id: 'problems',
    field: 'problems',
    type: 'multi-choice',
    phase: 'step2',
    stepLabel: 'Question',
    title: 'What are the biggest challenges in your business right now?',
    subtitle: 'Select all that apply — you can choose more than one',
    showIf: (a) => (a.businessOwnership ?? 0) > 0,
    choices: [
      { key: 'A', label: 'I do not know how to get more customers',                  value: 'more-customers'   },
      { key: 'B', label: 'I do not know how to market my business online',           value: 'online-marketing' },
      { key: 'C', label: 'I don\'t know what to post or how to create content',     value: 'content-creation' },
      { key: 'D', label: 'I do not have a clear online sales process',              value: 'online-sales'     },
      { key: 'E', label: 'I need a website or a digital system built',              value: 'website-system'   },
      { key: 'F', label: 'I have too many operational tasks or manual processes',   value: 'too-many-ops'     },
      { key: 'G', label: 'I am unsure what my biggest problem is',                  value: 'unsure-problem'   },
    ],
  },

  // BUS-06 — §2.5 Digital Presence
  {
    id: 'digitalPresence',
    field: 'digitalPresence',
    type: 'single-choice',
    phase: 'step2',
    stepLabel: 'Question',
    title: 'Where is your business currently active online?',
    showIf: (a) => (a.businessOwnership ?? 0) > 0,
    choices: [
      { key: 'A', label: 'No online presence at all',                                    value: 'none'         },
      { key: 'B', label: 'Personal Facebook or WhatsApp only',                           value: 'personal-fb'  },
      { key: 'C', label: 'Business Facebook or Instagram page',                          value: 'biz-fb'       },
      { key: 'D', label: 'Multiple social channels (Facebook, Instagram, TikTok, etc.)', value: 'multi-social' },
      { key: 'E', label: 'Social channels + website or structured online sales process', value: 'full-online'  },
    ],
  },

  // BUS-07 — §2.6 Sales Channels
  {
    id: 'salesChannels',
    field: 'salesChannels',
    type: 'multi-choice',
    phase: 'step2',
    stepLabel: 'Question',
    title: 'How do you currently get customers or sales?',
    subtitle: 'Select all that apply',
    showIf: (a) => (a.businessOwnership ?? 0) > 0,
    choices: [
      { key: 'A', label: 'Walk-in or local customers',          value: 'walk-in'    },
      { key: 'B', label: 'Facebook',                            value: 'facebook'   },
      { key: 'C', label: 'WhatsApp',                            value: 'whatsapp'   },
      { key: 'D', label: 'Instagram',                           value: 'instagram'  },
      { key: 'E', label: 'TikTok',                              value: 'tiktok'     },
      { key: 'F', label: 'Website or online store',             value: 'website'    },
      { key: 'G', label: 'Marketplace (Daraz, etc.)',           value: 'marketplace'},
      { key: 'H', label: 'Referrals or word-of-mouth',         value: 'referrals'  },
      { key: 'I', label: 'I don\'t have customers yet',        value: 'none'       },
    ],
  },

  // ══ STEP 3: CONDITIONAL PITCH & INTENT ══════════════════════════

  // TECH-02 / INT-01 — §2.7 Technical Mentorship Interest
  {
    id: 'technicalInterest',
    field: 'technicalInterest',
    type: 'single-choice',
    phase: 'step3',
    stepLabel: 'Intent',
    title: 'Are you interested in receiving structured guidance to improve your tailoring skills?',
    showIf: isTechnicalRelevant,
    choices: [
      { key: 'A', label: 'Not currently',                               value: 0  },
      { key: 'B', label: 'Maybe — I would like to know more',           value: 3  },
      { key: 'C', label: 'Yes — I am interested',                       value: 7  },
      { key: 'D', label: 'Yes — I am actively looking for this now',    value: 10 },
    ],
  },

  // INT-02 — §2.8 DIY Preference
  {
    id: 'diyPreference',
    field: 'diyPreference',
    type: 'single-choice',
    phase: 'step3',
    stepLabel: 'Intent',
    title: 'If you received a clear step-by-step plan, would you be comfortable implementing improvements yourself?',
    choices: [
      { key: 'A', label: 'No — I need someone to guide or do it for me',      value: 0  },
      { key: 'B', label: 'Maybe — depending on the difficulty',               value: 4  },
      { key: 'C', label: 'Yes — with a clear guide and templates',            value: 8  },
      { key: 'D', label: 'Yes — I prefer to learn and implement on my own',   value: 10 },
    ],
  },

  // INT-03 — §2.9 Business Mentorship Interest
  {
    id: 'mentorshipInterest',
    field: 'mentorshipInterest',
    type: 'single-choice',
    phase: 'step3',
    stepLabel: 'Intent',
    title: 'Would you be interested in receiving structured guidance for growing your business?',
    choices: [
      { key: 'A', label: 'No',                                              value: 0  },
      { key: 'B', label: 'Maybe',                                           value: 3  },
      { key: 'C', label: 'Yes — I would like to understand how it works',   value: 7  },
      { key: 'D', label: 'Yes — I am looking for this kind of guidance now',value: 10 },
    ],
  },

  // INT-04 — §2.10 Done-For-You Requirements
  {
    id: 'dfyRequirement',
    field: 'dfyRequirement',
    type: 'single-choice',
    phase: 'step3',
    stepLabel: 'Intent',
    title: 'Do you currently need a professional team to build or implement something for your business?',
    hint: 'This includes websites, sales funnels, social media systems, automation, or any other digital work.',
    choices: [
      { key: 'A', label: 'No — I can handle it myself',                              value: 0  },
      { key: 'B', label: 'Not sure yet',                                             value: 2  },
      { key: 'C', label: 'Possibly — depending on the solution and cost',            value: 5  },
      { key: 'D', label: 'Yes — I have a specific requirement ready to discuss',     value: 10 },
    ],
  },

  // INT-06 — §2.10 DFY What they need
  {
    id: 'dfyNeeds',
    field: 'dfyNeeds',
    type: 'multi-choice',
    phase: 'step3',
    stepLabel: 'Intent',
    title: 'What do you need help implementing?',
    subtitle: 'Select all that apply',
    showIf: (a) => (a.dfyRequirement ?? 0) >= 5,
    choices: [
      { key: 'A', label: 'Website',                     value: 'website'     },
      { key: 'B', label: 'Online Store',                value: 'online-store'},
      { key: 'C', label: 'Sales Funnel',                value: 'sales-funnel'},
      { key: 'D', label: 'Lead Generation',             value: 'lead-gen'    },
      { key: 'E', label: 'Social Media System',         value: 'social-media'},
      { key: 'F', label: 'Automation',                  value: 'automation'  },
      { key: 'G', label: 'CRM / Customer Management',   value: 'crm'         },
      { key: 'H', label: 'Content System',              value: 'content'     },
      { key: 'I', label: 'Other',                       value: 'other'       },
    ],
  },

];

export function getActiveQuestions(answers: Record<string, any>): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(q => !q.showIf || q.showIf(answers));
}

export function getQuestionsForPhase(answers: Record<string, any>, phase: string): QuizQuestion[] {
  const active = getActiveQuestions(answers);
  return active.filter(q => q.phase === phase);
}

// Re-number step labels dynamically per phase
export function getNumberedQuestions(answers: Record<string, any>, phase: string): QuizQuestion[] {
  const active = getQuestionsForPhase(answers, phase);
  let qNum = 0;
  return active.map(q => {
    if (q.type === 'contact-block') return q;
    qNum++;
    return { ...q, stepLabel: `Question ${qNum} of ${active.length}` };
  });
}
