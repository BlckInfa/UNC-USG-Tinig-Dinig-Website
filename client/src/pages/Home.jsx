import { Link } from 'react-router-dom';
import { Button, Card } from '../components';
import './Home.css';

/**
 * Home Page
 */
const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            UNC University Student Government
          </h1>
          <p className="hero-subtitle">
            Tinig Dinig - Your voice matters. Submit your concerns, track progress, 
            and stay informed about student government activities.
          </p>
          <div className="hero-actions">
            <Link to="/register">
              <Button variant="primary" size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <div className="features-grid">
            <Card title="Tinig Dinig" hoverable>
              <p>Submit your concerns, suggestions, and feedback directly to the student government.</p>
            </Card>
            <Card title="Financial Transparency" hoverable>
              <p>Track how student funds are being utilized with complete transparency.</p>
            </Card>
            <Card title="Organization" hoverable>
              <p>Know your student government officers and their responsibilities.</p>
            </Card>
            <Card title="Reports & Updates" hoverable>
              <p>Stay updated with the latest activities and reports from the USG.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
