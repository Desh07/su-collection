'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import logoSrc from '../../images/logo.png';
import { useFunnel } from '../contexts/FunnelContext';
import { getNumberedQuestions, QuizQuestion } from '../lib/questions';
import {
  Route,
  Scores,
  ROUTE_LABELS,
  ROUTE_ICONS,
  ROUTE_COLORS,
  ROUTE_DESCRIPTIONS,
  ROUTE_NEXT_ACTIONS,
  getLiveScores,
  normaliseScore,
} from '../lib/scoring';

// ─── Path Indicator Sidebar ──────────────────────────────────────

const PATH_ORDER: Exclude<Route, 'NURTURE'>[] = [
  'TECHNICAL_TAILORING',
  'DIY_BUSINESS_GROWTH',
  'BUSINESS_GROWTH_MENTORSHIP',
  'DFY_CONSULTATION',
];

const PATH_MAX: Record<Exclude<Route, 'NURTURE'>, number> = {
  TECHNICAL_TAILORING:       30,
  DIY_BUSINESS_GROWTH:       30,
  BUSINESS_GROWTH_MENTORSHIP:30,
  DFY_CONSULTATION:          30,
};

function scoreForRoute(route: Exclude<Route, 'NURTURE'>, scores: Scores): number {
  switch (route) {
    case 'TECHNICAL_TAILORING':       return scores.technical;
    case 'DIY_BUSINESS_GROWTH':       return scores.diy;
    case 'BUSINESS_GROWTH_MENTORSHIP':return scores.business;
    case 'DFY_CONSULTATION':          return scores.dfy;
  }
}

function classLabel(route: Exclude<Route, 'NURTURE'>, scores: Scores): string {
  const s = scoreForRoute(route, scores);
  switch (route) {
    case 'TECHNICAL_TAILORING':
      return s >= 24 ? 'High Intent' : s >= 18 ? 'Qualified' : s >= 10 ? 'Potential' : 'Forming…';
    case 'DIY_BUSINESS_GROWTH':
      return s >= 24 ? 'Strong Fit' : s >= 18 ? 'Qualified' : s >= 10 ? 'Possible' : 'Forming…';
    case 'BUSINESS_GROWTH_MENTORSHIP':
      return s >= 25 ? 'High Opportunity' : s >= 18 ? 'Qualified' : s >= 10 ? 'Emerging' : 'Forming…';
    case 'DFY_CONSULTATION':
      return s >= 24 ? 'High Intent' : s >= 18 ? 'Qualified' : s >= 10 ? 'Potential' : 'Forming…';
  }
}

function PathIndicatorPanel({
  liveAnswers,
  questionIndex,
  totalQ,
}: {
  liveAnswers: Record<string, any>;
  questionIndex: number;
  totalQ: number;
}) {
  const scores = getLiveScores(liveAnswers);
  const maxRoute = PATH_ORDER.reduce((best, r) =>
    scoreForRoute(r, scores) > scoreForRoute(best, scores) ? r : best,
    PATH_ORDER[0]
  );
  const hasProgress = questionIndex > 0;
  const leadingScore = scoreForRoute(maxRoute, scores);
  const isLeading = (r: Exclude<Route, 'NURTURE'>) => leadingScore > 0 && r === maxRoute;

  return (
    <aside className="quiz-path-panel">
      <div className="quiz-path-panel-title">Your path is forming</div>

      {PATH_ORDER.map((route) => {
        const score = scoreForRoute(route, scores);
        const pct = normaliseScore(score, PATH_MAX[route]);
        const leading = isLeading(route);
        const color = ROUTE_COLORS[route];

        return (
          <div key={route} className={`path-indicator-row ${leading && hasProgress ? 'leading' : ''}`}>
            <div className="path-indicator-header">
              <div className="path-indicator-icon">{ROUTE_ICONS[route]}</div>
              <div className="path-indicator-name">{ROUTE_LABELS[route]}</div>
              {leading && hasProgress && (
                <span className="path-match-badge">↑ Leading</span>
              )}
            </div>
            <div className="path-indicator-bar-track">
              <div
                className="path-indicator-bar-fill"
                style={{
                  width: `${hasProgress ? pct : 0}%`,
                  background: hasProgress
                    ? `linear-gradient(90deg, ${color}99, ${color})`
                    : 'rgba(219,39,119,0.15)',
                }}
              />
            </div>
            <div className="path-indicator-label">
              {hasProgress ? classLabel(route, scores) : 'Answer questions to see your fit'}
            </div>
          </div>
        );
      })}

      <div className="path-forming-notice">
        <span className="path-forming-dot" />
        {!hasProgress
          ? 'Each answer shapes your personalised path. There are no right or wrong answers.'
          : questionIndex < totalQ
          ? `${totalQ - questionIndex} question${totalQ - questionIndex > 1 ? 's' : ''} left — your path will finalise at the end.`
          : 'Almost done! Your path is ready.'}
      </div>
    </aside>
  );
}

