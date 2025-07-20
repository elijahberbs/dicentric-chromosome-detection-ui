import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './components/HomePage';
import DetectionsDownloader from './components/DetectionsDownloader';
import ChromosomeDetector from './components/ChromosomeDetector';
import InteractiveResults from './components/InteractiveResults';
import AboutPage from './components/AboutPage';

function App() {
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [detectionResults, setDetectionResults] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        // On desktop, start with collapsed sidebar (icon-only mode)
        setSidebarOpen(false);
      } else {
        // On mobile, start with sidebar hidden
        setSidebarOpen(false);
      }
    };

    // Set initial state based on screen size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownloadComplete = (sessionId) => {
    console.log(`Download completed for session: ${sessionId}`);
  };

  const handleDetectionComplete = (results) => {
    console.log('=== DETECTION COMPLETE DEBUG ===');
    console.log('Raw results received:', results);
    console.log('Results type:', typeof results);
    console.log('Results keys:', results ? Object.keys(results) : 'null');
    
    if (results) {
      console.log('Has detections property?', 'detections' in results);
      console.log('Has data property?', 'data' in results);
      console.log('Has results property?', 'results' in results);
      
      // Check nested structures
      if (results.data) {
        console.log('data keys:', Object.keys(results.data));
        console.log('data.detections?', 'detections' in results.data);
      }
      
      if (results.results) {
        console.log('results keys:', Object.keys(results.results));
        console.log('results.detections?', 'detections' in results.results);
      }
      
      // Look for detections array anywhere
      const detections = results.detections || 
                        results.data?.detections || 
                        results.results?.detections || 
                        [];
      console.log('Found detections array:', detections);
      console.log('Detections is array?', Array.isArray(detections));
      console.log('Detections length:', detections.length);
    }
    
    console.log('=== END DEBUG ===');
    
    setDetectionResults(results);
    if (results && (results.session_id || results.data?.session_id)) {
      const sessionId = results.session_id || results.data?.session_id;
      setCurrentSessionId(sessionId);
      // Auto-switch to interactive results section after detection
      setActiveSection('results');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage />;
      case 'detect':
        return (
          <div className="page-content">
            <ChromosomeDetector onDetectionComplete={handleDetectionComplete} />
          </div>
        );
      case 'results':
        return (
          <InteractiveResults 
            detectionResults={detectionResults}
            onBackToAnalysis={() => setActiveSection('detect')}
          />
        );
      case 'download':
        return (
          <div className="page-content">
            <DetectionsDownloader 
              sessionId={currentSessionId} 
              onDownloadComplete={handleDownloadComplete} 
            />
          </div>
        );
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      <div className={`main-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSection={activeSection}
        />
        
        <main className="main-content">
          {renderContent()}
        </main>
        
        <footer className="app-footer">
          <div className="footer-content">
            <p>&copy; 2025 ORISE - Oak Ridge Institute for Science and Education</p>
            <p>Advanced AI for Chromosome Analysis</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
