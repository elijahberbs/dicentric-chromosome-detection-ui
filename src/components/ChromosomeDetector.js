import React, { useState, useRef } from 'react';
import { useChromosomeDetection } from '../hooks/useChromosomeDetection';
import './ChromosomeDetector.css';

/**
 * Component for uploading images and detecting chromosomes
 */
const ChromosomeDetector = ({ onDetectionComplete }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    detectChromosomes,
    isDetecting,
    error,
    results,
    uploadedFile,
    clearResults,
    clearError,
  } = useChromosomeDetection();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    
    // Create preview URL
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    // Clear previous results and errors
    clearResults();
    clearError();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDetect = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    // For testing, add a mock data option
    const useMockData = window.location.search.includes('mock=true');
    
    let detectionResults;
    
    if (useMockData) {
      // Mock data for testing with new CNN classification format
      detectionResults = {
        success: true,
        session_id: 'mock-session-123',
        filename: selectedFile.name,
        total_detections: 3,
        all_detections_image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', // 1x1 transparent pixel
        all_detections_download_url: '/download/mock-session-123/all-detections',
        classification_summary: {
          total_detections: 3,
          dicentric_count: 2,
          non_dicentric_count: 1,
          classification_success_rate: 1.0
        },
        detections: [
          {
            id: 0,
            class_name: 'chromosome',
            confidence: 0.95,
            bounding_box: { x1: 100, y1: 150, x2: 180, y2: 270 },
            cropped_image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            bbox_image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            cnn_classification: {
              predicted_class: 'dicentric',
              confidence: 0.92,
              probabilities: {
                dicentric: 0.92,
                not_dicentric: 0.08
              }
            }
          },
          {
            id: 1,
            class_name: 'chromosome',
            confidence: 0.88,
            bounding_box: { x1: 250, y1: 200, x2: 325, y2: 310 },
            cropped_image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            bbox_image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            cnn_classification: {
              predicted_class: 'not_dicentric',
              confidence: 0.85,
              probabilities: {
                dicentric: 0.15,
                not_dicentric: 0.85
              }
            }
          },
          {
            id: 2,
            class_name: 'chromosome',
            confidence: 0.92,
            bounding_box: { x1: 400, y1: 100, x2: 485, y2: 225 },
            cropped_image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            bbox_image: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
            cnn_classification: {
              predicted_class: 'dicentric',
              confidence: 0.89,
              probabilities: {
                dicentric: 0.89,
                not_dicentric: 0.11
              }
            }
          }
        ]
      };
      console.log('Using mock data for testing');
    } else {
      detectionResults = await detectChromosomes(selectedFile);
    }
    
    // Call the optional callback when detection completes with the fresh results
    if (onDetectionComplete && detectionResults) {
      // Include the uploaded file information in the results for use in InteractiveResults
      const enhancedResults = {
        ...detectionResults,
        uploadedFile: selectedFile, // Include the actual file object
        uploadedImageUrl: previewUrl // Include the preview URL (blob URL)
      };
      onDetectionComplete(enhancedResults);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    clearResults();
    clearError();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDetectionResults = (results) => {
    if (!results) return null;

    return (
      <div className="detection-results">
        <h4>Detection Results</h4>
        
        {/* Success message and Interactive Results button */}
        <div className="success-banner">
          <div className="success-message">
            <span className="success-icon">✅</span>
            <span>Analysis Complete! Found {results.total_detections || results.detections?.length || 0} chromosomes</span>
          </div>
          <button 
            className="interactive-results-button"
            onClick={() => onDetectionComplete && onDetectionComplete(results)}
          >
            <span className="button-icon">🔍</span>
            View Interactive Results
          </button>
        </div>

        <div className="results-summary">
          <div className="result-item">
            <strong>Total Detections:</strong> {results.total_detections || results.detections?.length || 0}
          </div>
          <div className="result-item">
            <strong>Session ID:</strong> {results.session_id || 'N/A'}
          </div>
          <div className="result-item">
            <strong>Original Filename:</strong> {results.filename || 'Unknown'}
          </div>
          {results.classification_summary && (
            <div className="classification-summary">
              <strong>Classification Summary:</strong>
              <div className="summary-stats">
                <div className="summary-item">
                  <span className="classification-badge dicentric">
                    Dicentric: {results.classification_summary.dicentric_count || results.classification_summary.dicentric || 0}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="classification-badge not_dicentric">
                    Non-Dicentric: {results.classification_summary.non_dicentric_count || results.classification_summary.not_dicentric || 0}
                  </span>
                </div>
                {results.classification_summary.classification_success_rate !== undefined && (
                  <div className="summary-item">
                    <span className="classification-badge total">
                      Success Rate: {(results.classification_summary.classification_success_rate * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          {results.all_detections_download_url && (
            <div className="result-item">
              <strong>Download URL:</strong> 
              <code>{results.all_detections_download_url}</code>
            </div>
          )}
        </div>

        {results.detections && results.detections.length > 0 && (
          <div className="detections-list">
            <h5>Individual Detections:</h5>
            <div className="detections-grid">
              {results.detections.map((detection, index) => (
                <div key={detection.id || index} className="detection-card">
                  <div className="detection-info">
                    <strong>Detection #{detection.id !== undefined ? detection.id : index}</strong>
                    {detection.class_name && (
                      <div>Class: {detection.class_name}</div>
                    )}
                    <div>Confidence: {(detection.confidence * 100).toFixed(1)}%</div>
                    <div>
                      Box: ({detection.bounding_box?.x1 || detection.bbox?.[0]}, {detection.bounding_box?.y1 || detection.bbox?.[1]}) - 
                      ({detection.bounding_box?.x2 || detection.bbox?.[2]}, {detection.bounding_box?.y2 || detection.bbox?.[3]})
                    </div>
                    {detection.cnn_classification && (
                      <div className="classification-info">
                        <div className="classification-title">CNN Classification:</div>
                        <div className="classification-result">
                          Type: <span className={`classification-type ${detection.cnn_classification.predicted_class}`}>
                            {detection.cnn_classification.predicted_class}
                          </span>
                        </div>
                        <div>
                          Confidence: {(detection.cnn_classification.confidence * 100).toFixed(1)}%
                        </div>
                        {detection.cnn_classification.probabilities && (
                          <div className="probabilities">
                            <div className="prob-title">Probabilities:</div>
                            {Object.entries(detection.cnn_classification.probabilities).map(([className, prob]) => (
                              <div key={className} className="prob-item">
                                {className}: {(prob * 100).toFixed(1)}%
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {detection.cropped_image && (
                    <img
                      src={`data:image/jpeg;base64,${detection.cropped_image}`}
                      alt={`Detected chromosome ${detection.id !== undefined ? detection.id : index + 1}`}
                      className="cropped-image"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {results.annotated_image && (
          <div className="annotated-image-section">
            <h5>Annotated Image with Bounding Boxes:</h5>
            <img
              src={`data:image/jpeg;base64,${results.annotated_image}`}
              alt="Annotated image with detections"
              className="annotated-image"
            />
          </div>
        )}

        {results.all_detections_download_url && (
          <div className="download-section">
            <h5>Download All Detections:</h5>
            <p>You can download all detections for this session using the session ID: <strong>{results.session_id}</strong></p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="chromosome-detector">
      <div className="detector-header">
        <h3>Chromosome Detection</h3>
        <p>Upload an image to detect and analyze chromosomes using AI</p>
      </div>

      <div className="upload-section">
        <div
          className={`drop-zone ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="file-input"
          />
          
          {!selectedFile ? (
            <div className="drop-zone-content">
              <div className="upload-icon">📁</div>
              <p>Click to select an image or drag and drop</p>
              <span className="file-types">Supports: JPEG, PNG, GIF, BMP (max 50MB)</span>
            </div>
          ) : (
            <div className="file-preview">
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="preview-image" />
              )}
              <div className="file-info">
                <strong>{selectedFile.name}</strong>
                <div>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button
            onClick={handleDetect}
            disabled={!selectedFile || isDetecting}
            className={`detect-button ${isDetecting ? 'detecting' : ''}`}
          >
            {isDetecting ? (
              <span className="loading-text">
                <span className="spinner"></span>
                Analyzing...
              </span>
            ) : (
              'Detect Chromosomes'
            )}
          </button>

          {selectedFile && (
            <button onClick={handleClear} className="clear-button" disabled={isDetecting}>
              Clear
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={clearError} className="error-close">×</button>
          </div>
        )}
      </div>

      {results && formatDetectionResults(results)}
    </div>
  );
};

export default ChromosomeDetector;
