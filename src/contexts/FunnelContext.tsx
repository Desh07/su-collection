'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { QuizAnswers, RouteResult, calculateScores } from '../lib/scoring';

export type FunnelMode = 'website' | 'entry-popup' | 'quiz' | 'result';

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
  closeAll: () => void;
  updateAnswers: (patch: Partial<QuizAnswers>) => void;
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
    setState(s => ({ ...s, mode: 'quiz' })), []);

  const closeAll = useCallback(() =>
    setState(s => ({ ...s, mode: 'website' })), []);

  const updateAnswers = useCallback((patch: Partial<QuizAnswers>) =>
    setState(s => ({ ...s, answers: { ...s.answers, ...patch } as Partial<QuizAnswers> })), []);

  const submitQuiz = useCallback((finalAnswers: Partial<QuizAnswers>) => {
    setState(s => {
      const merged = { ...s.answers, ...finalAnswers } as Partial<QuizAnswers>;
      const result = calculateScores(merged);

      // ── CRM Mock log (replace with real API call in production)
      console.log('═══════════════════════════════════');
      console.log('[CRM] Lead Submitted');
      console.log('  Name:    ', merged.name);
      console.log('  Phone:   ', merged.phone);
      console.log('  Email:   ', merged.email);
      console.log('  Location:', merged.location);
      console.log('  Situation:', merged.currentSituation);
      console.log('  Goal:    ', merged.primaryGoal);
      console.log('  Scores →  Technical:', result.scores.technical,
        '| Business:', result.scores.business,
        '| DIY:', result.scores.diy,
        '| DFY:', result.scores.dfy);
      console.log('  Primary Route:', result.primary);
      console.log('  Secondary:    ', result.secondary);
      console.log('  CRM Tags:     ', result.crmTags);
      console.log('═══════════════════════════════════');

      return { ...s, answers: merged, result, mode: 'result' };
    });
  }, []);

  return (
    <FunnelContext.Provider value={{
      mode: state.mode,
      answers: state.answers,
      result: state.result,
      openPopup,
      startQuiz,
      closeAll,
      updateAnswers,
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
