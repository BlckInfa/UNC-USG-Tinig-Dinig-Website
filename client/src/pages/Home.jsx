import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks';
import './Home.css';

/* -- Assets -- */
import UNC_LOGO from '../assets/UNC.png';
import USG_LOGO from '../assets/USG LOGO NO BG.png';
import USG_COVER from '../assets/USG COVER.jpg';
import STUDENTS_IMG from '../assets/STUDENTS.jpg';
import UNESCO_IMG from '../assets/UNESCO.jpg';
import GREYHOUND from '../assets/GREYHOUND.png';

/* Department logos */
import CEA from '../assets/department_logo/CEA.png';
import CJE from '../assets/department_logo/CJE.png';
import ELEM from '../assets/department_logo/ELEM.png';
import HS from '../assets/department_logo/HS.png';
import LAW from '../assets/department_logo/LAW.png';
import SBA from '../assets/department_logo/SBA.png';
import SCIS from '../assets/department_logo/SCIS.png';
import SHS from '../assets/department_logo/SHS.png';
import SNAHS from '../assets/department_logo/SNAHS.png';
import SSNS from '../assets/department_logo/SSNS.png';
import STEd from '../assets/department_logo/STEd.png';


/* ====== SVG ICONS ====== */
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

const StarFill = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const MessengerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.14 2 11.25c0 2.88 1.45 5.43 3.69 7.08v3.67l3.37-1.85c.92.26 1.9.4 2.94.4 5.52 0 10-4.14 10-9.25S17.52 2 12 2zm1.09 12.42-2.82-3.01-5.46 3 6-6.37 2.92 3.01 5.37-2.99-6.01 6.36z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);


/* ====== SCROLL REVEAL HOOK ====== */
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


/* ====== DATA ====== */
const deptLogos = [
  { src: CEA, alt: 'CEA' }, { src: CJE, alt: 'CJE' }, { src: SCIS, alt: 'SCIS' },
  { src: SBA, alt: 'SBA' }, { src: SNAHS, alt: 'SNAHS' }, { src: SSNS, alt: 'SSNS' },
  { src: STEd, alt: 'STEd' }, { src: LAW, alt: 'LAW' },
];

/* Chatbot quick-action responses */
const CHATBOT_OPTIONS = [
  { label: 'Submit a concern', desc: 'Voice out your concern to the USG', link: '/tinig' },
  { label: 'Track my ticket', desc: 'Check the status of your submission', link: '/tinig' },
  { label: 'View Organization', desc: 'See the USG leadership structure', link: '/organization' },
  { label: 'Financial Reports', desc: 'Transparency in student funds', link: '/finance' },
  { label: 'Issuances & Reports', desc: 'Official documents and resolutions', link: '/issuances' },
];


