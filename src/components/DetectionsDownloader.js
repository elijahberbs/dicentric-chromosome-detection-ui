import React, { useState } from 'react';
import { useDetectionsDownload } from '../hooks/useDetectionsDownload';
import './DetectionsDownloader.css';

/**
 * Component for downloading all detections for a given session
 */
const DetectionsDownloader = ({ sessionId: propSessionId, onDownloadComplete }) => {
  const [inputSessionId, setInputSessionId] = useState(propSessionId || '');
  const {
    downloadAllDetections,
    isDownloading,
    error,
    lastDownloadedSession,
    clearError,
  } = useDetectionsDownload();

  const handleDownload = async () => {
    const sessionId = propSessionId || inputSessionId;
    if (!sessionId.trim()) {
      alert('Please enter a session ID');
      return;
    }

    await downloadAllDetections(sessionId.trim());
    
    // Call the optional callback when download completes
    if (onDownloadComplete) {
      onDownloadComplete(sessionId.trim());
    }
  };

  const handleInputChange = (e) => {
    setInputSessionId(e.target.value);
    if (error) {
      clearError();
    }
  };

  return (
    <div className="detections-downloader">
      <div className="downloader-header">
        <h3>Download All Detections</h3>
        <p>Download all detections for a specific session as a compressed file.</p>
      </div>

      <div className="downloader-content">
        {!propSessionId && (
          <div className="input-group">
            <label htmlFor="session-id-input">Session ID:</label>
            <input
              id="session-id-input"
              type="text"
              value={inputSessionId}
              onChange={handleInputChange}
              placeholder="Enter session ID"
              disabled={isDownloading}
              className={error ? 'input-error' : ''}
            />
          </div>
        )}

        {propSessionId && (
          <div className="session-info">
            <strong>Session ID:</strong> {propSessionId}
          </div>
        )}

        <button
          onClick={handleDownload}
          disabled={isDownloading || (!propSessionId && !inputSessionId.trim())}
          className={`download-button ${isDownloading ? 'downloading' : ''}`}
        >
          {isDownloading ? (
            <span className="loading-text">
              <span className="spinner"></span>
              Downloading...
            </span>
          ) : (
            'Download All Detections'
          )}
        </button>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={clearError} className="error-close">
              ×
            </button>
          </div>
        )}

        {lastDownloadedSession && !error && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            Successfully downloaded detections for session: {lastDownloadedSession}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectionsDownloader;
