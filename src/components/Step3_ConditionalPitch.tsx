'use client';

import React from 'react';
import { useFunnel } from '../contexts/FunnelContext';

export default function Step3_ConditionalPitch() {
  const { scoringResult, nextStep } = useFunnel();

  if (!scoringResult) return null;

  const { primaryRoute } = scoringResult;

  const getPitchContent = () => {
    switch (primaryRoute) {
      case 'TECHNICAL_TAILORING':
        return {
          title: 'Technical Tailoring Mentorship',
          desc: 'Based on your skills, our mentorship program is the perfect next step to elevate your tailoring craft to a professional level.',
          vslText: '[ Technical Mentorship Pitch VSL ]'
        };
      case 'DIY_BUSINESS_GROWTH':
        return {
          title: 'DIY Business Growth MVP',
          desc: 'You have the foundation. Now, learn the step-by-step framework to grow your business online, at your own pace.',
          vslText: '[ DIY Business Pitch VSL ]'
        };
      case 'BUSINESS_GROWTH_MENTORSHIP':
        return {
          title: 'Business Growth Mentorship',
          desc: 'Your business is ready for the next level. Let our experts guide you personally to scale your operations and sales.',
          vslText: '[ Business Mentorship Pitch VSL ]'
        };
      case 'DFY_CONSULTATION':
        return {
          title: 'Done-For-You Services',
          desc: 'Focus on what you do best. Let our technical team build and implement the digital systems you need to thrive.',
          vslText: '[ Done-For-You Pitch VSL ]'
        };
      default:
        return {
          title: 'Welcome to the Community',
          desc: 'We are thrilled to have you in the workshop. We have plenty of resources to help you on your journey.',
          vslText: '[ Welcome VSL ]'
        };
    }
  };

  const content = getPitchContent();

  const handleIntent = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="glass-container">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '75%' }}></div>
      </div>

      <div className="text-center mb-8">
        <h2 style={{ color: 'var(--color-primary)' }}>{content.title}</h2>
        <p>{content.desc}</p>
        
        {/* Conditional VSL Placeholder */}
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.9))',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 600,
          marginBottom: '2rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
        }}>
          {content.vslText}
        </div>
      </div>

      <form onSubmit={handleIntent}>
        <div className="form-group text-center">
          <label className="form-label" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Are you interested in exploring this path?
          </label>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, maxWidth: '200px' }}>
              Yes, tell me more
            </button>
            <button type="button" onClick={() => nextStep()} className="btn btn-outline" style={{ flex: 1, maxWidth: '200px' }}>
              Not right now
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
