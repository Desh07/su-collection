'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { QuizAnswers, RouteResult, calculateScores } from '../lib/scoring';
import { getActiveQuestions } from '../lib/questions';

export type FunnelMode = 'website' | 'entry-popup' | 'step1-contact' | 'step2-diagnostic' | 'step3-intent' | 'result';

interface FunnelState {
  mode: FunnelMode;
  answers: Partial<QuizAnswers>;
  result: RouteResult | null;
}

interface FunnelContextValue {
  mode: FunnelMode;
  answers: Partial<QuizAnswers>;
  result: RouteResult | null;
  openPopup: () => void;
  startQuiz: () => void;
  setMode: (mode: FunnelMode) => void;
  closeAll: () => void;
  updateAnswers: (patch: Partial<QuizAnswers>) => void;
  secureLead: (answers: Partial<QuizAnswers>) => void;
  submitQuiz: (finalAnswers: Partial<QuizAnswers>) => void;
}

const FunnelContext = createContext<FunnelContextValue | undefined>(undefined);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FunnelState>({
    mode: 'website',
    answers: {},
    result: null,
  });

  const openPopup = useCallback(() =>
    setState(s => ({ ...s, mode: 'entry-popup' })), []);

  const startQuiz = useCallback(() =>
    setState(s => ({ ...s, mode: 'step1-contact' })), []);

  const setMode = useCallback((mode: FunnelMode) =>
    setState(s => ({ ...s, mode })), []);

  const closeAll = useCallback(() =>
    setState(s => ({ ...s, mode: 'website' })), []);

  const updateAnswers = useCallback((patch: Partial<QuizAnswers>) => {
    setState(s => {
      const merged = { ...s.answers, ...patch } as Partial<QuizAnswers>;
      
      // Stale Answer Clearing Logic
      const activeQuestions = getActiveQuestions(merged);
      const activeFields = activeQuestions.map(q => q.field);
      
      // Allow fields that aren't mapped directly to questions (like name, phone, etc.)
      const contactFields = ['name', 'phone', 'email', 'location', 'currentSituation', 'primaryGoal', 'consent', 'dfySpecific'];
      
      const scrubbed = { ...merged };
      for (const key of Object.keys(scrubbed)) {
        if (!contactFields.includes(key) && !activeFields.includes(key)) {
          delete scrubbed[key as keyof QuizAnswers];
        }
      }

      return { ...s, answers: scrubbed };
    });
  }, []);

  const secureLead = useCallback((patch: Partial<QuizAnswers>) => {
    setState(s => {
      const merged = { ...s.answers, ...patch } as Partial<QuizAnswers>;
      console.log('═══════════════════════════════════');
      console.log('[CRM API MOCK] Step 1 — Lead Secured');
      console.log('  Name:    ', merged.name);
      console.log('  Phone:   ', merged.phone);
      console.log('  Email:   ', merged.email);
      console.log('  Location:', merged.location);
      console.log('  Situation:', merged.currentSituation);
      console.log('  Goal:    ', merged.primaryGoal);
      console.log('═══════════════════════════════════');
      return { ...s, answers: merged, mode: 'step2-diagnostic' };
    });
  }, []);

  const submitQuiz = useCallback((finalAnswers: Partial<QuizAnswers>) => {
    setState(s => {
      const merged = { ...s.answers, ...finalAnswers } as Partial<QuizAnswers>;
      
      // Final stale clear before scoring
      const activeQuestions = getActiveQuestions(merged);
      const activeFields = activeQuestions.map(q => q.field);
      const contactFields = ['name', 'phone', 'email', 'location', 'currentSituation', 'primaryGoal', 'consent', 'dfySpecific'];
      const scrubbed = { ...merged };
      for (const key of Object.keys(scrubbed)) {
        if (!contactFields.includes(key) && !activeFields.includes(key)) {
          delete scrubbed[key as keyof QuizAnswers];
        }
      }

      const result = calculateScores(scrubbed);

      console.log('═══════════════════════════════════');
      console.log('[CRM API MOCK] Step 3 — Final Intent & Qualification');
      console.log('  Scores →  Technical:', result.scores.technical,
        '| Business:', result.scores.business,
        '| DIY:', result.scores.diy,
        '| DFY:', result.scores.dfy);
      console.log('  Primary Route:', result.primary);
      console.log('  Secondary:    ', result.secondary);
      console.log('  CRM Tags:     ', result.crmTags);
      console.log('═══════════════════════════════════');

      return { ...s, answers: scrubbed, result, mode: 'result' };
    });
  }, []);

  return (
    <FunnelContext.Provider value={{
      mode: state.mode,
      answers: state.answers,
      result: state.result,
      openPopup,
      startQuiz,
      setMode,
      closeAll,
      updateAnswers,
      secureLead,
      submitQuiz,
    }}>
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnel(): FunnelContextValue {
  const ctx = useContext(FunnelContext);
  if (!ctx) throw new Error('useFunnel must be used within FunnelProvider');
  return ctx;
}