/* ====== TINIG DINIG CHATBOT WIDGET ====== */
const TinigChatbot = () => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi there, Greyhound! I\'m the Tinig Dinig assistant. How can I help you today?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const closeChat = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 320);
  };

  const toggleChat = () => {
    if (open) {
      closeChat();
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOptionClick = (opt) => {
    setMessages(prev => [
      ...prev,
      { from: 'user', text: opt.label },
      { from: 'bot', text: `Redirecting you to ${opt.label}...` }
    ]);
    setTimeout(() => {
      navigate(opt.link);
      setOpen(false);
      setClosing(false);
    }, 800);
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userMsg = inputVal.trim();
    setInputVal('');
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);

    // Simple keyword matching to redirect
    const lower = userMsg.toLowerCase();
    setTimeout(() => {
      if (lower.includes('concern') || lower.includes('complain') || lower.includes('voice') || lower.includes('submit') || lower.includes('feedback') || lower.includes('problem')) {
        setMessages(prev => [...prev, { from: 'bot', text: 'I can help you submit a concern! Let me take you to Tinig Dinig.' }]);
        setTimeout(() => { navigate('/tinig'); setOpen(false); }, 1000);
      } else if (lower.includes('track') || lower.includes('ticket') || lower.includes('status')) {
        setMessages(prev => [...prev, { from: 'bot', text: 'Let me take you to the ticket tracker!' }]);
        setTimeout(() => { navigate('/tinig'); setOpen(false); }, 1000);
      } else if (lower.includes('org') || lower.includes('chart') || lower.includes('leader')) {
        setMessages(prev => [...prev, { from: 'bot', text: 'Taking you to the Organizational Chart!' }]);
        setTimeout(() => { navigate('/organization'); setOpen(false); }, 1000);
      } else if (lower.includes('financ') || lower.includes('money') || lower.includes('budget') || lower.includes('fund')) {
        setMessages(prev => [...prev, { from: 'bot', text: 'Let me show you the Financial Transparency dashboard!' }]);
        setTimeout(() => { navigate('/finance'); setOpen(false); }, 1000);
      } else if (lower.includes('issuanc') || lower.includes('report') || lower.includes('resolution') || lower.includes('document')) {
        setMessages(prev => [...prev, { from: 'bot', text: 'I\'ll take you to our Issuances & Reports!' }]);
        setTimeout(() => { navigate('/issuances'); setOpen(false); }, 1000);
      } else {
        setMessages(prev => [...prev, {
          from: 'bot',
          text: 'I\'m not sure about that, but I can help you with the options below! Or you can go directly to Tinig Dinig to submit a concern.'
        }]);
      }
    }, 500);
  };

  return (
    <div className={`chatbot-widget ${open ? 'chatbot-open' : ''}`}>
      {/* Chat Window */}
      {(open || closing) && (
        <div className={`chatbot-window${closing ? ' chatbot-window-closing' : ''}`}>
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <MegaphoneIcon />
              <div>
                <h4>University of Nueva Caceres</h4>
                <span>USG Communication Channel</span>
              </div>
            </div>
            <button onClick={closeChat} className="chatbot-close"><CloseIcon /></button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg-${msg.from}`}>
                <p>{msg.text}</p>
              </div>
            ))}

            {/* Quick actions after first bot message */}
            {messages.length === 1 && (
              <div className="chatbot-quick-actions">
                {CHATBOT_OPTIONS.map((opt, i) => (
                  <button key={i} className="chatbot-quick-btn" onClick={() => handleOptionClick(opt)}>
                    <strong>{opt.label}</strong>
                    <small>{opt.desc}</small>
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="chatbot-send"><SendIcon /></button>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button className="chatbot-trigger" onClick={toggleChat}>
        {open ? <CloseIcon /> : <ChatBubbleIcon />}
        {!open && <span className="chatbot-trigger-badge">Need help?</span>}
      </button>
    </div>
  );
};


/* ====== ROTATING WORDS ====== */
const SVC_WORDS = ['Tinig Dinig', 'Governance', 'Transparency', 'Issuances', 'Programs', 'Student Welfare', 'Finances'];


/* ====== COMPONENT ====== */
const Home = () => {
  useReveal();
  usePageTitle('Home');

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

      {/* ====== S1 HERO ====== */}
      <section className="hero">
        <div className="hero-bg">
          <img src={USG_COVER} alt="USG Campus" />
          <div className="hero-bg-overlay" />
        </div>

        <div className="hero-float-1" />
        <div className="hero-float-2" />
        <div className="hero-float-3" />

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
              The official digital platform of the UNC University Student Government —
              bridging transparency, student welfare, and the collective voice of
              every Greyhound through innovation and service.
            </p>

            <div className="hero-btns">
              <Link to="/tinig" className="btn btn-red">
                Voice Out Now <ArrowRight />
              </Link>
              <a href="#services" className="btn btn-white-outline">
                Explore Features
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">7</span>
                <span className="hero-stat-label">Features</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">8</span>
                <span className="hero-stat-label">Colleges</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">1</span>
                <span className="hero-stat-label">Voice</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card">
              <span className="hero-card-badge">Tinig Dinig</span>
              <h3>Your Communication Channel is Live</h3>
              <p>
                Submit concerns, feedback, or suggestions directly to the USG.
                Anonymous or identified — your voice will be heard and acted upon.
              </p>
              <Link to="/tinig" className="hero-card-link">
                Open Channel <Chevron />
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-mouse" />
          <span className="scroll-text">Scroll</span>
        </div>
      </section>


      {/* ====== S2 WE CHAMPION EXCELLENCE ====== */}
      <section className="champion-section">
        <div className="champ-grid-bg" aria-hidden="true" />
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
            <div className="champion-card champ-card-1 reveal d1">
              <div className="cc-icon-wrap"><EyeIcon /></div>
              <div className="cc-body">
                <span className="cc-tag">Finance</span>
                <h3>Full Transparency</h3>
                <p>Every resolution, budget allocation, and decision is documented and accessible to the student body.</p>
              </div>
              <Link to="/finance" className="cc-link">View Financial Records <span className="cc-arrow">&#x2192;</span></Link>
            </div>

            <div className="champion-card champ-card-2 reveal d2">
              <div className="cc-icon-wrap"><UsersIcon /></div>
              <div className="cc-body">
                <span className="cc-tag">Portal</span>
                <h3>Student Advocacy</h3>
                <p>Programs &amp; services dedicated to amplifying student voices and ensuring campus-wide welfare.</p>
              </div>
              <Link to="/tinig" className="cc-link">Open Tinig Dinig <span className="cc-arrow">&#x2192;</span></Link>
            </div>

            <div className="champion-card champ-card-3 reveal d3">
              <div className="cc-icon-wrap"><ShieldIcon /></div>
              <div className="cc-body">
                <span className="cc-tag">Governance</span>
                <h3>Accountable Governance</h3>
                <p>Issuances, resolutions, and official documents — all publicly available for every Greyhound.</p>
              </div>
              <Link to="/issuances" className="cc-link">Browse Issuances <span className="cc-arrow">&#x2192;</span></Link>
            </div>
          </div>
        </div>
      </section>


      {/* ====== S3 ACCREDITATION / DEPARTMENTS ====== */}
      <section className="accred-section">
        <div className="accred-bg-pattern" aria-hidden="true" />
        <div className="accred-float accred-float-1" aria-hidden="true" />
        <div className="accred-float accred-float-2" aria-hidden="true" />

        <div className="accred-inner">
          <div className="accred-photo reveal-left">
            <div className="accred-photo-frame">
              <img src={STUDENTS_IMG} alt="UNC Students" />
              <div className="accred-photo-badge">
                <span>8</span>
                <small>Colleges</small>
              </div>
            </div>
          </div>

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


      {/* ====== S3.5 UNESCO RECOGNITION ====== */}
      <section className="unesco-section">
        <div className="unesco-inner">
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
              <div className="unesco-img-tag">2023 &middot; 2024</div>
              <img src={UNESCO_IMG} alt="UNC-USG UNESCO Outstanding Club Recognition" />
            </div>
          </div>

          <div className="unesco-right reveal d1">
            <p className="unesco-red-label">Outstanding Club for UNESCO</p>
            <p className="unesco-category">College Level &middot; Cultural Category</p>
            <p className="unesco-desc">
              Congratulations to the UNC-University Student Government, which was first
              accredited by the UNESCO Clubs Philippines in 2023 and has now been recognized
              as one of the <strong>Outstanding Clubs for UNESCO at the college level in the
              Cultural Category.</strong>
            </p>
            <p className="unesco-desc">
              We are also thrilled to announce that UNC-USG is once again an accredited
              organization of the UNESCO Clubs Philippines. Let's aim for more sustainable
              and impactful events for the students and the community.
            </p>
            <a
              href="https://www.facebook.com/UNCUSG"
              target="_blank"
              rel="noreferrer"
              className="unesco-btn"
            >
              Learn more about UNC-USG &#x2197;
            </a>

            <div className="unesco-highlights">
              <div className="unesco-hl-card">
                <span className="unesco-hl-num">2023</span>
                <span className="unesco-hl-label">First Accredited</span>
              </div>
              <div className="unesco-hl-card">
                <span className="unesco-hl-num">2&#x00D7;</span>
                <span className="unesco-hl-label">Consecutive Recognition</span>
              </div>
              <div className="unesco-hl-card">
                <span className="unesco-hl-num">&#x2605;</span>
                <span className="unesco-hl-label">Outstanding Club</span>
              </div>
            </div>

            <div className="unesco-callout">
              <span className="unesco-callout-star">&#x2605;</span>
              <div>
                <p className="unesco-callout-title">UNESCO Clubs Philippines</p>
                <p className="unesco-callout-body">
                  &ldquo;Recognized for exemplary cultural programs and sustainable
                  community engagement at the college level.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ====== S4 ZIGZAG FEATURES ====== */}
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
                or identified, every voice is heard, categorized, and acted upon &#x2014; with full
                tracking and resolution updates.
              </p>
              <Link to="/tinig" className="zigzag-link">
                Submit a Concern <Chevron />
              </Link>
            </div>
          </div>

          <div className="zigzag-row reverse reveal">
            <div className="zigzag-img reveal-right">
              <span className="zigzag-img-tag">Governance</span>
              <img src={UNESCO_IMG} alt="USG Constitution" />
            </div>
            <div className="zigzag-content reveal-left">
              <h3>Constitution & Organizational Chart</h3>
              <p>
                Access the USG Constitution and By-Laws &#x2014; the foundation of student governance.
                View the complete organizational structure, from the executive board to every
                committee, ensuring clarity in leadership and responsibilities.
              </p>
              <Link to="/organization" className="zigzag-link">
                View Organization <Chevron />
              </Link>
            </div>
          </div>

          <div className="zigzag-row reveal">
            <div className="zigzag-img reveal-left">
              <span className="zigzag-img-tag">Impact</span>
              <img src={USG_COVER} alt="USG Programs" />
            </div>
            <div className="zigzag-content reveal-right">
              <h3>Programs, Accomplishments & Announcements</h3>
              <p>
                Stay updated with USG initiatives, completed programs, and campus-wide
                announcements. From community outreach to academic forums &#x2014; every accomplishment
                is documented and celebrated.
              </p>
              <a href="#services" className="zigzag-link">
                Explore Programs <Chevron />
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ====== S5 RED BANNER ====== */}
      <section className="red-banner">
        <div className="red-banner-inner reveal">
          <h2>Supporting Students Just Like You</h2>
          <p>
            From enrollment concerns to campus safety, financial transparency to organizational clarity &#x2014;
            the USG is committed to serving every Greyhound with integrity and passion.
          </p>
          <Link to="/tinig" className="btn-white">
            Voice Out Now <ArrowRight />
          </Link>
        </div>
      </section>


      {/* ====== S6 SERVICES GRID ====== */}
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
              Everything you need from your student government &#x2014; organized, transparent, and accessible.
            </p>
          </div>

          <div className="services-grid">
            <Link to="/tinig" className="svc-card-tinig reveal d1">
              <div className="tinig-icon-wrap">
                <MegaphoneIcon />
              </div>
              <div className="tinig-content">
                <span className="tinig-badge">Flagship Feature</span>
                <h3>Tinig Dinig</h3>
                <p>USG Communication Channel &#x2014; submit concerns, track resolutions, and make your voice count.</p>
                <span className="tinig-cta">
                  Open Channel <ArrowRight />
                </span>
              </div>
              <div className="tinig-deco" aria-hidden="true" />
              <div className="tinig-sheen" aria-hidden="true" />
            </Link>

            <Link to="/issuances" className="svc-card svc-feat-card reveal d2">
              <div className="svc-feat-icon"><BookIcon /></div>
              <div className="svc-feat-body">
                <h3>USG Constitution &amp; By-Laws</h3>
                <p>The foundational document governing student representation and rights.</p>
              </div>
              <span className="svc-feat-link">Read Document &#x2192;</span>
            </Link>

            <Link to="/organization" className="svc-card svc-feat-card reveal d3">
              <div className="svc-feat-icon"><LayoutIcon /></div>
              <div className="svc-feat-body">
                <h3>Organizational Chart</h3>
                <p>View the complete leadership structure of the student government.</p>
              </div>
              <span className="svc-feat-link">View Org Chart &#x2192;</span>
            </Link>

            <Link to="/dashboard" className="svc-card svc-feat-card reveal d4">
              <div className="svc-feat-icon"><CalendarIcon /></div>
              <div className="svc-feat-body">
                <h3>Programs &amp; Services</h3>
                <p>Student-centered initiatives, events, and support programs.</p>
              </div>
              <span className="svc-feat-link">See Programs &#x2192;</span>
            </Link>

            <Link to="/dashboard" className="svc-card svc-feat-card reveal d5">
              <div className="svc-feat-icon"><AwardIcon /></div>
              <div className="svc-feat-body">
                <h3>Accomplishments &amp; Announcements</h3>
                <p>Track milestones, achievements, and campus-wide updates.</p>
              </div>
              <span className="svc-feat-link">View Achievements &#x2192;</span>
            </Link>

            <Link to="/issuances" className="svc-card svc-feat-card reveal d6">
              <div className="svc-feat-icon"><FileTextIcon /></div>
              <div className="svc-feat-body">
                <h3>Issuances &amp; Reports</h3>
                <p>Official resolutions, memorandums, and transparency reports.</p>
              </div>
              <span className="svc-feat-link">Browse Issuances &#x2192;</span>
            </Link>

            <Link to="/finance" className="svc-card svc-feat-card reveal d7">
              <div className="svc-feat-icon"><DollarIcon /></div>
              <div className="svc-feat-body">
                <h3>Financial Transactions</h3>
                <p>Full visibility into how student funds are allocated and spent.</p>
              </div>
              <span className="svc-feat-link">View Finances &#x2192;</span>
            </Link>
          </div>
        </div>
      </section>


      {/* ====== S8 MASCOT CTA ====== */}
      <section className="mascot-section">
        <div className="mascot-inner">
          <div className="mascot-img-wrap reveal-left">
            <img src={GREYHOUND} alt="UNC Greyhound Mascot" />
          </div>
          <div className="mascot-content reveal-right">
            <h2>A Future-Ready University</h2>
            <p>
              The Greyhound spirit runs through every initiative. Whether it's student advocacy,
              campus events, or community service &#x2014; the USG moves forward together as one pack.
              Join us in building a better UNC.
            </p>
            <Link to="/tinig" className="btn btn-red">
              Voice Out Now <ArrowRight />
            </Link>
            <div className="mascot-tagline">
              <StarFill /> Non Scholae, Sed Vitae <StarFill />
            </div>
          </div>
        </div>
      </section>


      {/* ====== S9 FOOTER ====== */}
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
                University Student Government &#x2014; University of Nueva Caceres.
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
              <h4>Contact info</h4>
              <a href="tel:0544726100" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PhoneIcon /> (054) 472 6100
              </a>
              <a href="mailto:uncusg.official@unc.edu.ph" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MailIcon /> uncusg.official@unc.edu.ph
              </a>
              <a href="https://www.messenger.com/t/USGUNC" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessengerIcon /> UNC University Student Government
              </a>
              <a href="https://www.facebook.com/USGUNC" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FacebookIcon /> UNC University Student Government
              </a>
            </div>

            <div className="footer-col">
              <h4>University</h4>
              <a href="https://unc.edu.ph" target="_blank" rel="noopener noreferrer">UNC Official Site</a>
              <a href="#services">About USG</a>
              <a href="mailto:usg.official@unc.edu.ph">Contact USG</a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} University of Nueva Caceres &#x2014; University Student Government. All rights reserved.</span>
            <span className="footer-bicol-tag">
              Bicol's First University
            </span>
          </div>
        </div>
      </footer>

      {/* ====== CHATBOT WIDGET ====== */}
      <TinigChatbot />

    </div>
  );
};

export default Home;
