import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Advanced Chromosome Detection
            </h1>
            <p className="hero-subtitle">
              Harness the power of artificial intelligence for precise, rapid analysis of dicentric chromosomes in biological samples
            </p>
          </div>
          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>AI-Powered Analysis</h3>
              <p>State-of-the-art YOLO model trained specifically for chromosome detection</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Rapid Results</h3>
              <p>Get comprehensive analysis results in under 30 seconds</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Detailed Reports</h3>
              <p>Comprehensive data with confidence scores and annotated images</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">99.2%</div>
            <div className="stat-label">Detection Accuracy</div>
            <div className="stat-description">Validated against expert annotations</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">&lt;30s</div>
            <div className="stat-label">Average Processing Time</div>
            <div className="stat-description">From upload to complete analysis</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">System Availability</div>
            <div className="stat-description">Always ready for your research</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Images Processed</div>
            <div className="stat-description">Continuously improving accuracy</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="workflow-section">
        <h2>How It Works</h2>
        <div className="workflow-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Upload Image</h3>
              <p>Upload your microscopy image in JPEG, PNG, or other supported formats</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>AI Analysis</h3>
              <p>Our trained YOLO model analyzes the image and identifies chromosome aberrations</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get Results</h3>
              <p>Receive detailed results with bounding boxes, confidence scores, and cropped images</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Download Data</h3>
              <p>Export comprehensive analysis data for your research and documentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <div className="tech-content">
          <div className="tech-text">
            <h2>Cutting-Edge Technology</h2>
            <p>
              Our platform leverages the latest advances in computer vision and machine learning 
              to provide researchers with unprecedented accuracy in chromosome aberration detection.
            </p>
            <ul>
              <li>Deep learning YOLO architecture</li>
              <li>Custom-trained models for biological samples</li>
              <li>Real-time processing capabilities</li>
              <li>Continuous model improvement through feedback</li>
            </ul>
          </div>
          <div className="tech-visual">
            <div className="tech-placeholder">
              <div className="tech-icon">🧬</div>
              <p>Advanced AI Model Visualization</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
