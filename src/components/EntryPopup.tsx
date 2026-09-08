'use client';

import React from 'react';
import Image from 'next/image';
import logoSrc from '../../images/logo.png';
import { useFunnel } from '../contexts/FunnelContext';

export default function EntryPopup() {
  const { mode, closeAll, startQuiz } = useFunnel();

  if (mode !== 'entry-popup') return null;

  return (
    <div className="quiz-overlay animate-fade-in">
      <div className="quiz-backdrop" onClick={closeAll} />

      <div className="entry-popup">
        {/* Close button — always visible */}
        <button className="entry-popup-close" onClick={closeAll} aria-label="Close">✕</button>

        {/* Logo row */}
        <div className="ep-logo-row">
          <Image
            src={logoSrc}
            alt="Su Collection"
            width={52}
            height={52}
            style={{ borderRadius: '50%', border: '3px solid var(--rose-light)', flexShrink: 0 }}
            priority
          />
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', lineHeight: 1.2 }}>
              Su Collection × UVA VEC
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-light)', marginTop: '0.15rem' }}>
              Free Workshop • 19 September 2026
            </div>
          </div>
        </div>

        {/* Tag */}
        <div className="entry-popup-tag" style={{ marginBottom: '0.75rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--rose)', display: 'inline-block', flexShrink: 0 }} />
          🎓 Free Tailoring &amp; Business Workshop
        </div>

        {/* Headline */}
        <h2 className="ep-title">
          Are you building a <em>hobby</em> or a <em>business?</em>
        </h2>

        {/* Description */}
        <p className="ep-desc">
          Take a 5-minute quiz to discover your tailoring &amp; business path — and get a{' '}
          <strong>personalised roadmap</strong> for what to do next.
        </p>

        {/* CTA */}
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.97rem' }}
          onClick={startQuiz}
        >
          Register for Free →
        </button>

        {/* Meta */}
        <div className="ep-meta">
          <span>⏱ 5 min</span>
          <span>🔒 Private</span>
          <span>🎁 Personalised</span>
        </div>
      </div>
    </div>
  );
}
