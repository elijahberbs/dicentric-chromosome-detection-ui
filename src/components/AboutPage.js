import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* Header Section */}
        <section className="about-header">
          <h1>About Our Platform</h1>
          <p>
            Discover the science and technology behind our advanced dicentric chromosome detection system
          </p>
        </section>

        {/* ORISE Section */}
        <section className="orise-section">
          <div className="content-grid">
            <div className="text-content">
              <h2>ORISE - Oak Ridge Institute for Science and Education</h2>
              <p>
                The Oak Ridge Institute for Science and Education (ORISE) is a premier institution 
                dedicated to advancing scientific education and research. With decades of experience 
                in nuclear science, health physics, and biological research, ORISE continues to 
                push the boundaries of scientific knowledge.
              </p>
              <p>
                Our commitment to excellence in scientific research drives us to develop cutting-edge 
                technologies that benefit researchers, medical professionals, and the broader scientific community.
              </p>
            </div>
            <div className="logo-showcase">
              <img 
                src="/orise-primary-h-white.jpg" 
                alt="ORISE Logo" 
                className="about-logo"
              />
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="technology-details">
          <h2>Advanced AI Technology</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-icon">🧠</div>
              <h3>Deep Learning Architecture</h3>
              <p>
                Our system utilizes a state-of-the-art YOLO (You Only Look Once) neural network 
                architecture, specifically trained and optimized for biological image analysis.
              </p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">🔬</div>
              <h3>Specialized Training Dataset</h3>
              <p>
                The model has been trained on thousands of carefully annotated microscopy images, 
                ensuring high accuracy in detecting chromosome aberrations.
              </p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">⚡</div>
              <h3>Real-time Processing</h3>
              <p>
                Optimized algorithms enable rapid analysis, providing results in under 30 seconds 
                while maintaining exceptional accuracy standards.
              </p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">📊</div>
              <h3>Comprehensive Analytics</h3>
              <p>
                Detailed output includes confidence scores, bounding box coordinates, cropped images, 
                and annotated visualizations for thorough analysis.
              </p>
            </div>
          </div>
        </section>

        {/* Research Applications */}
        <section className="applications-section">
          <h2>Research Applications</h2>
          <div className="applications-grid">
            <div className="application-item">
              <h3>🏥 Medical Research</h3>
              <p>Supporting clinical studies and diagnostic research in genetics and oncology</p>
            </div>
            <div className="application-item">
              <h3>☢️ Radiation Biology</h3>
              <p>Analyzing chromosome damage from radiation exposure for safety assessments</p>
            </div>
            <div className="application-item">
              <h3>🧬 Genetic Studies</h3>
              <p>Facilitating research into genetic disorders and chromosome abnormalities</p>
            </div>
            <div className="application-item">
              <h3>🔬 Academic Research</h3>
              <p>Supporting university research programs and educational initiatives</p>
            </div>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="metrics-section">
          <h2>Performance & Validation</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">99.2%</div>
              <div className="metric-label">Detection Accuracy</div>
              <div className="metric-description">
                Validated against expert cytogeneticist annotations across diverse sample types
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-value">0.8%</div>
              <div className="metric-label">False Positive Rate</div>
              <div className="metric-description">
                Minimal false positives ensure reliable results for research applications
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-value">1.2%</div>
              <div className="metric-label">False Negative Rate</div>
              <div className="metric-description">
                Low miss rate provides confidence in comprehensive detection coverage
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-value">25s</div>
              <div className="metric-label">Average Processing Time</div>
              <div className="metric-description">
                Rapid analysis enables high-throughput research workflows
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <h2>Get Involved</h2>
          <div className="contact-content">
            <p>
              Interested in collaborating or learning more about our chromosome detection platform? 
              We welcome partnerships with research institutions, medical facilities, and academic organizations.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Research Partnerships</strong>
                <p>Explore collaboration opportunities with ORISE research teams</p>
              </div>
              <div className="contact-item">
                <strong>Technical Support</strong>
                <p>Get assistance with platform integration and customization</p>
              </div>
              <div className="contact-item">
                <strong>Training & Education</strong>
                <p>Access educational resources and training programs</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
