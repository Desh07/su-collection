'use client';

import React from 'react';
import { useFunnel } from '../contexts/FunnelContext';

export default function Step4_Confirmation() {
  const { scoringResult } = useFunnel();

  const primaryRoute = scoringResult?.primaryRoute || 'NURTURE';

  const getConfirmationMessage = () => {
    switch (primaryRoute) {
      case 'TECHNICAL_TAILORING':
        return 'Your interest in the Technical Mentorship has been recorded. We will send you the application details shortly.';
      case 'DIY_BUSINESS_GROWTH':
        return 'Awesome! Check your email for a special offer to access the DIY Business Growth toolkit.';
      case 'BUSINESS_GROWTH_MENTORSHIP':
        return 'We have received your mentorship application request. Our team will contact you to schedule your assessment.';
      case 'DFY_CONSULTATION':
        return 'Your request for a Done-For-You consultation is confirmed. A coordinator will reach out to schedule our call.';
      default:
        return 'You are all set for the workshop. See you on 19 September 2026!';
    }
  };

  return (
    <div className="glass-container text-center animate-fade-in">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '100%' }}></div>
      </div>

      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'var(--color-primary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 2rem',
        fontSize: '2rem'
      }}>
        ✓
      </div>
      
      <h1>Registration Confirmed!</h1>
      <p style={{ fontSize: '1.1rem', margin: '1.5rem 0' }}>
        {getConfirmationMessage()}
      </p>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)' }}>
        <h3 style={{ color: 'var(--color-primary-hover)', marginBottom: '0.5rem' }}>Next Step</h3>
        <p style={{ margin: 0 }}>Please check your email and WhatsApp for your workshop access links.</p>
      </div>
    </div>
  );
}
