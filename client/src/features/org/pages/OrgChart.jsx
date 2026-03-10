import { useMemo, useState } from 'react';
import { usePageTitle } from '../../../hooks';
import {
  COLLEGE_DEPARTMENTS,
  ORGANIZATIONS,
  USG_HEAD,
  USG_OFFICERS,
} from '../data/orgData';
import './OrgChart.css';

const DEPARTMENT_OFFICER_ROLES = [
  'Vice Chairperson',
  'Secretary',
  'Treasurer',
  'Auditor',
  'Public Information Officer',
];

const ProfileCard = ({ item, className = '' }) => {
  const image = item.leader?.imageBg || item.leader?.imageNoBg;

  return (
    <article className={`profile-card ${className}`.trim()}>
      <div className="profile-card-media">
        {image ? (
          <img src={image} alt={item.leader.name} className="profile-card-image" />
        ) : (
          <div className="profile-card-image-ph">{item.leader.name.charAt(0)}</div>
        )}
        <div className="profile-card-overlay" />
        <div className="profile-card-body">
          <p className="profile-card-role">{item.leader.position}</p>
          <h3 className="profile-card-name">{item.leader.name}</h3>
          <p className="profile-card-label">{item.fullName}</p>
        </div>
      </div>
    </article>
  );
};

const TarotCard = ({
  item,
  isActive,
  isHovered,
  onHoverChange,
  onSelect,
}) => {
  const image = item.leader.imageBg || item.leader.imageNoBg;

  return (
    <button
      type="button"
      className={`tarot-card ${isActive ? 'is-active' : ''} ${isHovered ? 'is-hovered' : ''}`.trim()}
      style={{ '--card-accent': item.brandColor || '#C8102E' }}
      onClick={() => onSelect(item.id)}
      onMouseEnter={() => onHoverChange(item.id)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(item.id)}
      onBlur={() => onHoverChange(null)}
    >
      <div className="tarot-card-inner">
        <div className="tarot-card-face tarot-card-face--front">
          <span className="tarot-card-mark">{item.councilAbbr || item.abbreviation}</span>
          <div className="tarot-card-front-center">
            {item.logo ? (
              <img src={item.logo} alt={item.abbreviation} className="tarot-card-logo" loading="lazy" decoding="async" />
            ) : (
              <div className="tarot-card-logo-ph">{item.abbreviation}</div>
            )}
          </div>
          <div className="tarot-card-front-copy">
            <h3 className="tarot-card-front-title">{item.abbreviation}</h3>
          </div>
        </div>

        <div className="tarot-card-face tarot-card-face--back">
          {image ? (
            <img src={image} alt={item.leader.name} className="tarot-card-photo" loading="lazy" decoding="async" />
          ) : (
            <div className="tarot-card-photo-ph">{item.leader.name.charAt(0)}</div>
          )}
          <div className="tarot-card-photo-overlay" />
          <div className="tarot-card-logo-watermark-wrap">
            {item.logo ? (
              <img src={item.logo} alt="" className="tarot-card-logo-watermark" />
            ) : null}
          </div>
          <div className="tarot-card-caption">
            <p className="tarot-card-role">{item.leader.position}</p>
            <h3 className="tarot-card-name">{item.leader.name}</h3>
            <p className="tarot-card-label">{item.fullName}</p>
          </div>
        </div>
      </div>
    </button>
  );
};

