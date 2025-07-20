import React from 'react';
import './Header.css';

const Header = ({ sidebarOpen, setSidebarOpen, activeSection }) => {
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'home':
        return 'Cancer Research Dashboard';
      case 'detect':
        return 'Chromosome Analysis';
      case 'results':
        return 'Interactive Results';
      case 'download':
        return 'Research Data Export';
      case 'about':
        return 'Scientific Methodology';
      default:
        return 'Cancer Research Platform';
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'home':
        return 'Advanced AI-powered platform for dicentric chromosome analysis in cancer research and radiation biodosimetry';
      case 'detect':
        return 'Upload microscopy images for automated dicentric chromosome detection and quantitative analysis';
      case 'results':
        return 'Interactive visualization of detected chromosomes with detailed analysis and hover-based inspection';
      case 'download':
        return 'Export comprehensive research data including statistical analysis and annotated detection results';
      case 'about':
        return 'Scientific methodology, validation studies, and technological framework for chromosome aberration analysis';
      default:
        return 'Professional chromosome analysis platform for cancer research';
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="hamburger-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle navigation menu"
        >
          <div className={`hamburger ${sidebarOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <div className="header-title-section">
          <h1 className="header-title">{getSectionTitle()}</h1>
          <p className="header-description">{getSectionDescription()}</p>
        </div>
      </div>

    </header>
  );
};

export default Header;
