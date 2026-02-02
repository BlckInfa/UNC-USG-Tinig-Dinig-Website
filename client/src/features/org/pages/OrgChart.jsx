import { Card } from '../../../components';
import './OrgChart.css';

/**
 * Organization Chart Page
 */
const OrgChart = () => {
  const orgStructure = {
    president: {
      name: 'President',
      holder: 'John Doe',
      image: null,
    },
    vicePresident: {
      name: 'Vice President',
      holder: 'Jane Smith',
      image: null,
    },
    departments: [
      { name: 'Secretary', holder: 'Alice Johnson' },
      { name: 'Treasurer', holder: 'Bob Williams' },
      { name: 'Auditor', holder: 'Carol Brown' },
      { name: 'PRO', holder: 'David Lee' },
    ],
  };

  return (
    <div className="org-chart-page">
      <div className="org-header">
        <h2>Organization Structure</h2>
        <p className="org-subtitle">University Student Government Officers</p>
      </div>

      <div className="org-chart">
        {/* President */}
        <div className="org-level president-level">
          <Card className="officer-card president">
            <div className="officer-avatar">
              {orgStructure.president.holder.charAt(0)}
            </div>
            <h3 className="officer-name">{orgStructure.president.holder}</h3>
            <span className="officer-position">{orgStructure.president.name}</span>
          </Card>
        </div>

        <div className="org-connector vertical"></div>

        {/* Vice President */}
        <div className="org-level vp-level">
          <Card className="officer-card vice-president">
            <div className="officer-avatar">
              {orgStructure.vicePresident.holder.charAt(0)}
            </div>
            <h3 className="officer-name">{orgStructure.vicePresident.holder}</h3>
            <span className="officer-position">{orgStructure.vicePresident.name}</span>
          </Card>
        </div>

        <div className="org-connector vertical"></div>

        {/* Departments */}
        <div className="org-level departments-level">
          {orgStructure.departments.map((dept, index) => (
            <Card key={index} className="officer-card department">
              <div className="officer-avatar small">
                {dept.holder.charAt(0)}
              </div>
              <h3 className="officer-name">{dept.holder}</h3>
              <span className="officer-position">{dept.name}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
