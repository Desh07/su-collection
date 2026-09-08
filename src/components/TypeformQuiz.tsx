'use client';

import React, { useState, useEffect } from 'react';
import { useFunnel } from '../contexts/FunnelContext';

type Question = {
  id: string;
  type: 'choice' | 'text' | 'email' | 'tel';
  title: string;
  choices?: { label: string; value: any; key: string }[];
  field?: string;
};

const questions: Question[] = [
  {
    id: 'start',
    type: 'choice', // using choice format but just a start button
    title: 'Are you operating like a Hobbyist or a Business Owner?',
    choices: []
  },
  {
    id: 'q1',
    type: 'choice',
    title: 'How would you describe your current tailoring skill level?',
    field: 'tailoringSkill',
    choices: [
      { key: 'A', label: 'Beginner / Just starting', value: 3 },
      { key: 'B', label: 'I know basic tailoring but want to improve', value: 5 },
      { key: 'C', label: 'I regularly do tailoring for myself or others', value: 8 },
      { key: 'D', label: 'I work professionally as a tailor', value: 10 }
    ]
  },
  {
    id: 'q2',
    type: 'choice',
    title: 'Which best describes your business status?',
    field: 'businessStatus',
    choices: [
      { key: 'A', label: 'No business, just learning', value: 0 },
      { key: 'B', label: 'Idea stage / Planning', value: 1 },
      { key: 'C', label: 'Started but inconsistent', value: 4 },
      { key: 'D', label: 'Regular customers but limited growth', value: 8 },
      { key: 'E', label: 'Stable business seeking growth', value: 10 }
    ]
  },
  {
    id: 'q3',
    type: 'choice',
    title: 'If you received a clear step-by-step plan, would you be comfortable implementing improvements yourself?',
    field: 'diyInterest',
    choices: [
      { key: 'A', label: 'No, I need someone to guide or do it with me', value: 0 },
      { key: 'B', label: 'Maybe, depending on the difficulty', value: 4 },
      { key: 'C', label: 'Yes, with a clear guide and templates', value: 8 },
      { key: 'D', label: 'Yes, I prefer learning and implementing myself', value: 10 }
    ]
  },
  {
    id: 'name',
    type: 'text',
    title: 'Great! Let\'s get your details. What is your full name?',
    field: 'name'
  },
  {
    id: 'email',
    type: 'email',
    title: 'What is your best email address to send your custom roadmap?',
    field: 'email'
  }
];

export default function TypeformQuiz() {
  const { step, updateDiagnosticData, completeDiagnostic } = useFunnel();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [textInput, setTextInput] = useState('');

  const currentQ = questions[currentIndex];

  const handleChoice = (val: any) => {
    if (currentQ.field) {
      setAnswers(prev => ({ ...prev, [currentQ.field!]: val }));
    }
    // Auto advance on choice
    setTimeout(handleNext, 300);
  };

  const handleNext = () => {
    if (currentQ.type === 'text' || currentQ.type === 'email' || currentQ.type === 'tel') {
      setAnswers(prev => ({ ...prev, [currentQ.field!]: textInput }));
      setTextInput('');
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finish quiz
      updateDiagnosticData({
        tailoringSkill: answers.tailoringSkill,
        businessOwnership: answers.businessStatus > 0 ? 10 : 0,
        businessMaturity: answers.businessStatus,
        diyInterest: answers.diyInterest
      });
      // Mock registration data save
      console.log("Mock Registration Save:", { name: answers.name, email: answers.email });
      completeDiagnostic();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (currentQ.type === 'choice' && currentQ.choices) {
      const choice = currentQ.choices.find(c => c.key === e.key.toUpperCase());
      if (choice) {
        handleChoice(choice.value);
      }
    }
    if (e.key === 'Enter' && currentQ.type !== 'choice') {
      handleNext();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, textInput]);

  return (
    <div className="typeform-container">
      <div className="quiz-header">
        Su Collection × UVA VEC
      </div>

      <div className="question-card" key={currentQ.id}>
        {currentIndex === 0 ? (
          <div className="text-center">
            <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>
              {currentQ.title}
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--color-text-main)' }}>
              This quick assessment will help you understand where your biggest gaps are in growing your tailoring income.<br/><br/>
              Answer each question honestly to receive a custom roadmap that you can actually act on.
            </p>
            <button className="btn btn-primary" onClick={handleNext} style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
              Start
            </button>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>⏱ Takes 3 minutes</p>
          </div>
        ) : (
          <div>
            <h2 className="question-title">
              <span style={{ color: 'var(--color-primary)', marginRight: '1rem' }}>{currentIndex}.</span>
              {currentQ.title}
            </h2>

            {currentQ.type === 'choice' && (
              <div className="choice-list">
                {currentQ.choices?.map(c => (
                  <button 
                    key={c.key} 
                    className={`choice-btn ${answers[currentQ.field!] === c.value ? 'selected' : ''}`}
                    onClick={() => handleChoice(c.value)}
                  >
                    <span className="choice-key">{c.key}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {(currentQ.type === 'text' || currentQ.type === 'email' || currentQ.type === 'tel') && (
              <div style={{ marginBottom: '2rem' }}>
                <input 
                  type={currentQ.type}
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder="Type your answer here..."
                  style={{
                    width: '100%', fontSize: '1.5rem', padding: '1rem 0',
                    border: 'none', borderBottom: '2px solid var(--color-primary)',
                    background: 'transparent', color: 'var(--color-text-main)',
                    outline: 'none'
                  }}
                  autoFocus
                />
              </div>
            )}

            {currentQ.type !== 'choice' && (
              <button className="btn btn-primary" onClick={handleNext} style={{ marginTop: '1rem' }}>
                OK
              </button>
            )}
          </div>
        )}
      </div>

      {currentIndex > 0 && (
        <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
            style={{ 
              background: 'white', border: '1px solid #ccc', borderRadius: '4px', 
              width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ↑
          </button>
          <button 
            onClick={handleNext}
            style={{ 
              background: 'white', border: '1px solid #ccc', borderRadius: '4px', 
              width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ↓
          </button>
        </div>
      )}
    </div>
  );
}
