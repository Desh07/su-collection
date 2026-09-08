// ============================================================
// SCORING ENGINE — Su Collection × UVA VEC Funnel
// 100% compliant with Milestone 2: Lead Qualification §2–4
// ============================================================

export type Route =
  | 'TECHNICAL_TAILORING'
  | 'DIY_BUSINESS_GROWTH'
  | 'BUSINESS_GROWTH_MENTORSHIP'
  | 'DFY_CONSULTATION'
  | 'NURTURE';

export interface Scores {
  technical: number;  // max 30   §3.1
  business: number;   // max 30+  §3.2
  diy: number;        // max 30   §3.3
  dfy: number;        // max 30+  §3.4
}

export interface RouteResult {
  primary: Route;
  secondary: Route[];
  scores: Scores;
  classification: Record<Route, string>;
  crmTags: string[];
}

// Full answer shape — all mandatory + conditional fields
export interface QuizAnswers {
  // §1.1 Mandatory registration
  name: string;
  phone: string;
  email: string;
  location: string;
  consent: boolean;

  // §1.1 Primary segmentation (part of contact block)
  currentSituation: string;  // 'learning'|'job'|'tailoring-biz'|'other-biz'|'planning'|'other'
  primaryGoal: string;       // drives primary goal match score

  // §2.1 Tailoring skill level → technical score component
  tailoringSkill: number;    // beginner=3, basic=5, regular=8, pro=10, expert=9

  // §2.2 Business ownership → business score component
  businessOwnership: number; // no=0, planning=3, small=7, active=10

  // §2.3 Business maturity → business score component (conditional)
  businessMaturity: number;  // idea=1, inconsistent=4, limited=8, stable=10, growing=10

  // §2.4 Business problems → multi-score contribution (conditional)
  problems: string[];

  // §2.5 Digital presence → digital maturity signal for DIY calc (conditional)
  digitalPresence: string;   // 'none'|'personal-fb'|'biz-fb'|'multi-social'|'full-online'

  // §2.6 Sales channels → context only, manual review (conditional)
  salesChannels: string[];

  // §2.7 Technical mentorship interest → technical score component
  technicalInterest: number; // not=0, maybe=3, yes=7, actively=10

  // §2.8 DIY preference → DIY score component
  diyPreference: number;     // no=0, maybe=4, yes-guide=8, yes-self=10

  // §2.9 Business mentorship interest → routing gate
  mentorshipInterest: number; // no=0, maybe=3, understand=7, now=10

  // §2.10 DFY requirement → DFY score + routing
  dfyRequirement: number;    // no=0, unsure=2, possibly=5, specific=10
  dfySpecific: boolean;      // true when answer is "Yes, I have a specific requirement"
  dfyNeeds: string[];        // what they need implemented (when dfySpecific=true)
}

// ─── Score Lookup Tables ──────────────────────────────────────────

// §2.4 Problem score weights (exactly as in spec table)
const PROBLEM_WEIGHTS: Record<string, { business: number; diy: number; mentorship: number; dfy: number }> = {
  'more-customers':   { business: 3, diy: 2, mentorship: 2, dfy: 1 },
  'online-marketing': { business: 3, diy: 3, mentorship: 2, dfy: 1 },
  'content-creation': { business: 2, diy: 3, mentorship: 1, dfy: 1 },
  'online-sales':     { business: 3, diy: 2, mentorship: 2, dfy: 3 },
  'website-system':   { business: 2, diy: 0, mentorship: 1, dfy: 5 },
  'too-many-ops':     { business: 3, diy: 1, mentorship: 2, dfy: 5 },
  'unsure-problem':   { business: 2, diy: 3, mentorship: 2, dfy: 0 },
};

// §2.5 Digital presence → digital knowledge gap (used in DIY §3.3 as "Digital/Marketing Knowledge Gap 0–10")
// Higher gap = higher DIY opportunity score
const DIGITAL_GAP: Record<string, number> = {
  'none':         10,
  'personal-fb':   8,
  'biz-fb':        5,
  'multi-social':  3,
  'full-online':   0,
};

// §1.1 Primary Goal → technical score contribution (primary goal match 0–10, §3.1)
const GOAL_TECH_MATCH: Record<string, number> = {
  'improve-skills':       10,
  'advanced-techniques':  10,
  'start-earning':         7,
  'grow-tailoring-biz':    5,
  'grow-business-online':  2,
  'understand-tools':      0,
};

// §2.3 Business maturity "active business" gate: maturity ≥ 7 means active (for §4.3)
const ACTIVE_BUSINESS_THRESHOLD = 7; // maps to "Regular customers" (8) or Stable (10) or Growing (10)

// ─── Main Scoring Function ────────────────────────────────────────

