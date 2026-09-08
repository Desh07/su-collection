'use client';

import React, { useState } from 'react';
import { useFunnel } from '../contexts/FunnelContext';

export default function Step1_LandingPage() {
  const { setRegistrationData, nextStep } = useFunnel();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    currentSituation: '',
    primaryGoal: '',
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("Please agree to the communication terms.");
      return;
    }
    
    setRegistrationData(formData);
    // In a real app, this is where we'd instantly create the CRM Lead record.
    console.log("Mock CRM: Lead Created ->", formData);
    nextStep();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  return (
    <div className="glass-container">
      <div className="text-center mb-8">
        <h1 style={{ color: 'var(--color-primary)' }}>Free Workshop</h1>
        <h2>Su Collection × UVA VEC</h2>
        <p>19 September 2026</p>
        <p>Discover your path to tailoring excellence and business growth.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input required type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Primary Phone / WhatsApp *</label>
          <input required type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input required type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">District / City *</label>
          <input required type="text" name="location" className="form-input" value={formData.location} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Current Primary Situation *</label>
          <select required name="currentSituation" className="form-select" value={formData.currentSituation} onChange={handleChange}>
            <option value="" disabled>Select your situation...</option>
            <option value="learning">I am learning tailoring.</option>
            <option value="job">I do tailoring as a job or service.</option>
            <option value="tailoring-business">I run a tailoring or clothing-related business.</option>
            <option value="other-business">I run another type of small business.</option>
            <option value="planning">I am planning to start a business.</option>
            <option value="other">Other / Not sure yet.</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Primary Goal for Joining *</label>
          <select required name="primaryGoal" className="form-select" value={formData.primaryGoal} onChange={handleChange}>
            <option value="" disabled>Select your goal...</option>
            <option value="improve-skills">Improve my tailoring skills.</option>
            <option value="advanced-techniques">Learn advanced tailoring techniques.</option>
            <option value="start-earning">Start earning through tailoring.</option>
            <option value="grow-business">Grow my existing tailoring or clothing business.</option>
            <option value="learn-online">Learn how to grow a business online.</option>
            <option value="understand-tools">Understand what digital tools or systems my business needs.</option>
          </select>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input required type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} />
          <span style={{ fontSize: '0.9rem' }}>I agree to receive communications regarding this workshop and relevant next steps.</span>
        </div>

        <div className="text-center mt-8">
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Secure My Spot</button>
        </div>
      </form>
    </div>
  );
}
