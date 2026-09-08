'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import logoSrc from '../../images/logo.png';
import { FunnelProvider, useFunnel } from '../contexts/FunnelContext';
import EntryPopup from '../components/EntryPopup';
import FunnelQuiz from '../components/FunnelQuiz';

// ─── Navbar ──────────────────────────────────────────────────────
function Navbar() {
  const { openPopup } = useFunnel();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? '0 2px 20px rgba(219,39,119,0.1)' : 'none' }}>
      <div className="container">
        <div className="navbar-inner">
          <a href="#" className="navbar-logo">
            <Image src={logoSrc} alt="Su Collection Logo" width={48} height={48} priority />
            <div className="navbar-brand-text">
              <span>Su Collection</span>
              <span>× UVA VEC</span>
            </div>
          </a>

          <ul className="navbar-links">
            <li><a href="#about">About</a></li>
            <li><a href="#paths">Your Path</a></li>
            <li><a href="#learn">Workshop</a></li>
            <li><a href="#testimonials">Community</a></li>
          </ul>

          <button className="btn btn-primary" onClick={openPopup} style={{ padding: '0.7rem 1.5rem', fontSize: '0.9rem' }}>
            Register →
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────
function HeroSection() {
  const { openPopup } = useFunnel();

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-bg-circle hero-bg-circle-1" />
      <div className="hero-bg-circle hero-bg-circle-2" />

      <div className="container">
        <div className="hero-grid">
          {/* Left content */}
          <div>
            <div className="hero-eyebrow animate-fade-up">
              <span className="hero-eyebrow-dot" />
              Free Workshop — 19 September 2026
            </div>

            <h1 className="hero-title animate-fade-up delay-100">
              Master Your Craft.<br />
              <em>Build Your Business.</em>
            </h1>

            <p className="hero-desc animate-fade-up delay-200">
              Join Swarna Herathi's free community workshop where technical tailoring excellence
              meets real business growth. Discover exactly which path is right for you.
            </p>

            <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={openPopup}>
                Find Your Path — Free Quiz
              </button>
              <a href="#learn" className="btn btn-outline btn-lg">
                What You'll Learn
              </a>
            </div>

            <div className="hero-badges animate-fade-up delay-400">
              <div className="hero-badge">
                <span className="hero-badge-icon">🎓</span>
                Free to attend
              </div>
              <div className="hero-badge">
                <span className="hero-badge-icon">✂️</span>
                All skill levels
              </div>
              <div className="hero-badge">
                <span className="hero-badge-icon">📍</span>
                Online — Sri Lanka
              </div>
            </div>
          </div>

          {/* Right card */}
          <div className="hero-visual animate-scale-in delay-200">
            <div className="hero-spots">🔥 Limited spots</div>
            <div className="hero-card">
              <div className="hero-card-date">
                <div className="hero-card-date-box">
                  <span>19</span>
                  <span>Sept</span>
                </div>
                <div className="hero-card-date-text">
                  <h4>Free Workshop 2026</h4>
                  <p>Su Collection × UVA VEC</p>
                </div>
              </div>

              <ul className="hero-card-features">
                {[
                  'Technical tailoring techniques & methods',
                  'How to turn your skill into an income',
                  'What\'s holding your business back — and how to fix it',
                  'Personalised route for your next step',
                ].map((f, i) => (
                  <li key={i} className="hero-card-feature">
                    <span className="hero-card-feature-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="hero-card-cta">
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={openPopup}>
                  Register for Free →
                </button>
                <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--ink-light)', marginBottom: 0 }}>
                  No cost. No catch. Just value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="about-grid">
          {/* Left — visual */}
          <div className="about-img-wrapper animate-slide-right">
            <div className="about-img-bg" />
            <div className="about-img">
              <Image src={logoSrc} alt="Swarna Herathi" width={220} height={220} style={{ borderRadius: '50%' }} />
              <div className="about-stat-badge about-stat-badge-1">
                <span className="stat-num">10K+</span>
                <span className="stat-label">Community Members</span>
              </div>
              <div className="about-stat-badge about-stat-badge-2">
                <span className="stat-num">5+</span>
                <span className="stat-label">Years Teaching</span>
              </div>
            </div>
          </div>

          {/* Right — content */}
          <div className="animate-fade-up">
            <div className="about-tag">✂️ About Su Collection</div>
            <h2>Trusted by Thousands of Sinhala-Speaking Tailors</h2>
            <p>
              Swarna Herathi built Su Collection around a simple belief: every person who loves tailoring
              deserves access to <strong>structured, practical knowledge</strong> taught in their own language.
            </p>
            <p>
              Over the years, Su Collection has grown into one of the most trusted communities for tailoring tips,
              techniques, designs and business guidance for Sinhala-speaking creators.
            </p>

            <ul className="about-features">
              {[
                { icon: '🎯', title: 'Practical Technique Focus', desc: 'Real methods you can apply immediately — not theory.' },
                { icon: '🗣️', title: 'Sinhala-First Teaching', desc: 'Explained clearly in your language, for your context.' },
                { icon: '🤝', title: 'Community Driven', desc: 'Learn alongside thousands who share your passion.' },
                { icon: '📈', title: 'Business Aware', desc: 'From skill to income to growth — the full journey.' },
              ].map((f) => (
                <li key={f.title} className="about-feature">
                  <div className="about-feature-icon">{f.icon}</div>
                  <div className="about-feature-text">
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Paths / Offer Architecture ───────────────────────────────────
function PathsSection() {
  const { openPopup } = useFunnel();

  const paths = [
    {
      icon: '✂️',
      title: 'Technical Tailoring Mentorship',
      desc: 'Structured 6-week mentorship to elevate your tailoring skills from good to professional.',
      tag: 'Su Collection',
      featured: false,
    },
    {
      icon: '🚀',
      title: 'DIY Business Growth',
      desc: 'A self-paced step-by-step roadmap to take your business online and start growing customers.',
      tag: 'UVA VEC',
      featured: true,
    },
    {
      icon: '📈',
      title: 'Business Growth Mentorship',
      desc: 'Personalised strategic guidance for business owners with real growth ambitions.',
      tag: 'UVA VEC',
      featured: false,
    },
    {
      icon: '🏗️',
      title: 'Done-For-You Services',
      desc: 'Let our expert team build your digital presence, sales systems and business tools.',
      tag: 'UVA VEC',
      featured: false,
    },
  ];

  return (
    <section id="paths" className="section" style={{ background: 'var(--blush)' }}>
      <div className="container">
        <div className="section-header centered">
          <div className="section-eyebrow">🗺️ Your Path</div>
          <h2>One Workshop. Four Personalised Paths.</h2>
          <p>
            Everyone who registers goes through a short assessment. Based on your unique situation,
            you're guided toward the path that actually fits your needs — not a one-size-fits-all solution.
          </p>
        </div>

        <div className="paths-grid">
          {paths.map((p) => (
            <div key={p.title} className={`path-card ${p.featured ? 'featured' : ''}`}>
              <div className="path-card-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="path-tag">{p.tag}</div>
            </div>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: '3rem' }}>
          <p style={{ marginBottom: '1.5rem' }}>Not sure which path fits you? Take the free 5-minute quiz.</p>
          <button className="btn btn-primary btn-lg" onClick={openPopup}>
            Discover Your Path
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── What You'll Learn ────────────────────────────────────────────
function LearnSection() {
  const items = [
    { num: '01', title: 'Technical Foundations', desc: 'Core principles, preparation and the methods behind professional tailoring work.' },
    { num: '02', title: 'Construction Techniques', desc: 'Improve your execution of key techniques through demonstration and guided practice.' },
    { num: '03', title: 'Design Understanding', desc: 'Learn to analyse a garment design and make confident construction decisions.' },
    { num: '04', title: 'Common Problems & Fixes', desc: 'Identify, understand and troubleshoot the most frequent tailoring mistakes.' },
    { num: '05', title: 'Business Basics', desc: 'How to move from doing tailoring → earning from it → growing a structured business.' },
    { num: '06', title: 'Your Personalised Next Step', desc: 'Leave with clarity on what to focus on next — technical, business or both.' },
  ];

  return (
    <section id="learn" className="section">
      <div className="container">
        <div className="section-header centered">
          <div className="section-eyebrow">📚 Free Workshop</div>
          <h2>What You&apos;ll Discover on 19 September</h2>
          <p>A live, structured session covering both the technical and business sides of tailoring — delivered in Sinhala.</p>
        </div>

        <div className="learn-grid">
          {items.map((item) => (
            <div key={item.num} className="learn-item">
              <div className="learn-num">{item.num}</div>
              <div className="learn-text">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    {
      text: '"I followed Su Collection for two years before joining the workshop. The teaching style is clear, practical and feels like learning from a real expert — not just watching videos."',
      name: 'Dilhani R.',
      role: 'Home-based Tailor, Kandy',
      emoji: '💜',
    },
    {
      text: '"I had basic skills but never knew how to price my work or find customers. The workshop showed me there\'s a whole business side I had never thought about."',
      name: 'Nishantha P.',
      role: 'Aspiring Business Owner, Colombo',
      emoji: '🌸',
    },
    {
      text: '"As someone running a small tailoring shop, I didn\'t expect to learn anything new — but the session on construction techniques completely changed how I approach difficult designs."',
      name: 'Sujeewa K.',
      role: 'Tailoring Business Owner, Galle',
      emoji: '✨',
    },
  ];

  return (
    <section id="testimonials" className="section social-bg">
      <div className="container">
        <div className="section-header centered">
          <div className="section-eyebrow">💬 Community</div>
          <h2>What the Su Collection Community Says</h2>
          <p>Thousands of Sinhala-speaking tailors and entrepreneurs have already experienced the difference.</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-stars">{'★★★★★'}</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.emoji}</div>
                <div className="testimonial-author-info">
                  <span>{t.name}</span>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────
function CTABanner() {
  const { openPopup } = useFunnel();

  return (
    <section className="section">
      <div className="container">
        <div className="cta-banner">
          <h2>Ready to Discover Your Path?</h2>
          <p style={{ maxWidth: '520px', margin: '0 auto 2.5rem', fontSize: '1.1rem' }}>
            Take the free 5-minute quiz and register for the 19 September workshop.
            You'll receive a personalised roadmap — no cost, no obligation.
          </p>
          <button className="btn btn-white btn-lg" onClick={openPopup}>
            Take the Free Quiz Now →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo">
            <Image src={logoSrc} alt="Su Collection" width={40} height={40} />
            <div>
              <div className="footer-logo-text">Su Collection × UVA VEC</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>
                Free Workshop Funnel & Growth Ecosystem
              </div>
            </div>
          </div>
          <p className="footer-note">
            © 2026 Su Collection × UVA VEC. Free Workshop: 19 September 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────
function App() {
  const { openPopup } = useFunnel();

  // Show popup after 3 seconds on first load
  useEffect(() => {
    const timer = setTimeout(openPopup, 3000);
    return () => clearTimeout(timer);
  }, [openPopup]);

  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PathsSection />
      <LearnSection />
      <TestimonialsSection />
      <CTABanner />
      <Footer />

      {/* Funnel Overlays */}
      <EntryPopup />
      <FunnelQuiz />
    </>
  );
}

export default function Home() {
  return (
    <FunnelProvider>
      <App />
    </FunnelProvider>
  );
}