// ─── Contact Block ───────────────────────────────────────────────

const SITUATION_OPTIONS = [
  { value: 'learning',     label: 'I am learning tailoring' },
  { value: 'job',          label: 'I do tailoring as a job or service' },
  { value: 'tailoring-biz',label: 'I run a tailoring or clothing-related business' },
  { value: 'other-biz',    label: 'I run another type of small business' },
  { value: 'planning',     label: 'I am planning to start a business' },
  { value: 'other',        label: 'Other / Not sure yet' },
];

const GOAL_OPTIONS = [
  { value: 'improve-skills',      label: 'Improve my tailoring skills' },
  { value: 'advanced-techniques', label: 'Learn advanced tailoring techniques' },
  { value: 'start-earning',       label: 'Start earning through tailoring' },
  { value: 'grow-tailoring-biz',  label: 'Grow my existing tailoring or clothing business' },
  { value: 'grow-business-online',label: 'Learn how to grow a business online' },
  { value: 'understand-tools',    label: 'Understand what digital tools or systems my business needs' },
];

function CustomSelect({ value, options, onChange, placeholder, hasError, id }: { value: string, options: {value: string, label: string}[], onChange: (val: string) => void, placeholder: string, hasError: boolean, id: string }) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(`#${id}`)) setOpen(false);
    };
    if (open) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open, id]);

  return (
    <div id={id} style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '0.6rem 0.75rem',
          borderRadius: 'var(--r-sm)',
          border: `1.5px solid ${hasError ? '#e53e3e' : 'rgba(219,39,119,0.25)'}`,
          fontSize: '0.875rem',
          color: value ? 'var(--ink)' : 'var(--ink-light)',
          fontFamily: 'var(--font-sans)',
          background: 'white',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'border-color 0.2s',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </div>
      
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'white', border: '1px solid rgba(219,39,119,0.25)',
          borderRadius: 'var(--r-sm)', marginTop: '0.25rem', zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: '200px', overflowY: 'auto'
        }}>
          {options.map(o => (
            <div 
              key={o.value} 
              onClick={() => { onChange(o.value); setOpen(false); }}
              style={{
                padding: '0.6rem 0.75rem', fontSize: '0.875rem', cursor: 'pointer',
                background: value === o.value ? 'rgba(219,39,119,0.1)' : 'transparent',
                color: 'var(--ink)', borderBottom: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactBlock({
  cached,
  onUpdate,
  onNext,
}: {
  cached: Record<string, any>;
  onUpdate: (p: Record<string, any>) => void;
  onNext: (patch?: Record<string, any>) => void;
}) {
  const [name, setName]       = useState<string>(cached.name ?? '');
  const [phone, setPhone]     = useState<string>(cached.phone ?? '');
  const [email, setEmail]     = useState<string>(cached.email ?? '');
  const [location, setLocation] = useState<string>(cached.location ?? '');
  const [situation, setSituation] = useState<string>(cached.currentSituation ?? '');
  const [goal, setGoal]       = useState<string>(cached.primaryGoal ?? '');
  const [consent, setConsent] = useState<boolean>(cached.consent ?? false);
  const [errors, setErrors]   = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())        e.name      = 'Please enter your full name.';
    if (!phone.trim())       e.phone     = 'Please enter your WhatsApp number.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Please enter a valid email.';
    if (!location.trim())    e.location  = 'Please enter your city or district.';
    if (!situation)          e.situation = 'Please select your current situation.';
    if (!goal)               e.goal      = 'Please select your primary goal.';
    if (!consent)            e.consent   = 'Please accept to continue.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const patch = { name, phone, email, location, currentSituation: situation, primaryGoal: goal, consent };
    onUpdate(patch);
    console.log('[CRM] Step 1 — Lead Secured:', patch);
    onNext();
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    padding: '0.6rem 0.75rem',
    borderRadius: 'var(--r-sm)',
    border: `1.5px solid ${errors[field] ? '#e53e3e' : 'rgba(219,39,119,0.25)'}`,
    fontSize: '0.875rem',
    color: 'var(--ink)',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    background: 'white',
    transition: 'border-color 0.2s',
  });

  return (
    <form className="quiz-question contact-form" onSubmit={handleSubmit} noValidate>
      <div className="quiz-q-label">Step 1 of 11 — Registration</div>
      <h2 className="quiz-q-title" style={{ fontSize: 'clamp(1rem, 4vw, 1.35rem)', marginBottom: '1rem', lineHeight: 1.3 }}>
        Register for the Free Workshop
      </h2>

      <div className="contact-grid">
        {/* Name */}
        <div className="cf-field">
          <label className="cf-label">Full Name <span className="cf-req">*</span></label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Kumari Perera" style={inputStyle('name')} />
          {errors.name && <p className="cf-err">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div className="cf-field">
          <label className="cf-label">WhatsApp <span className="cf-req">*</span></label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="077 123 4567" style={inputStyle('phone')} />
          {errors.phone && <p className="cf-err">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="cf-field">
          <label className="cf-label">Email <span className="cf-req">*</span></label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="kumari@gmail.com" style={inputStyle('email')} />
          {errors.email && <p className="cf-err">{errors.email}</p>}
        </div>

        {/* Location */}
        <div className="cf-field">
          <label className="cf-label">District / City <span className="cf-req">*</span></label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)}
            placeholder="Colombo, Kandy…" style={inputStyle('location')} />
          {errors.location && <p className="cf-err">{errors.location}</p>}
        </div>
      </div>

      {/* Situation */}
      <div className="cf-field" style={{ marginBottom: '0.75rem' }}>
        <label className="cf-label">Which best describes you? <span className="cf-req">*</span></label>
        <CustomSelect 
          id="select-situation"
          value={situation} 
          onChange={setSituation} 
          options={SITUATION_OPTIONS} 
          placeholder="Select…" 
          hasError={!!errors.situation} 
        />
        {errors.situation && <p className="cf-err">{errors.situation}</p>}
      </div>

      {/* Goal */}
      <div className="cf-field" style={{ marginBottom: '0.75rem' }}>
        <label className="cf-label">Primary goal for joining? <span className="cf-req">*</span></label>
        <CustomSelect 
          id="select-goal"
          value={goal} 
          onChange={setGoal} 
          options={GOAL_OPTIONS} 
          placeholder="Select…" 
          hasError={!!errors.goal} 
        />
        {errors.goal && <p className="cf-err">{errors.goal}</p>}
      </div>

      {/* Consent */}
      <div className="cf-field" style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
            style={{ marginTop: '2px', accentColor: 'var(--rose)', width: '15px', height: '15px', flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
            I agree to receive workshop updates via WhatsApp &amp; email.
          </span>
        </label>
        {errors.consent && <p className="cf-err" style={{ marginLeft: '1.25rem' }}>{errors.consent}</p>}
      </div>

      <button type="submit" className="btn btn-primary cf-submit">
        Register for Free →
      </button>

      <p style={{ fontSize: '0.7rem', textAlign: 'center', marginTop: '0.5rem', marginBottom: 0, color: 'var(--ink-light)' }}>
        🔒 Your details are kept private.
      </p>
    </form>
  );
}

// ─── Single Choice ───────────────────────────────────────────────

function SingleChoice({
  question,
  selected,
  onSelect,
}: {
  question: QuizQuestion;
  selected: any;
  onSelect: (val: any) => void;
}) {
  return (
    <div className="quiz-question" style={{ animation: 'slideUp 0.3s var(--ease) both' }}>
      <div className="quiz-q-label">{question.stepLabel}</div>
      <h2 className="quiz-q-title">{question.title}</h2>
      <div className="quiz-choices">
        {question.choices?.map(c => (
          <button
            key={`${question.field}-${c.key}`}
            type="button"
            className={`quiz-choice ${selected === c.value ? 'selected' : ''}`}
            onClick={() => onSelect(c.value)}
          >
            <span className="quiz-choice-key">{c.key}</span>
            {c.label}
          </button>
        ))}
      </div>
      {question.hint && (
        <p style={{ fontSize: '0.75rem', color: 'var(--ink-light)', marginBottom: 0, marginTop: '0.25rem' }}>
          ⌨️ {question.hint}
        </p>
      )}
    </div>
  );
}

// ─── Multi Choice ────────────────────────────────────────────────

function MultiChoice({
  question,
  selected,
  onToggle,
  onContinue,
}: {
  question: QuizQuestion;
  selected: string[];
  onToggle: (val: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="quiz-question" style={{ animation: 'slideUp 0.3s var(--ease) both' }}>
      <div className="quiz-q-label">{question.stepLabel}</div>
      <h2 className="quiz-q-title">{question.title}</h2>
      {question.subtitle && <p className="quiz-multi-hint">{question.subtitle}</p>}
      <div className="quiz-choices">
        {question.choices?.map(c => (
          <button
            key={`${question.field}-${c.key}`}
            type="button"
            className={`quiz-choice ${selected.includes(c.value) ? 'selected' : ''}`}
            onClick={() => onToggle(c.value)}
          >
            <span className="quiz-choice-key">{selected.includes(c.value) ? '✓' : c.key}</span>
            {c.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button
          type="button"
          className="quiz-ok-btn"
          onClick={onContinue}
          disabled={selected.length === 0}
          style={{ opacity: selected.length === 0 ? 0.5 : 1 }}
        >
          {selected.length === 0 ? 'Select at least one' : `OK — ${selected.length} selected`}
        </button>
        {selected.length > 0 && <span className="quiz-ok-hint">or press Enter ↵</span>}
      </div>
    </div>
  );
}

// ─── Result Screen ───────────────────────────────────────────────

function ResultScreen() {
  const { result, answers, closeAll } = useFunnel();
  if (!result) return null;

  const route = result.primary;
  const firstName = (answers.name as string | undefined)?.split(' ')[0] ?? 'there';

  return (
    <div style={{ padding: '3rem', animation: 'fadeUp 0.5s var(--ease) both', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1.25rem',
          background: `linear-gradient(135deg, ${ROUTE_COLORS[route]}, ${ROUTE_COLORS[route]}cc)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.2rem', boxShadow: `0 8px 24px ${ROUTE_COLORS[route]}55`,
        }}>
          {ROUTE_ICONS[route]}
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Your path is clear, {firstName}!
        </h2>
        <div style={{
          display: 'inline-block', fontSize: '0.9rem', fontWeight: 700,
          padding: '0.5rem 1.5rem', borderRadius: 'var(--r-full)',
          background: `${ROUTE_COLORS[route]}15`, color: ROUTE_COLORS[route],
          border: `2px solid ${ROUTE_COLORS[route]}40`, marginBottom: '1rem',
        }}>
          {ROUTE_LABELS[route]}
        </div>
        <p style={{ fontSize: '1rem', maxWidth: 500, margin: '0 auto', color: 'var(--ink-muted)', lineHeight: 1.7 }}>
          {ROUTE_DESCRIPTIONS[route]}
        </p>
      </div>



      {/* Secondary routes */}
      {result.secondary.length > 0 && (
        <div style={{
          background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)',
          padding: '1.25rem 1.5rem', marginBottom: '1.5rem',
        }}>
          <p style={{ fontSize: '0.875rem', marginBottom: 0, color: 'var(--ink-muted)' }}>
            <strong style={{ color: 'var(--ink)' }}>Also noted:</strong>{' '}
            We see potential for you in{' '}
            {result.secondary.map(r => ROUTE_LABELS[r]).join(' and ')}.
            Our team will discuss this with you.
          </p>
        </div>
      )}

      {/* Next action */}
      <div style={{
        background: `${ROUTE_COLORS[route]}08`, border: `1px solid ${ROUTE_COLORS[route]}30`,
        borderRadius: 'var(--r-xl)', padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: ROUTE_COLORS[route], marginBottom: '0.5rem' }}>
          📋 What happens next
        </h4>
        <p style={{ fontSize: '0.95rem', marginBottom: 0 }}>{ROUTE_NEXT_ACTIONS[route]}</p>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <button
          className="btn btn-primary btn-lg"
          style={{ background: `linear-gradient(135deg, ${ROUTE_COLORS[route]}, ${ROUTE_COLORS[route]}cc)`, boxShadow: `0 4px 20px ${ROUTE_COLORS[route]}44` }}
          onClick={closeAll}
        >
          Back to Website
        </button>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--ink-light)', marginBottom: 0 }}>
          📅 Free Workshop: <strong>19 September 2026</strong> — Watch for your access link via WhatsApp &amp; email.
        </p>
      </div>
    </div>
  );
}

// ─── VSL Placeholder Component ─────────────────────────────────────

function VSLPlaceholder({
  phase,
  title,
  description,
  onContinue,
}: {
  phase: string;
  title: string;
  description: string;
  onContinue: () => void;
}) {
  return (
    <div className="quiz-question" style={{ animation: 'fadeUp 0.5s var(--ease) both', textAlign: 'center' }}>
      <div className="quiz-q-label">Step {phase === 'step2' ? '2' : '3'} of 3 — {phase === 'step2' ? 'Diagnostic Assessment' : 'Your Personalised Pitch'}</div>
      <h2 className="quiz-q-title" style={{ marginBottom: '1.5rem' }}>{title}</h2>
      
      <div style={{
        background: 'var(--ink)', width: '100%', aspectRatio: '16/9',
        borderRadius: 'var(--r-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: 'white', marginBottom: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '4rem', height: '4rem', borderRadius: '50%', background: 'var(--rose)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem', cursor: 'pointer'
        }}>
          ▶
        </div>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink-light)', fontSize: '0.9rem' }}>Micro-VSL Placeholder ({phase})</p>
      </div>

      <p style={{ color: 'var(--ink-muted)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>{description}</p>
      
      <button className="btn btn-primary btn-lg" onClick={onContinue} style={{ width: '100%' }}>
        Continue to Questions →
      </button>
    </div>
  );
}

// ─── Main Quiz Component ─────────────────────────────────────────

export default function FunnelQuiz() {
  const { mode, answers, updateAnswers, secureLead, submitQuiz, setMode, closeAll } = useFunnel();

  const [qIndex, setQIndex]           = useState(0);
  const [liveAnswers, setLiveAnswers] = useState<Record<string, any>>({});
  const [multiVals, setMultiVals]     = useState<string[]>([]);
  const [watchedVSLs, setWatchedVSLs] = useState<string[]>([]);
  const mainPanelRef                  = useRef<HTMLDivElement>(null);

  const isOpen   = mode.startsWith('step') || mode === 'result';
  const isResult = mode === 'result';
  const currentPhase = mode.split('-')[0]; // 'step1', 'step2', 'step3', or 'result'

  const mergedAnswers = { ...answers, ...liveAnswers };
  
  // Only get questions for the active phase
  const questions = getNumberedQuestions(mergedAnswers, currentPhase);
  const currentQ  = questions[qIndex];

  const answersRef = useRef(mergedAnswers);
  answersRef.current = mergedAnswers;
  const qIndexRef = useRef(qIndex);
  qIndexRef.current = qIndex;

  const showVSL = (currentPhase === 'step2' || currentPhase === 'step3') && !watchedVSLs.includes(currentPhase);

  const scrollTop = useCallback(() => {
    mainPanelRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goNext = useCallback((immediatePatch?: Record<string, any>) => {
    const latestAnswers = immediatePatch 
      ? { ...answersRef.current, ...immediatePatch } 
      : answersRef.current;
      
    const latestQuestions = getNumberedQuestions(latestAnswers, currentPhase);
    const currentIndex = qIndexRef.current;

    if (currentIndex < latestQuestions.length - 1) {
      setQIndex(currentIndex + 1);
      setMultiVals([]);
      scrollTop();
    } else {
      // Phase Transition Logic
      if (currentPhase === 'step1') {
        secureLead(latestAnswers); // Transitions to step2-diagnostic
        setQIndex(0);
      } else if (currentPhase === 'step2') {
        setMode('step3-intent');
        setQIndex(0);
      } else if (currentPhase === 'step3') {
        submitQuiz(latestAnswers);
      }
    }
  }, [secureLead, submitQuiz, setMode, currentPhase, scrollTop]);

  const commitAnswer = useCallback((patch: Record<string, any>) => {
    setLiveAnswers(prev => ({ ...prev, ...patch }));
    updateAnswers(patch);
  }, [updateAnswers]);

  const goPrev = useCallback(() => {
    if (qIndexRef.current > 0) {
      setQIndex(qIndexRef.current - 1);
      scrollTop();
    } else if (currentPhase === 'step3') {
      // Allow going back to step2 from step3
      setMode('step2-diagnostic');
      setQIndex(getNumberedQuestions(answersRef.current, 'step2').length - 1);
    }
  }, [setMode, currentPhase, scrollTop]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isResult || showVSL || !currentQ) return;
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) return;

      if (currentQ.type === 'single-choice' && currentQ.choices) {
        const choice = currentQ.choices.find(c => c.key === e.key.toUpperCase());
        if (choice) {
          const patch = { [currentQ.field]: choice.value };
          if (currentQ.field === 'dfyRequirement') patch.dfySpecific = choice.value === 10;
          commitAnswer(patch);
          setTimeout(() => goNext(), 320);
          return;
        }
      }
      if (currentQ.type === 'multi-choice' && e.key === 'Enter') {
        if (multiVals.length > 0) {
          const patch = { [currentQ.field]: multiVals };
          commitAnswer(patch);
          goNext(patch);
        }
        return;
      }
      if (currentQ.type === 'multi-choice' && currentQ.choices) {
        const choice = currentQ.choices.find(c => c.key === e.key.toUpperCase());
        if (choice) {
          setMultiVals(prev => prev.includes(choice.value) ? prev.filter(v => v !== choice.value) : [...prev, choice.value]);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, isResult, showVSL, currentQ, multiVals, commitAnswer, goNext]);

  if (!isOpen) return null;

  return (
    <div className="quiz-overlay">
      <div className="quiz-backdrop" onClick={closeAll} />
      <div className="quiz-shell-wide">
        <div className="quiz-main-panel" ref={mainPanelRef}>
          <div className="quiz-header-bar">
            <div className="quiz-header-logo">
              <Image src={logoSrc} alt="Su Collection" width={34} height={34} style={{ borderRadius: '50%' }} />
              <span>Su Collection × UVA VEC</span>
            </div>
            {!isResult && !showVSL && (
              <div className="quiz-progress-wrap">
                <div className="quiz-progress-label">
                  {currentPhase === 'step1' 
                    ? 'Registration' 
                    : currentPhase === 'step2'
                      ? `Diagnostic Form — ${Math.min(qIndex + 1, questions.length)} of ${questions.length}`
                      : `Assessment Form — ${Math.min(qIndex + 1, questions.length)} of ${questions.length}`
                  }
                </div>
              </div>
            )}
            <button className="quiz-close-btn" onClick={closeAll} aria-label="Close">✕</button>
          </div>

          {isResult && <ResultScreen />}

          {!isResult && showVSL && currentPhase === 'step2' && (
            <VSLPlaceholder 
              phase="step2"
              title="Let's diagnose your exact situation"
              description="Watch this short video to understand why we ask these questions and how it helps us craft the perfect business or tailoring growth plan for you."
              onContinue={() => {
                setWatchedVSLs(prev => [...prev, 'step2']);
                scrollTop();
              }}
            />
          )}

          {!isResult && showVSL && currentPhase === 'step3' && (
            <VSLPlaceholder 
              phase="step3"
              title="Here's what we recommend"
              description="Based on your answers, we have a few specific ways we can help you grow. Watch this video to see how our mentorship and Done-For-You programs work."
              onContinue={() => {
                setWatchedVSLs(prev => [...prev, 'step3']);
                scrollTop();
              }}
            />
          )}

          {!isResult && !showVSL && currentQ && (
            <>
              {currentQ.type === 'contact-block' && (
                <ContactBlock
                  cached={mergedAnswers}
                  onUpdate={commitAnswer}
                  onNext={(patch?: Record<string,any>) => goNext(patch)}
                />
              )}

              {currentQ.type === 'single-choice' && (
                <SingleChoice
                  question={currentQ}
                  selected={mergedAnswers[currentQ.field]}
                  onSelect={(val) => {
                    const patch: Record<string,any> = { [currentQ.field]: val };
                    if (currentQ.field === 'dfyRequirement') patch.dfySpecific = val === 10;
                    commitAnswer(patch);
                    setTimeout(() => goNext(), 320);
                  }}
                />
              )}

              {currentQ.type === 'multi-choice' && (
                <MultiChoice
                  question={currentQ}
                  selected={multiVals}
                  onToggle={(val) => setMultiVals(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])}
                  onContinue={() => {
                    const patch = { [currentQ.field]: multiVals };
                    commitAnswer(patch);
                    goNext(patch);
                  }}
                />
              )}

              {currentQ.type !== 'contact-block' && (
                <div className="quiz-nav">
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink-light)' }}>
                    {questions.length - 1 - qIndex > 0 ? `${questions.length - 1 - qIndex} questions remaining in this phase` : 'Last question of this phase!'}
                  </span>
                  <div className="quiz-nav-arrows">
                    <button className="quiz-nav-arrow" onClick={goPrev} disabled={currentPhase === 'step2' && qIndex === 0} title="Back">↑</button>
                    <button className="quiz-nav-arrow" onClick={goNext} title="Skip / Next">↓</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {!isResult && (
          <PathIndicatorPanel
            liveAnswers={mergedAnswers}
            questionIndex={currentPhase === 'step1' ? 0 : currentPhase === 'step2' ? qIndex + 1 : qIndex + 10}
            totalQ={20} // arbitrary high number for visual progress
          />
        )}
      </div>
    </div>
  );
}
