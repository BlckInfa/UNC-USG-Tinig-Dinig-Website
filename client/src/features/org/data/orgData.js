/**
 * Organization Data — Static department leaders and structure
 * University of Nueva Caceres – University Student Government
 */

/* ── Leader Images (no-background PNGs) ── */
import USG_PRESIDENT_NB from '../../../assets/department_leader/no_bg/USG_PRESIDENT_Jan Marill Dominguez.png';
import BACC_CHAIR_NB from '../../../assets/department_leader/no_bg/BACC_CHAIRPERSON_Osher San Agustin.png';
import CS_CHAIR_NB from '../../../assets/department_leader/no_bg/CS_CHAIRPERSON_Bryann Joshua Francisco.png';
import EACC_CHAIR_NB from '../../../assets/department_leader/no_bg/EACC_CHAIRPERSON_Charles Emil Carillo.png';
import ECC_CHAIR_NB from '../../../assets/department_leader/no_bg/ECC_CHAIRPERSON_Hannah Beatrice Reginaldo.png';
import NCC_CHAIR_NB from '../../../assets/department_leader/no_bg/NCC_CHAIRPERSON_Mary Claire Razon.png';
import SSNSCC_CHAIR_NB from '../../../assets/department_leader/no_bg/SSNSCC_CHAIRPERSON_Princess Jean Madera.png';
import FSOFS_PRES_NB from '../../../assets/department_leader/no_bg/FSOFS_PRESIDENT_Felicity Marcaida.png';

/* ── Leader Images (with background JPGs) ── */
import USG_PRESIDENT_BG from '../../../assets/department_leader/USG PRESIDENT_Jan Marill Dominguez_.jpg';
import BACC_CHAIR_BG from '../../../assets/department_leader/BACC CHAIRPERSON_Osher San Agustin.jpg';
import CS_CHAIR_BG from '../../../assets/department_leader/CS CHAIRPERSON_Bryann Joshua Francisco.jpg';
import EACC_CHAIR_BG from '../../../assets/department_leader/EACC CHAIRPERSON_Charles Emil Carillo.jpg';
import ECC_CHAIR_BG from '../../../assets/department_leader/ECC CHAIRPERSON_Hannah Beatrice Reginaldo.jpg';
import NCC_CHAIR_BG from '../../../assets/department_leader/NCC CHAIRPERSON_Mary Claire Razon.jpg';
import SSNSCC_CHAIR_BG from '../../../assets/department_leader/SSNSCC CHAIRPERSON_Princess Jean Madera.jpg';
import FSOFS_PRES_BG from '../../../assets/department_leader/FSOFS PRESIDENT_Felicity Marcaida.jpg';

/* ── Department Logos ── */
import SBA_LOGO from '../../../assets/department_logo/SBA.png';
import SCIS_LOGO from '../../../assets/department_logo/SCIS.png';
import CEA_LOGO from '../../../assets/department_logo/CEA.png';
import STEd_LOGO from '../../../assets/department_logo/STEd.png';
import SNAHS_LOGO from '../../../assets/department_logo/SNAHS.png';
import SSNS_LOGO from '../../../assets/department_logo/SSNS.png';
import CJE_LOGO from '../../../assets/department_logo/CJE.png';
import LAW_LOGO from '../../../assets/department_logo/LAW.png';

/* ═══════════════════════════════════════════════════════════
   USG President (main head of all organizations)
   ═══════════════════════════════════════════════════════════ */
export const USG_HEAD = {
  id: 'usg',
  name: 'Jan Marill Dominguez',
  position: 'USG President',
  organization: 'University Student Government',
  abbreviation: 'USG',
  imageNoBg: USG_PRESIDENT_NB,
  imageBg: USG_PRESIDENT_BG,
  description:
    'The University Student Government serves as the central student body representing every Greyhound across all colleges. It spearheads campus-wide programs, advocates for student welfare, and bridges the student voice to the university administration.',
};

/* ═══════════════════════════════════════════════════════════
   College Departments
   ═══════════════════════════════════════════════════════════ */