const OrgChart = () => {
  usePageTitle('Organization');
  const [activeTab, setActiveTab] = useState('departments');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [hoveredDepartmentId, setHoveredDepartmentId] = useState(null);

  const executiveHead = useMemo(
    () => ({
      id: USG_HEAD.id,
      abbreviation: USG_HEAD.abbreviation,
      fullName: USG_HEAD.organization,
      councilName: 'Executive Officers',
      councilAbbr: USG_HEAD.abbreviation,
      logo: null,
      brandColor: '#C8102E',
      description: USG_HEAD.description,
      leader: {
        name: USG_HEAD.name,
        position: USG_HEAD.position,
        imageNoBg: USG_HEAD.imageNoBg,
        imageBg: USG_HEAD.imageBg,
      },
    }),
    []
  );

  const vicePresident = useMemo(
    () => USG_OFFICERS.find((officer) => officer.id === 'vp') ?? null,
    []
  );

  const chiefOfStaff = useMemo(
    () => USG_OFFICERS.find((officer) => officer.id === 'chief-of-staff') ?? null,
    []
  );

  const fsofsPresident = useMemo(
    () => ORGANIZATIONS.find((item) => item.id === 'fsofs') ?? null,
    []
  );

  const selectedDepartment = useMemo(
    () => COLLEGE_DEPARTMENTS.find((item) => item.id === selectedDepartmentId) ?? null,
    [selectedDepartmentId]
  );

  const visibleDepartmentCards = useMemo(
    () => COLLEGE_DEPARTMENTS.filter((item) => item.id !== selectedDepartmentId),
    [selectedDepartmentId]
  );

  const selectedDepartmentOfficers = useMemo(() => {
    if (!selectedDepartment) {
      return [];
    }

    return DEPARTMENT_OFFICER_ROLES.map((role, index) => ({
      id: `${selectedDepartment.id}-${role.toLowerCase().replace(/\s+/g, '-')}`,
      fullName: selectedDepartment.fullName,
      councilName: selectedDepartment.councilName,
      councilAbbr: selectedDepartment.councilAbbr,
      leader: {
        name: `Officer ${index + 1}`,
        position: role,
        imageNoBg: null,
        imageBg: null,
      },
    }));
  }, [selectedDepartment]);

  return (
    <div className="org-landing">
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
            Explore the executive leadership and council chairpersons of the University of Nueva Caceres in a more visual, card-based chart.
          </p>
        </div>
      </section>

      <section className="org-structure-section">
        <div className="org-container">
          <div className="org-executive-tree">
            <ProfileCard item={executiveHead} className="profile-card--executive profile-card--president" />

            <div className="org-heads-layout">
              <div className="org-heads-mainline">
                <div className="org-heads-mainline-vertical" />
                {vicePresident ? (
                  <ProfileCard item={vicePresident} className="profile-card--executive profile-card--vice" />
                ) : null}
              </div>

              {chiefOfStaff ? (
                <div className="org-heads-chiefside">
                  <div className="org-heads-chief-joint" />
                  <ProfileCard item={chiefOfStaff} className="profile-card--executive profile-card--chief" />
                </div>
              ) : null}
            </div>

            <div className="org-tabs-root-line" />
          </div>
        </div>
      </section>

      <section className="org-tabs-section">
        <div className="org-container">
          <div className="org-tabs-wrap">
            <button
              type="button"
              className={`org-tab-btn ${activeTab === 'departments' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('departments');
              }}
            >
              College Departments
            </button>
            <button
              type="button"
              className={`org-tab-btn ${activeTab === 'organizations' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('organizations');
                setSelectedDepartmentId(null);
                setHoveredDepartmentId(null);
              }}
            >
              FSOFS
            </button>
          </div>
        </div>
      </section>

      <section className="org-card-section">
        <div className="org-container">
          {activeTab === 'departments' ? (
            <>
              <div className="org-card-fan" aria-label="Department chairpersons">
                {visibleDepartmentCards.map((item) => (
                  <TarotCard
                    key={item.id}
                    item={item}
                    isActive={selectedDepartmentId === item.id}
                    isHovered={hoveredDepartmentId === item.id}
                    onHoverChange={setHoveredDepartmentId}
                    onSelect={(departmentId) => {
                      setSelectedDepartmentId((current) => (current === departmentId ? null : departmentId));
                    }}
                  />
                ))}
              </div>

              {selectedDepartment ? (
                <div className="department-tree-section">
                  <div className="department-tree-root">
                    <ProfileCard item={selectedDepartment} className="profile-card--department" />
                  </div>
                  <div className="department-tree-spine" />
                  <div className="department-tree-branch-line" />
                  <div className="department-tree-officers">
                    {selectedDepartmentOfficers.map((officer) => (
                      <div key={officer.id} className="department-tree-node">
                        <div className="department-tree-node-line" />
                        <ProfileCard item={officer} className="profile-card--officer" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            fsofsPresident ? (
              <div className="fsofs-spotlight" aria-label="FSOFS President">
                <div className="fsofs-spotlight-card">
                  <ProfileCard item={fsofsPresident} className="profile-card--executive profile-card--fsofs" />
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>
    </div>
  );
};

export default OrgChart;
