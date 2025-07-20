import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen, activeSection, setActiveSection }) => {
  const menuItems = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: '⚕️',
      description: 'Research Overview & Analytics'
    },
    {
      id: 'detect',
      label: 'Chromosome Analysis',
      icon: '🧬',
      description: 'AI-Powered Dicentric Detection'
    },
    {
      id: 'results',
      label: 'Interactive Results',
      icon: '🔍',
      description: 'Visual Detection Analysis'
    },
    {
      id: 'download',
      label: 'Research Data',
      icon: '📊',
      description: 'Export Analysis Results'
    },
    {
      id: 'about',
      label: 'Methodology',
      icon: '🔬',
      description: 'Scientific Approach & Validation'
    }
  ];

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    if (window.innerWidth <= 768) {
      setIsOpen(false); // Close sidebar on mobile after selection
    }
  };

  // On desktop, determine if we should show collapsed or expanded
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
  const showCollapsed = isDesktop && !isOpen;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && typeof window !== 'undefined' && window.innerWidth <= 768 && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <nav className={`sidebar ${isOpen ? 'sidebar-expanded' : 'sidebar-collapsed'} ${showCollapsed ? 'sidebar-icons-only' : ''}`}>
        <div className="sidebar-header">
          {!showCollapsed && (
            <div className="logo-container">
              <img 
                src="/orise-primary-h-white.jpg" 
                alt="ORISE" 
                className="sidebar-logo"
              />
            </div>
          )}
          {!showCollapsed && <h3 className="sidebar-title">Cancer Research Platform</h3>}
        </div>

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeSection === item.id ? 'active' : ''} ${showCollapsed ? 'menu-item-collapsed' : ''}`}
              onClick={() => handleMenuClick(item.id)}
              title={showCollapsed ? item.label : ''}
            >
              <span className="menu-icon">{item.icon}</span>
              {!showCollapsed && (
                <div className="menu-content">
                  <span className="menu-label">{item.label}</span>
                  <span className="menu-description">{item.description}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {!showCollapsed && (
          <div className="sidebar-footer">
            <div className="footer-info">
              <p>ORISE 2025</p>
              <p>Cancer Research Initiative</p>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Sidebar;
