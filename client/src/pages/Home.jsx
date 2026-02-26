import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

/* ── Assets ── */
import UNC_LOGO from '../assets/UNC.png';
import USG_LOGO from '../assets/USG LOGO NO BG.png';
import USG_COVER from '../assets/USG COVER.jpg';
import STUDENTS_IMG from '../assets/STUDENTS.jpg';
import UNESCO_IMG from '../assets/UNESCO.jpg';
import GREYHOUND from '../assets/GREYHOUND.png';

/* Department logos */
import CEA from '../assets/DEPARTMENT LOGO\'s/CEA.png';
import CJE from '../assets/DEPARTMENT LOGO\'s/CJE.png';
import ELEM from '../assets/DEPARTMENT LOGO\'s/ELEM.png';
import HS from '../assets/DEPARTMENT LOGO\'s/HS.png';
import LAW from '../assets/DEPARTMENT LOGO\'s/LAW.png';
import SBA from '../assets/DEPARTMENT LOGO\'s/SBA.png';
import SCIS from '../assets/DEPARTMENT LOGO\'s/SCIS.png';
import SHS from '../assets/DEPARTMENT LOGO\'s/SHS.png';
import SNAHS from '../assets/DEPARTMENT LOGO\'s/SNAHS.png';
import SSNS from '../assets/DEPARTMENT LOGO\'s/SSNS.png';
import STEd from '../assets/DEPARTMENT LOGO\'s/STEd.png';


/* ═══════════ SVG ICONS ═══════════ */
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const MegaphoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);

const LayoutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const AwardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const DollarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const SchoolIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22V8l10-6 10 6v14" />
    <line x1="2" y1="22" x2="22" y2="22" />
    <rect x="9" y="14" width="6" height="8" />
    <rect x="5" y="10" width="3" height="3" />
    <rect x="16" y="10" width="3" height="3" />
  </svg>
);

const StarFill = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);


/* ═══════════ SCROLL REVEAL HOOK ═══════════ */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}


/* ═══════════ DATA ═══════════ */
const deptLogos = [
  { src: CEA, alt: 'CEA' }, { src: CJE, alt: 'CJE' }, { src: SCIS, alt: 'SCIS' },
  { src: SBA, alt: 'SBA' }, { src: SNAHS, alt: 'SNAHS' }, { src: SSNS, alt: 'SSNS' },
  { src: STEd, alt: 'STEd' }, { src: LAW, alt: 'LAW' },
];


/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */
const SVC_WORDS = ['Tinig Dinig', 'Governance', 'Transparency', 'Issuances', 'Programs', 'Student Welfare', 'Finances'];