export function calculateScores(answers: Partial<QuizAnswers>): RouteResult {

  // ── §3.1 Technical Tailoring Score = Skill(0-10) + TechInterest(0-10) + GoalMatch(0-10)
  const goalMatch = GOAL_TECH_MATCH[answers.primaryGoal ?? ''] ?? 5;
  const technical = Math.min(30,
    (answers.tailoringSkill ?? 0) +
    (answers.technicalInterest ?? 0) +
    goalMatch
  );

  // ── §3.2 Business Growth Score = Ownership(0-10) + Maturity(0-10) + Problems(capped 0-10)
  const problemBiz = (answers.problems ?? []).reduce((s, p) => s + (PROBLEM_WEIGHTS[p]?.business ?? 0), 0);
  const business = Math.min(35,
    (answers.businessOwnership ?? 0) +
    (answers.businessMaturity ?? 0) +
    Math.min(10, problemBiz)
  );

  // ── §3.3 DIY Score = DIYPref(0-10) + DigitalGap(0-10) + EarlyBizStage(0-10)
  //    "Early or Emerging Business Stage" = inverse of business maturity (lower maturity = more DIY appropriate)
  //    We map: businessMaturity 0-4 → earlyStage 10, 4-8 → 6, 8-10 → 2
  const bm = answers.businessMaturity ?? 0;
  const earlyBizStage = bm <= 1 ? 10 : bm <= 4 ? 8 : bm <= 7 ? 5 : 2;
  const problemDiy = (answers.problems ?? []).reduce((s, p) => s + (PROBLEM_WEIGHTS[p]?.diy ?? 0), 0);
  const digitalGap = DIGITAL_GAP[answers.digitalPresence ?? ''] ?? 5;
  const diy = Math.min(30,
    (answers.diyPreference ?? 0) +
    Math.min(10, problemDiy + digitalGap) +  // combined gap signal
    earlyBizStage
  );

  // ── §3.4 DFY Score = SpecificReq(0-10) + OperationalProblemSeverity(capped 0-10) + Urgency(0-10)
  //    "Urgency/Readiness to Invest" proxied by dfyRequirement (0-10)
  const problemDfy = (answers.problems ?? []).reduce((s, p) => s + (PROBLEM_WEIGHTS[p]?.dfy ?? 0), 0);
  const dfy = Math.min(35,
    (answers.dfyRequirement ?? 0) +
    Math.min(10, problemDfy) +
    (answers.dfyRequirement === 10 ? 10 : (answers.dfyRequirement ?? 0) >= 5 ? 5 : 0) // urgency proxy
  );

  const scores: Scores = { technical, business, diy, dfy };

  // ── §4 Routing Rules ─────────────────────────────────────────────
  const routes: { route: Route; score: number }[] = [];

  // §4.4 DFY: dfyScore ≥ 18 AND specific req = YES
  if (dfy >= 18 && answers.dfySpecific) {
    routes.push({ route: 'DFY_CONSULTATION', score: dfy });
  }

  // §4.3 Business Growth Mentorship: biz ≥ 18 AND mentorshipInterest ≥ 7 AND active business (maturity ≥ threshold)
  if (business >= 18 && (answers.mentorshipInterest ?? 0) >= 7 && (answers.businessMaturity ?? 0) >= ACTIVE_BUSINESS_THRESHOLD) {
    routes.push({ route: 'BUSINESS_GROWTH_MENTORSHIP', score: business });
  }

  // §4.1 Technical Tailoring: technical ≥ 18 AND technicalInterest ≥ 7
  if (technical >= 18 && (answers.technicalInterest ?? 0) >= 7) {
    routes.push({ route: 'TECHNICAL_TAILORING', score: technical });
  }

  // §4.2 DIY: biz ≥ 10 AND diy ≥ 18 AND dfy < 18
  if (business >= 10 && diy >= 18 && dfy < 18) {
    routes.push({ route: 'DIY_BUSINESS_GROWTH', score: diy });
  }

  // Sort highest score first → primary route
  routes.sort((a, b) => b.score - a.score);
  const primary: Route = routes.length > 0 ? routes[0].route : 'NURTURE';
  const secondary: Route[] = routes.slice(1).map(r => r.route);

  // ── Classification labels (§3.1-3.4 tables)
  const techClass =
    technical >= 24 ? 'High Intent' :
    technical >= 18 ? 'Qualified' :
    technical >= 10 ? 'Potential' : 'Low';

  const bizClass =
    business >= 25 ? 'High Opportunity' :
    business >= 18 ? 'Qualified Growth Lead' :
    business >= 10 ? 'Emerging' : 'Early';

  const diyClass =
    diy >= 24 ? 'Strong DIY Fit' :
    diy >= 18 ? 'Qualified DIY Lead' :
    diy >= 10 ? 'Possible Fit' : 'Low Fit';

  const dfyClass =
    dfy >= 24 ? 'High Intent' :
    dfy >= 18 ? 'Qualified' :
    dfy >= 10 ? 'Potential' : 'Low';

  // ── §5 CRM Tags
  const crmTags: string[] = [];

  // Audience tags
  const sit = answers.currentSituation ?? '';
  if (sit === 'learning') crmTags.push('Aspiring Tailor');
  if (sit === 'job') crmTags.push('Practicing Tailor');
  if (sit === 'tailoring-biz') crmTags.push('Tailoring Business Owner');
  if (sit === 'other-biz') crmTags.push('Other Business Owner');
  if (sit === 'planning') crmTags.push('Future Entrepreneur');

  // Intent tags
  if ((answers.technicalInterest ?? 0) >= 3) crmTags.push('Technical Interest');
  if (business >= 10) crmTags.push('Business Growth Interest');
  if (diy >= 18) crmTags.push('DIY Interest');
  if ((answers.mentorshipInterest ?? 0) >= 3) crmTags.push('Business Mentorship Interest');
  if (dfy >= 10) crmTags.push('DFY Interest');

  // Qualification tags
  if (technical >= 18) crmTags.push('Technical Qualified');
  if (diy >= 18) crmTags.push('DIY Qualified');
  if (business >= 18 && (answers.mentorshipInterest ?? 0) >= 7) crmTags.push('Mentorship Qualified');
  if (dfy >= 18) crmTags.push('DFY Qualified');
  if (primary === 'NURTURE') crmTags.push('Nurture Required');

  // Priority tags
  if (technical >= 24 || dfy >= 24 || business >= 25) crmTags.push('Hot');
  else if (technical >= 18 || diy >= 18 || business >= 18 || dfy >= 18) crmTags.push('Warm');
  else crmTags.push('Cold');

  return {
    primary,
    secondary,
    scores,
    classification: {
      TECHNICAL_TAILORING: techClass,
      BUSINESS_GROWTH_MENTORSHIP: bizClass,
      DIY_BUSINESS_GROWTH: diyClass,
      DFY_CONSULTATION: dfyClass,
      NURTURE: 'Nurture',
    },
    crmTags,
  };
}

