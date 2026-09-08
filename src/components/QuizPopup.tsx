'use client';

import React from 'react';
import { useFunnel } from '../contexts/FunnelContext';

export default function QuizPopup() {
  const { step, closeFunnel, setStep } = useFunnel();

  if (step !== 1) return null;

  return (
    <div className="modal-overlay">
      <div className="quiz-popup">
        <button className="popup-close" onClick={closeFunnel}>&times;</button>
        
        <div className="popup-image">
          {/* Placeholder for the image in Reference 1 */}
          <div style={{
            width: '100%', height: '100%', 
            background: 'linear-gradient(145deg, #fce7f3, #fbcfe8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#be185d', fontWeight: 600, fontSize: '1.2rem', padding: '2rem', textAlign: 'center'
          }}>
            [ Portrait Image Placeholder ]
          </div>
        </div>
        
        <div className="popup-content">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#831843', lineHeight: 1.1 }}>
            QUIZ: ARE YOU BUILDING A HOBBY OR A BUSINESS?
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', color: '#4a044e' }}>
            In 5 minutes, find out where you're running your tailoring like a hobby instead of leading it like a business owner. Plus, get a <strong>free custom roadmap</strong> designed to fix the one thing holding you back most.
          </p>
          <button 
            className="btn btn-primary" 
            style={{ alignSelf: 'flex-start', padding: '1.2rem 2.5rem', fontSize: '1.2rem' }}
            onClick={() => setStep(2)}
          >
            TAKE THE QUIZ
          </button>
        </div>
      </div>
    </div>
  );
}