const Home = () => {
  useReveal();

  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % SVC_WORDS.length);
        setWordVisible(true);
      }, 380);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-page">

      {/* ═══════════ §1 HERO ═══════════ */}
      <section className="hero">
        <div className="hero-bg">
          <img src={USG_COVER} alt="USG Campus" />
          <div className="hero-bg-overlay" />
        </div>

        {/* Decorative floating orbs */}
        <div className="hero-float-1" />
        <div className="hero-float-2" />

        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              UNC University Student Government
            </div>

            <h1 className="hero-title">
              Your Voice,
              <span className="hero-title-line2">
                Your <span className="hero-title-em">Campus</span>
              </span>
            </h1>

            <p className="hero-desc">
              The official digital platform of the UNC Supreme Student Council —
              bridging transparency, student welfare, and the collective voice of
              every Greyhound through innovation and service.
            </p>

            <div className="hero-btns">
              <Link to="/tinig" className="btn btn-red">
                Voice Out Now <ArrowRight />
              </Link>
              <Link to="/login" className="btn btn-white-outline">
                Sign In
              </Link>
            </div>
          </div>

          {/* Right — Feature card */}
          <div className="hero-right">
            <div className="hero-card">
              <span className="hero-card-badge">Tinig Dinig</span>
              <h3>Your Communication Channel is Live</h3>
              <p>
                Submit concerns, feedback, or suggestions directly to the SSC.
                Anonymous or identified — your voice will be heard and acted upon.
              </p>
              <Link to="/tinig" className="hero-card-link">
                Learn More <Chevron />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint">
          <div className="scroll-mouse" />
          <span className="scroll-text">Scroll</span>
        </div>
      </section>


      {/* ═══════════ §2 WE CHAMPION EXCELLENCE ═══════════ */}
      <section className="champion-section">
        <div className="champ-grid-bg" aria-hidden="true" />
        {/* Animated floating light particles */}
        <div className="champ-particle champ-particle-1" aria-hidden="true" />
        <div className="champ-particle champ-particle-2" aria-hidden="true" />
        <div className="champ-particle champ-particle-3" aria-hidden="true" />
        <div className="champ-particle champ-particle-4" aria-hidden="true" />
        <div className="champ-particle champ-particle-5" aria-hidden="true" />

        <div className="champion-inner">
          <div className="reveal">
            <p className="champ-eyebrow">Your voice, our mission</p>
            <h2 className="champion-heading">
              We Champion <span className="champ-highlight">Excellence</span>
            </h2>
            <p className="champion-sub">
              The University Student Government serves as the unified voice of the Greyhound
              community — championing student welfare, upholding transparency, and driving
              meaningful campus-wide progress for every UNC student.
            </p>
          </div>

          <div className="champion-cards">
            {/* Left — dark maroon */}
            <div className="champion-card champ-dark reveal d1">
              <div className="cc-shimmer" aria-hidden="true" />
              <div className="cc-icon-wrap"><EyeIcon /></div>
              <h3>Full Transparency</h3>
              <p>Every resolution, budget allocation, and decision is documented and accessible to the student body.</p>
              <Link to="/finance" className="cc-link">View Financial Records ↗</Link>
            </div>

            {/* Center — featured white card (overlapping) */}
            <div className="champion-card champ-featured reveal d2">
              <div className="cc-shimmer" aria-hidden="true" />
              <div className="cc-icon-wrap"><UsersIcon /></div>
              <h3>Student Advocacy</h3>
              <p>Programs &amp; services dedicated to amplifying student voices and ensuring campus-wide welfare.</p>
              <Link to="/programs" className="cc-link">Explore Our Programs ↗</Link>
            </div>

            {/* Right — dark maroon */}
            <div className="champion-card champ-dark reveal d3">
              <div className="cc-shimmer" aria-hidden="true" />
              <div className="cc-icon-wrap"><ShieldIcon /></div>
              <h3>Accountable Governance</h3>
              <p>Issuances, resolutions, and official documents — all publicly available for every Greyhound.</p>
              <Link to="/issuances" className="cc-link">Browse Issuances ↗</Link>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════ §3 ACCREDITATION / DEPARTMENTS ═══════════ */}
      <section className="accred-section">
        {/* Animated background layers */}
        <div className="accred-bg-pattern" aria-hidden="true" />
        <div className="accred-float accred-float-1" aria-hidden="true" />
        <div className="accred-float accred-float-2" aria-hidden="true" />

        <div className="accred-inner">
          {/* Left: Photo */}
          <div className="accred-photo reveal-left">
            <div className="accred-photo-frame">
              <img src={STUDENTS_IMG} alt="UNC Students" />
              <div className="accred-photo-badge">
                <span>8</span>
                <small>Colleges</small>
              </div>
            </div>
          </div>

          {/* Right: Content + Logo Grid */}
          <div className="accred-content">
            <div className="reveal">
              <div className="section-tag">
                <span className="section-tag-line" />
                Academic Excellence
                <span className="section-tag-line" />
              </div>
              <h2 className="accred-heading">
                Quality-Certified for <span className="text-red">Local & Global</span> Excellence
              </h2>
              <p className="accred-desc">
                The University of Nueva Caceres offers programs across 8 colleges,
                each maintaining accreditation standards that prepare students for success locally and internationally.
              </p>
            </div>

            {/* Department Logo Grid */}
            <div className="accred-grid">
              {deptLogos.map((d, i) => (
                <div key={i} className={`accred-card reveal d${(i % 6) + 1}`}>
                  <div className="accred-card-inner">
                    <img src={d.src} alt={d.alt} />
                    <span className="accred-card-label">{d.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════ §3.5 UNESCO RECOGNITION ═══════════ */}
      <section className="unesco-section">
        <div className="unesco-inner">
          {/* Floating red badge */}
          <div className="unesco-badge-circle" aria-hidden="true">
            <span className="unesco-badge-star">★</span>
            <p>Outstanding<br />Club</p>
          </div>

          {/* Left: section label + heading + photo */}
          <div className="unesco-left reveal">
            <div className="section-tag">
              <span className="section-tag-line" />
              UNESCO Recognition
              <span className="section-tag-line" />
            </div>
            <h2 className="unesco-heading">
              Why is UNC-USG recognized as an Outstanding Club for UNESCO?
            </h2>
            <div className="unesco-img-wrap">
              <div className="unesco-img-tag">2023 · 2024</div>
              <img src={UNESCO_IMG} alt="UNC-USG UNESCO Outstanding Club Recognition" />
            </div>
          </div>

          {/* Right: text panel */}
          <div className="unesco-right reveal d1">
            <p className="unesco-red-label">Outstanding Club for UNESCO</p>
            <p className="unesco-category">College Level · Cultural Category</p>
            <p className="unesco-desc">
              Congratulations to the UNC-University Student Government, which was first
              accredited by the UNESCO Clubs Philippines in 2023 and has now been recognized
              as one of the <strong>Outstanding Clubs for UNESCO at the college level in the
              Cultural Category.</strong>
            </p>
            <p className="unesco-desc">
              We are also thrilled to announce that UNC-USG is once again an accredited
              organization of the UNESCO Clubs Philippines. Let's aim for more sustainable
              and impactful events for the students and the community. Here's to more
              milestones and achievements!
            </p>
            <a
              href="https://www.facebook.com/UNCUSG"
              target="_blank"
              rel="noreferrer"
              className="unesco-btn"
            >
              Learn more about UNC-USG ↗
            </a>
          </div>
        </div>
      </section>


      {/* ═══════════ §4 ZIGZAG FEATURES ═══════════ */}
      <section className="features-section">
        <div className="features-float features-float-1" aria-hidden="true" />
        <div className="features-float features-float-2" aria-hidden="true" />
        <div className="features-inner">
          <div className="features-header reveal">
            <div className="features-header-text">
              <div className="section-tag">
                <span className="section-tag-line" />
                Our Key Features
                <span className="section-tag-line" />
              </div>
              <h2 className="features-heading">
                What Makes <span className="text-red">USG Tinig Dinig</span> Different?
              </h2>
            </div>
            <div className="feature-big-num">#1</div>
          </div>

          {/* Row 1: TINIG DINIG */}
          <div className="zigzag-row reveal">
            <div className="zigzag-img reveal-left">
              <span className="zigzag-img-tag">Flagship</span>
              <img src={STUDENTS_IMG} alt="Students voicing out" />
            </div>
            <div className="zigzag-content reveal-right">
              <h3>Tinig Dinig: Your Voice Matters</h3>
              <p>
                A dedicated communication channel where every student can submit concerns,
                feedback, and suggestions directly to the student council. Whether anonymous
                or identified, every voice is heard, categorized, and acted upon — with full
                tracking and resolution updates.
              </p>
              <Link to="/tinig" className="zigzag-link">
                Submit a Concern <Chevron />
              </Link>
            </div>
          </div>

          {/* Row 2: Constitution & Org Chart */}
          <div className="zigzag-row reverse reveal">
            <div className="zigzag-img reveal-right">
              <span className="zigzag-img-tag">Governance</span>
              <img src={UNESCO_IMG} alt="USG Constitution" />
            </div>
            <div className="zigzag-content reveal-left">
              <h3>Constitution & Organizational Chart</h3>
              <p>
                Access the USG Constitution and By-Laws — the foundation of student governance.
                View the complete organizational structure, from the executive board to every
                committee, ensuring clarity in leadership and responsibilities.
              </p>
              <Link to="/organization" className="zigzag-link">
                View Organization <Chevron />
              </Link>
            </div>
          </div>

          {/* Row 3: Programs & Accomplishments */}
          <div className="zigzag-row reveal">
            <div className="zigzag-img reveal-left">
              <span className="zigzag-img-tag">Impact</span>
              <img src={USG_COVER} alt="USG Programs" />
            </div>
            <div className="zigzag-content reveal-right">
              <h3>Programs, Accomplishments & Announcements</h3>
              <p>
                Stay updated with USG initiatives, completed programs, and campus-wide
                announcements. From community outreach to academic forums — every accomplishment
                is documented and celebrated.
              </p>
              <a href="#services" className="zigzag-link">
                Explore Programs <Chevron />
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════ §5 RED BANNER ═══════════ */}
      <section className="red-banner">
        <div className="red-banner-inner reveal">
          <h2>Supporting Students Just Like You</h2>
          <p>
            From enrollment concerns to campus safety, financial transparency to organizational clarity —
            the USG is committed to serving every Greyhound with integrity and passion.
          </p>
          <Link to="/tinig" className="btn-white">
            Voice Out Now <ArrowRight />
          </Link>
        </div>
      </section>


      {/* ═══════════ §6 SERVICES GRID ═══════════ */}
      <section className="services-section" id="services">
        <div className="services-inner">
          <div className="services-header reveal">
            <div className="section-tag">
              <span className="section-tag-line" />
              Platform Features
              <span className="section-tag-line" />
            </div>
            <h2 className="services-heading">
              Find Information About{' '}
              <span className={`svc-word-wrap${wordVisible ? ' word-in' : ' word-out'}`}>
                {SVC_WORDS[wordIdx]}
              </span>
            </h2>
            <p className="services-sub">
              Everything you need from your student government — organized, transparent, and accessible.
            </p>
          </div>

          <div className="services-grid">
            {/* Tinig Dinig — featured red gradient card, spans 2 cols */}
            <Link to="/tinig" className="svc-card svc-card-tinig reveal d1">
              <div className="tinig-icon-wrap">
                <MegaphoneIcon />
              </div>
              <div className="tinig-content">
                <span className="tinig-badge">Flagship Feature</span>
                <h3>Tinig Dinig</h3>
                <p>USG Communication Channel — submit concerns, track resolutions, and make your voice count.</p>
                <span className="tinig-cta">
                  Open Channel <ArrowRight />
                </span>
              </div>
              <div className="tinig-deco" aria-hidden="true" />
            </Link>

            {/* Constitution */}
            <Link to="/issuances" className="svc-card reveal d2">
              <div className="svc-icon svc-icon-red"><BookIcon /></div>
              <h3>USG Constitution & By-Laws</h3>
              <p>The foundational document governing student representation and rights.</p>
            </Link>

            {/* Org Chart */}
            <Link to="/organization" className="svc-card reveal d3">
              <div className="svc-icon svc-icon-dark"><LayoutIcon /></div>
              <h3>Organizational Chart</h3>
              <p>View the complete leadership structure of the student government.</p>
            </Link>

            {/* Programs */}
            <Link to="/dashboard" className="svc-card reveal d4">
              <div className="svc-icon svc-icon-gold"><CalendarIcon /></div>
              <h3>Programs & Services</h3>
              <p>Student-centered initiatives, events, and support programs.</p>
            </Link>

            {/* Accomplishments */}
            <Link to="/dashboard" className="svc-card reveal d5">
              <div className="svc-icon svc-icon-red"><AwardIcon /></div>
              <h3>Accomplishments & Announcements</h3>
              <p>Track milestones, achievements, and campus-wide updates.</p>
            </Link>

            {/* Issuances */}
            <Link to="/issuances" className="svc-card reveal d6">
              <div className="svc-icon svc-icon-dark"><FileTextIcon /></div>
              <h3>Issuances & Reports</h3>
              <p>Official resolutions, memorandums, and transparency reports.</p>
            </Link>

            {/* Financial */}
            <Link to="/finance" className="svc-card reveal d7">
              <div className="svc-icon svc-icon-gold"><DollarIcon /></div>
              <h3>Financial Transactions</h3>
              <p>Full visibility into how student funds are allocated and spent.</p>
            </Link>
          </div>
        </div>
      </section>


      {/* ═══════════ §8 MASCOT CTA ═══════════ */}
      <section className="mascot-section">
        <div className="mascot-inner">
          <div className="mascot-img-wrap reveal-left">
            <img src={GREYHOUND} alt="UNC Greyhound Mascot" />
          </div>
          <div className="mascot-content reveal-right">
            <h2>A Future-Ready University</h2>
            <p>
              The Greyhound spirit runs through every initiative. Whether it's student advocacy,
              campus events, or community service — the USG moves forward together as one pack.
              Join us in building a better UNC.
            </p>
            <Link to="/register" className="btn btn-red">
              Create an Account <ArrowRight />
            </Link>
            <div className="mascot-tagline">
              <StarFill /> Non Sibi, Sed Suis <StarFill />
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════ §9 FOOTER ═══════════ */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-brand-logos">
                <img src={UNC_LOGO} alt="UNC Logo" />
                <img src={USG_LOGO} alt="USG Logo" />
              </div>
              <h3>UNC Student Government</h3>
              <span className="footer-brand-tag">Tinig Dinig Portal</span>
              <p>
                The official digital archive and transparency platform of the
                Supreme Student Council — University of Nueva Caceres.
              </p>
            </div>

            <div className="footer-col">
              <h4>Platform</h4>
              <Link to="/tinig">Tinig Dinig</Link>
              <Link to="/finance">Financial Transparency</Link>
              <Link to="/organization">Organization</Link>
              <Link to="/issuances">Issuances & Reports</Link>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Register</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>

            <div className="footer-col">
              <h4>University</h4>
              <a href="https://unc.edu.ph" target="_blank" rel="noopener noreferrer">UNC Official Site</a>
              <a href="#services">About USG</a>
              <a href="mailto:usg.official@unc.edu.ph">Contact SSC</a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} University of Nueva Caceres — Supreme Student Council. All rights reserved.</span>
            <span className="footer-bicol-tag">
              Bicol's First University
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