// ─── Route Content ────────────────────────────────────────────────

export const ROUTE_LABELS: Record<Route, string> = {
  TECHNICAL_TAILORING: 'Technical Tailoring Mentorship',
  DIY_BUSINESS_GROWTH: 'DIY Business Growth',
  BUSINESS_GROWTH_MENTORSHIP: 'Business Growth Mentorship',
  DFY_CONSULTATION: 'Done-For-You Consultation',
  NURTURE: 'Workshop Participant',
};

export const ROUTE_ICONS: Record<Route, string> = {
  TECHNICAL_TAILORING: '✂️',
  DIY_BUSINESS_GROWTH: '🚀',
  BUSINESS_GROWTH_MENTORSHIP: '📈',
  DFY_CONSULTATION: '🏗️',
  NURTURE: '🌱',
};

export const ROUTE_COLORS: Record<Route, string> = {
  TECHNICAL_TAILORING:       '#c4614a',
  DIY_BUSINESS_GROWTH:       '#5b7fa6',
  BUSINESS_GROWTH_MENTORSHIP:'#7a5ba6',
  DFY_CONSULTATION:          '#4a8c6a',
  NURTURE:                   '#8c7a5b',
};

export const ROUTE_DESCRIPTIONS: Record<Route, string> = {
  TECHNICAL_TAILORING:
    'Your answers show a clear passion and intent to grow your tailoring craft. The Su Collection Technical Tailoring Mentorship is the most direct route to structured skill development and professional-level capability.',
  DIY_BUSINESS_GROWTH:
    'You have a business in motion and the mindset to implement. The UVA VEC DIY Business Growth program gives you a proven step-by-step roadmap — built for someone exactly like you.',
  BUSINESS_GROWTH_MENTORSHIP:
    'Your business is real and your growth ambitions are serious. The UVA VEC Business Growth Mentorship pairs you with strategic guidance to overcome your bottlenecks and scale with confidence.',
  DFY_CONSULTATION:
    'You have identified a specific requirement your business needs built. Our Done-For-You team will handle the implementation so you can stay focused on running the business.',
  NURTURE:
    'Welcome! We\'re excited to have you at the Free Workshop on 19 September. Our team will be in touch with your access details and any relevant next steps.',
};

export const ROUTE_NEXT_ACTIONS: Record<Route, string> = {
  TECHNICAL_TAILORING:        'Our team will contact you within 24 hours with mentorship program details and next steps.',
  DIY_BUSINESS_GROWTH:        'Check your WhatsApp and email — we\'re sending your personalised DIY Growth roadmap and offer information.',
  BUSINESS_GROWTH_MENTORSHIP: 'We\'ll reach out to schedule your Business Growth Assessment call with a UVA VEC strategist.',
  DFY_CONSULTATION:           'A UVA VEC consultation coordinator will contact you to schedule your discovery session.',
  NURTURE:                    'Watch for your workshop access link via WhatsApp and email before 19 September 2026.',
};

// Live scoring as answers accumulate (used by path indicator)
export function getLiveScores(answers: Partial<QuizAnswers>): Scores {
  const r = calculateScores(answers);
  return r.scores;
}

// Normalise a score to a 0–100 percentage (for progress bars)
export function normaliseScore(score: number, max: number): number {
  return Math.min(100, Math.round((score / max) * 100));
}
