import { useState } from 'react';
import { USG_HEAD, COLLEGE_DEPARTMENTS, ORGANIZATIONS } from '../data/orgData';
import './OrgChart.css';

/* ── SVG Icons ── */
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   Leader Card — image-highlight with hover logo overlay
   ═══════════════════════════════════════════════════════════ */
const LeaderCard = ({ item, onClick }) => {
  const img = item.leader.imageBg || item.leader.imageNoBg;
  const color = item.brandColor || '#C8102E';

  return (
    <article className="ldr-card" onClick={() => onClick(item)}>
      <div className="ldr-card-visual">
        {img ? (
          <img src={img} alt={item.leader.name} className="ldr-card-photo" />
        ) : (
          <div className="ldr-card-ph">{item.leader.name.charAt(0)}</div>
        )}

        {/* Default gradient overlay */}
        <div className="ldr-card-overlay" />

        {/* Hover overlay — brand color + centred logo */}
        <div
          className="ldr-card-hover"
          style={{ backgroundColor: color }}
        >
          {item.logo && (
            <img src={item.logo} alt={item.abbreviation} className="ldr-card-hover-logo" />
          )}
        </div>

        {/* Caption always visible */}
        <div className="ldr-card-caption">
          <h3 className="ldr-card-name">{item.leader.name}</h3>
          <p className="ldr-card-dept">{item.abbreviation}</p>
        </div>
      </div>
    </article>
  );
};

/* ═══════════════════════════════════════════════════════════
   OrgChart Page
   ═══════════════════════════════════════════════════════════ */
const OrgChart = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [selectedItem, setSelectedItem] = useState(null);

  const data = activeTab === 'departments' ? COLLEGE_DEPARTMENTS : ORGANIZATIONS;
  const usgImg = USG_HEAD.imageBg || USG_HEAD.imageNoBg;

  return (
    <div className="org-landing">
      {/* ── Hero ── */}
      <section className="org-hero">
        <div className="org-hero-inner">
          <span className="org-hero-tag">
            <span className="org-hero-tag-dot" />
            University Student Government
          </span>
          <h1 className="org-hero-title">
            Organizational <span className="org-hero-em">Chart</span>
          </h1>
          <p className="org-hero-desc">
            Meet the leaders who serve the University of Nueva Caceres student body —
            your voice, your government.
          </p>
        </div>
      </section>

      {/* ── USG President — same card style as departments ── */}
      <section className="org-president-section">
        <div className="org-container">
          <article
            className="ldr-card ldr-card--president"
            onClick={() => setSelectedItem({
              ...USG_HEAD,
              id: 'usg',
              fullName: USG_HEAD.organization,
              councilName: USG_HEAD.organization,
              councilAbbr: USG_HEAD.abbreviation,
              logo: null,
              leader: {
                name: USG_HEAD.name,
                position: USG_HEAD.position,
                imageNoBg: USG_HEAD.imageNoBg,
                imageBg: USG_HEAD.imageBg,
              },
            })}
          >
            <div className="ldr-card-visual">
              {usgImg ? (
                <img src={usgImg} alt={USG_HEAD.name} className="ldr-card-photo" />
              ) : (
                <div className="ldr-card-ph">{USG_HEAD.name.charAt(0)}</div>
              )}
              <div className="ldr-card-overlay" />
              <div className="ldr-card-caption">
                <h3 className="ldr-card-name">{USG_HEAD.name}</h3>
                <p className="ldr-card-dept">{USG_HEAD.position}</p>
              </div>
            </div>
          </article>
          <div className="org-connector" />
        </div>
      </section>

      {/* ── Two Tabs ── */}
      <section className="org-tabs-section">
        <div className="org-container">
          <div className="org-tabs-wrap">
            <button
              className={`org-tab-btn ${activeTab === 'departments' ? 'active' : ''}`}
              onClick={() => { setActiveTab('departments'); setSelectedItem(null); }}
            >
              College Departments
            </button>
            <button
              className={`org-tab-btn ${activeTab === 'organizations' ? 'active' : ''}`}
              onClick={() => { setActiveTab('organizations'); setSelectedItem(null); }}
            >
              Organizations
            </button>
          </div>
        </div>
      </section>

      {/* ── Cards Grid ── */}
      <section className="org-grid-section">
        <div className="org-container">
          <div className={`org-grid ${data.length <= 2 ? 'org-grid--few' : ''}`}>
            {data.map((item) => (
              <LeaderCard key={item.id} item={item} onClick={setSelectedItem} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Detail Modal ── */}
      {selectedItem && (
        <div className="org-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="org-modal" onClick={(e) => e.stopPropagation()}>
            <button className="org-modal-close" onClick={() => setSelectedItem(null)} aria-label="Close">
              <CloseIcon />
            </button>

            {/* Top: no-bg image on clean background */}
            <div className="org-modal-top">
              {selectedItem.leader.imageNoBg ? (
                <img src={selectedItem.leader.imageNoBg} alt={selectedItem.leader.name} className="org-modal-avatar" />
              ) : selectedItem.leader.imageBg ? (
                <img src={selectedItem.leader.imageBg} alt={selectedItem.leader.name} className="org-modal-avatar" />
              ) : (
                <div className="org-modal-avatar-ph">{selectedItem.leader.name.charAt(0)}</div>
              )}
            </div>

            <div className="org-modal-body">
              <h3 className="org-modal-name">{selectedItem.leader.name}</h3>
              <span className="org-modal-position">{selectedItem.leader.position}</span>

              {selectedItem.logo && (
                <img src={selectedItem.logo} alt="" className="org-modal-logo" />
              )}

              <hr className="org-modal-divider" />

              <h4 className="org-modal-org-name">{selectedItem.fullName}</h4>
              <p className="org-modal-council">
                {selectedItem.councilName} ({selectedItem.councilAbbr})
              </p>

              <p className="org-modal-desc">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgChart;