export const COLLEGE_DEPARTMENTS = [
  {
    id: 'sba',
    abbreviation: 'SBA',
    fullName: 'School of Business and Accountancy',
    councilName: 'Business and Accountancy College Council',
    councilAbbr: 'BACC',
    logo: SBA_LOGO,
    brandColor: '#7EC8A0',
    description:
      'The BACC fosters excellence in business education, equipping future accountants, entrepreneurs, and financial leaders through student-led seminars, competitions, and community outreach programs.',
    leader: {
      name: 'Osher San Agustin',
      position: 'BACC Chairperson',
      imageNoBg: BACC_CHAIR_NB,
      imageBg: BACC_CHAIR_BG,
    },
  },
  {
    id: 'scis',
    abbreviation: 'SCIS',
    fullName: 'School of Computer and Information Sciences',
    councilName: 'Computer Science College Council',
    councilAbbr: 'CS',
    logo: SCIS_LOGO,
    brandColor: '#F0A868',
    description:
      'The CS Council empowers the next generation of technologists. It organizes hackathons, tech talks, and digital literacy drives, building a community of innovative problem-solvers.',
    leader: {
      name: 'Bryann Joshua Francisco',
      position: 'CS Chairperson',
      imageNoBg: CS_CHAIR_NB,
      imageBg: CS_CHAIR_BG,
    },
  },
  {
    id: 'cea',
    abbreviation: 'CEA',
    fullName: 'College of Engineering and Architecture',
    councilName: 'Engineering and Architecture College Council',
    councilAbbr: 'EACC',
    logo: CEA_LOGO,
    brandColor: '#F5D76E',
    description:
      'The EACC champions engineering and architectural excellence, hosting design workshops, site visits, and inter-school competitions that sharpen both technical and creative skills.',
    leader: {
      name: 'Charles Emil Carillo',
      position: 'EACC Chairperson',
      imageNoBg: EACC_CHAIR_NB,
      imageBg: EACC_CHAIR_BG,
    },
  },
  {
    id: 'sted',
    abbreviation: 'STEd',
    fullName: 'School of Teacher Education',
    councilName: 'Education College Council',
    councilAbbr: 'ECC',
    logo: STEd_LOGO,
    brandColor: '#87CEEB',
    description:
      'The ECC nurtures aspiring educators through practice-teaching immersions, literacy campaigns, and pedagogical symposiums that develop well-rounded and compassionate teachers.',
    leader: {
      name: 'Hannah Beatrice Reginaldo',
      position: 'ECC Chairperson',
      imageNoBg: ECC_CHAIR_NB,
      imageBg: ECC_CHAIR_BG,
    },
  },
  {
    id: 'snahs',
    abbreviation: 'SNAHS',
    fullName: 'School of Nursing and Allied Health Sciences',
    councilName: 'Nursing College Council',
    councilAbbr: 'NCC',
    logo: SNAHS_LOGO,
    brandColor: '#F4A0B0',
    description:
      'The NCC is committed to shaping compassionate healthcare professionals. It organizes medical missions, first-aid trainings, and wellness programs for the campus and surrounding communities.',
    leader: {
      name: 'Mary Claire Razon',
      position: 'NCC Chairperson',
      imageNoBg: NCC_CHAIR_NB,
      imageBg: NCC_CHAIR_BG,
    },
  },
  {
    id: 'ssns',
    abbreviation: 'SSNS',
    fullName: 'School of Sciences and Natural Sciences',
    councilName: 'SSNS College Council',
    councilAbbr: 'SSNSCC',
    logo: SSNS_LOGO,
    brandColor: '#E85D6F',
    description:
      'The SSNSCC cultivates scientific curiosity and research-driven thinking. It leads science fairs, research colloquia, and environmental awareness campaigns across the university.',
    leader: {
      name: 'Princess Jean Madera',
      position: 'SSNSCC Chairperson',
      imageNoBg: SSNSCC_CHAIR_NB,
      imageBg: SSNSCC_CHAIR_BG,
    },
  },
  {
    id: 'cje',
    abbreviation: 'CJE',
    fullName: 'College of Justice Education',
    councilName: 'Criminal Justice Education College Council',
    councilAbbr: 'CCJE',
    logo: CJE_LOGO,
    brandColor: '#B0B0B0',
    description:
      'The CCJE advocates for justice education and public service. Through moot courts, legal aid forums, and civic awareness drives, it molds principled future law enforcers and public servants.',
    leader: {
      name: 'Maria Krisha Robles',
      position: 'CCJE Chairperson',
      imageNoBg: null,
      imageBg: null,
    },
  },
  {
    id: 'law',
    abbreviation: 'LAW',
    fullName: 'College of Law',
    councilName: 'Law Student Council',
    councilAbbr: 'LSC',
    logo: LAW_LOGO,
    brandColor: '#5C4033',
    description:
      'The Law Student Council cultivates future legal professionals through moot court competitions, legal research symposia, and community legal-aid initiatives that uphold the rule of law.',
    leader: {
      name: 'TBA',
      position: 'LSC Representative',
      imageNoBg: null,
      imageBg: null,
    },
  },
];

/* ═══════════════════════════════════════════════════════════
   Organizations
   ═══════════════════════════════════════════════════════════ */
export const ORGANIZATIONS = [
  {
    id: 'fsofs',
    abbreviation: 'FSOFS',
    fullName: 'Federation of Student Organizations and Fraternities/Sororities',
    councilName: 'FSOFS',
    councilAbbr: 'FSOFS',
    logo: null,
    brandColor: '#8B3A4A',
    description:
      'The FSOFS unites recognized student organizations, fraternities, and sororities under one federation. It coordinates inter-org events, promotes camaraderie, and upholds responsible organizational culture within the university.',
    leader: {
      name: 'Felicity Marcaida',
      position: 'FSOFS President',
      imageNoBg: FSOFS_PRES_NB,
      imageBg: FSOFS_PRES_BG,
    },
  },
];