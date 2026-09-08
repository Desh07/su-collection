'use client';

import React, { useState } from 'react';
import { useFunnel } from '../contexts/FunnelContext';

export default function Step2_Diagnostic() {
  const { completeDiagnostic, updateDiagnosticData } = useFunnel();
  
  const [skillLevel, setSkillLevel] = useState<number>(0);
  const [businessStatus, setBusinessStatus] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app we'd map responses to proper sub-scores as per specification.
    // Simplifying here to represent the flow and trigger routing logic.
    updateDiagnosticData({
      tailoringSkill: skillLevel,
      businessOwnership: businessStatus > 0 ? 10 : 0,
      businessMaturity: businessStatus,
      technicalInterest: skillLevel < 10 ? 8 : 4,
      mentorshipInterest: businessStatus > 5 ? 8 : 2,
    });
    
    completeDiagnostic();
  };

  return (
    <div className="glass-container">
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '50%' }}></div>
      </div>

      <div className="text-center mb-8">
        <h2>Help us personalize your experience</h2>
        <p>Watch this quick message from our team, then answer a few questions below.</p>
        
        {/* VSL Placeholder */}
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.2), rgba(236, 72, 153, 0.4))',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary-hover)',
          fontWeight: 600,
          marginBottom: '2rem'
        }}>
          [ Micro-VSL Video Placeholder ]
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">How would you describe your current tailoring skill level?</label>
          <div className="radio-group">
            {[
              { val: 3, label: 'Beginner / Just starting' },
              { val: 5, label: 'I know basic tailoring but want to improve' },
              { val: 8, label: 'I regularly do tailoring for myself or others' },
              { val: 10, label: 'I work professionally as a tailor' },
            ].map(opt => (
              <label key={opt.val} className="radio-label">
                <input 
                  type="radio" 
                  name="skill" 
                  className="radio-input"
                  value={opt.val}
                  checked={skillLevel === opt.val}
                  onChange={() => setSkillLevel(opt.val)}
                  required
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group mt-8">
          <label className="form-label">Which best describes your business?</label>
          <div className="radio-group">
            {[
              { val: 0, label: 'No business, just learning' },
              { val: 1, label: 'Idea stage / Planning' },
              { val: 4, label: 'Started but inconsistent' },
              { val: 8, label: 'Regular customers but limited growth' },
              { val: 10, label: 'Stable business seeking growth' },
            ].map(opt => (
              <label key={opt.val} className="radio-label">
                <input 
                  type="radio" 
                  name="business" 
                  className="radio-input"
                  value={opt.val}
                  checked={businessStatus === opt.val}
                  onChange={() => setBusinessStatus(opt.val)}
                  required
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Continue</button>
        </div>
      </form>
    </div>
  );
}
