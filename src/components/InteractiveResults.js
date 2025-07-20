import React, { useState, useRef, useEffect } from 'react';
import './InteractiveResults.css';

const InteractiveResults = ({ detectionResults, onBackToAnalysis }) => {
  const [hoveredDetection, setHoveredDetection] = useState(null);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [showAnnotatedImage, setShowAnnotatedImage] = useState(false); // Default to original image, toggle to annotated
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const chromosomeItemRefs = useRef([]); // Refs for scrolling to chromosome items

  // Debug: Log when hoveredDetection changes
  useEffect(() => {
    console.log('hoveredDetection state changed to:', hoveredDetection);
  }, [hoveredDetection]);

  // Debug: Log when selectedDetection changes
  useEffect(() => {
    console.log('selectedDetection state changed to:', selectedDetection);
  }, [selectedDetection]);

  // Handle window resize to update image dimensions
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current && imageLoaded && imageDimensions.natural) {
        const containerRect = imageRef.current.getBoundingClientRect();
        const { naturalWidth, naturalHeight } = imageDimensions.natural;
        
        // Recalculate dimensions and offset
        const containerAspect = containerRect.width / containerRect.height;
        const imageAspect = naturalWidth / naturalHeight;
        
        let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
        
        if (imageAspect > containerAspect) {
          displayWidth = containerRect.width;
          displayHeight = containerRect.width / imageAspect;
          offsetY = (containerRect.height - displayHeight) / 2;
        } else {
          displayHeight = containerRect.height;
          displayWidth = containerRect.height * imageAspect;
          offsetX = (containerRect.width - displayWidth) / 2;
        }
        
        setImageDimensions(prev => ({
          natural: prev.natural,
          display: { width: displayWidth, height: displayHeight },
          offset: { x: offsetX, y: offsetY },
          container: { width: containerRect.width, height: containerRect.height }
        }));
        console.log('Window resized - updated dimensions and offset:', { displayWidth, displayHeight, offsetX, offsetY });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageLoaded, imageDimensions.natural]);

  // Extract actual data from the API response structure
  const getActualData = () => {
    if (!detectionResults) return null;
    
    console.log('=== EXTRACTING ACTUAL DATA ===');
    console.log('detectionResults received:', detectionResults);
    console.log('detectionResults type:', typeof detectionResults);
    console.log('detectionResults keys:', Object.keys(detectionResults));
    
    let actualData = detectionResults;
    
    // If the API returns {success: true, data: {...}}, extract the data
    if (detectionResults.success && detectionResults.data) {
      console.log('Found data in success response');
      console.log('detectionResults.data keys:', Object.keys(detectionResults.data));
      actualData = detectionResults.data;
    }
    // If the API returns {success: true, results: {...}}, extract the results
    else if (detectionResults.success && detectionResults.results) {
      console.log('Found results in success response');
      console.log('detectionResults.results keys:', Object.keys(detectionResults.results));
      actualData = detectionResults.results;
    }
    // If the API returns the data directly
    else if (detectionResults.detections || detectionResults.annotated_image) {
      console.log('Using direct data structure');
      actualData = detectionResults;
    }
    // Check if it's wrapped in another level
    else if (detectionResults.data && typeof detectionResults.data === 'object') {
      console.log('Found nested data structure');
      console.log('detectionResults.data keys:', Object.keys(detectionResults.data));
      actualData = detectionResults.data;
    }
    else {
      console.log('No recognized data structure found, using original');
      actualData = detectionResults;
    }
    
    console.log('Final actualData to use:', actualData);
    console.log('Final actualData keys:', actualData ? Object.keys(actualData) : 'null');
    
    // Debug: Check what image-related fields are available
    if (actualData) {
      const imageFields = Object.keys(actualData).filter(key => 
        key.toLowerCase().includes('image') || 
        key.toLowerCase().includes('url') ||
        key.toLowerCase().includes('base64')
      );
      console.log('InteractiveResults - Image-related fields found:', imageFields);
      imageFields.forEach(field => {
        const value = actualData[field];
        if (typeof value === 'string') {
          console.log(`  ${field}:`, typeof value, value.slice(0, 100) + (value.length > 100 ? '...' : ''));
        } else {
          console.log(`  ${field}:`, typeof value, value);
        }
      });
    }
    
    console.log('=== END EXTRACTION ===');
    
    return actualData;
  };

  const actualData = getActualData();

  // Handle image load to get actual dimensions
  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const containerRect = imageRef.current.getBoundingClientRect();
      
      // Calculate the actual displayed image dimensions within the container
      // when using object-fit: contain
      const containerAspect = containerRect.width / containerRect.height;
      const imageAspect = naturalWidth / naturalHeight;
      
      let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
      
      if (imageAspect > containerAspect) {
        // Image is wider - fit to width, letterbox top/bottom
        displayWidth = containerRect.width;
        displayHeight = containerRect.width / imageAspect;
        offsetY = (containerRect.height - displayHeight) / 2;
      } else {
        // Image is taller - fit to height, letterbox left/right
        displayHeight = containerRect.height;
        displayWidth = containerRect.height * imageAspect;
        offsetX = (containerRect.width - displayWidth) / 2;
      }
      
      console.log('=== IMAGE DIMENSIONS DEBUG ===');
      console.log('Natural dimensions:', naturalWidth, 'x', naturalHeight);
      console.log('Container dimensions:', containerRect.width, 'x', containerRect.height);
      console.log('Actual display dimensions:', displayWidth, 'x', displayHeight);
      console.log('Image offset:', { offsetX, offsetY });
      console.log('Aspect ratios:', { container: containerAspect, image: imageAspect });
      console.log('Scale factors:', {
        scaleX: displayWidth / naturalWidth,
        scaleY: displayHeight / naturalHeight
      });
      console.log('=== END IMAGE DIMENSIONS DEBUG ===');
      
      setImageDimensions({
        natural: { width: naturalWidth, height: naturalHeight },
        display: { width: displayWidth, height: displayHeight },
        offset: { x: offsetX, y: offsetY },
        container: { width: containerRect.width, height: containerRect.height }
      });
      setImageLoaded(true);
    }
  };

  // Recalculate image dimensions when detail panel visibility changes
  useEffect(() => {
    if (imageRef.current && imageLoaded) {
      // Small delay to ensure DOM updates are complete
      const timer = setTimeout(() => {
        handleImageLoad();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedDetection]); // Recalculate when selection changes

  // Calculate scaled coordinates for display
  const getScaledCoordinates = (detection) => {
    if (!imageDimensions.natural || !imageDimensions.display) return null;
    
    console.log('getScaledCoordinates - detection:', detection);
    
    // Handle different bounding box formats
    let bbox = null;
    
    if (detection.bbox) {
      bbox = detection.bbox;
    } else if (detection.bounding_box) {
      bbox = detection.bounding_box;
    } else if (detection.box) {
      bbox = detection.box;
    } else if (Array.isArray(detection.coordinates)) {
      // [x, y, width, height] format
      bbox = {
        x: detection.coordinates[0],
        y: detection.coordinates[1],
        width: detection.coordinates[2],
        height: detection.coordinates[3]
      };
    } else if (detection.x !== undefined && detection.y !== undefined) {
      // Direct x, y, width, height properties
      bbox = {
        x: detection.x,
        y: detection.y,
        width: detection.width || detection.w,
        height: detection.height || detection.h
      };
    }
    
    if (!bbox) {
      console.log('No valid bbox found for detection:', detection);
      return null;
    }
    
    console.log('Found bbox:', bbox);
    
    // Handle different bbox coordinate formats
    let finalBbox = null;
    
    // Check if it's x1, y1, x2, y2 format (corners)
    if (bbox.x1 !== undefined && bbox.y1 !== undefined && bbox.x2 !== undefined && bbox.y2 !== undefined) {
      finalBbox = {
        x: bbox.x1,
        y: bbox.y1,
        width: bbox.x2 - bbox.x1,
        height: bbox.y2 - bbox.y1
      };
      console.log('Converted x1,y1,x2,y2 to x,y,width,height:', finalBbox);
    }
    // Check if it's already x, y, width, height format
    else if (bbox.x !== undefined && bbox.y !== undefined && bbox.width !== undefined && bbox.height !== undefined) {
      finalBbox = bbox;
      console.log('Using existing x,y,width,height format:', finalBbox);
    }
    // Check for other possible formats
    else if (bbox.left !== undefined && bbox.top !== undefined && bbox.right !== undefined && bbox.bottom !== undefined) {
      finalBbox = {
        x: bbox.left,
        y: bbox.top,
        width: bbox.right - bbox.left,
        height: bbox.bottom - bbox.top
      };
      console.log('Converted left,top,right,bottom to x,y,width,height:', finalBbox);
    }
    
    if (!finalBbox) {
      console.log('Could not convert bbox to x,y,width,height format:', bbox);
      return null;
    }
    
    // Ensure bbox has required properties and valid values
    if (finalBbox.x === undefined || finalBbox.y === undefined || finalBbox.width === undefined || finalBbox.height === undefined) {
      console.log('Final bbox missing required properties:', finalBbox);
      return null;
    }
    
    if (finalBbox.width <= 0 || finalBbox.height <= 0) {
      console.log('Final bbox has invalid dimensions:', finalBbox);
      return null;
    }

    const scaleX = imageDimensions.display.width / imageDimensions.natural.width;
    const scaleY = imageDimensions.display.height / imageDimensions.natural.height;

    const scaledCoords = {
      x: (finalBbox.x * scaleX) + imageDimensions.offset.x,
      y: (finalBbox.y * scaleY) + imageDimensions.offset.y,
      width: finalBbox.width * scaleX,
      height: finalBbox.height * scaleY
    };
    
    console.log('=== COORDINATE SCALING DEBUG ===');
    console.log('Original bbox (image coords):', finalBbox);
    console.log('Image natural size:', imageDimensions.natural);
    console.log('Image display size:', imageDimensions.display);
    console.log('Image offset:', imageDimensions.offset);
    console.log('Scale factors:', { scaleX, scaleY });
    console.log('Scaled coordinates (with offset):', scaledCoords);
    console.log('=== END COORDINATE SCALING DEBUG ===');
    
    return scaledCoords;
  };

  // Get statistics
  const getStatistics = (data = actualData) => {
    // First, try to use the classification_summary from the new API response
    if (data?.classification_summary) {
      console.log('getStatistics - using classification_summary:', data.classification_summary);
      
      return {
        total: data.classification_summary.total_detections || 0,
        dicentric: data.classification_summary.dicentric_count || 0,
        monocentric: data.classification_summary.non_dicentric_count || 0,
        classification_success_rate: data.classification_summary.classification_success_rate
      };
    }
    
    // Fallback to manual counting from detections array
    const detections = data?.detections || 
                      data?.data?.detections || 
                      data?.results?.detections || 
                      [];
    
    console.log('getStatistics - fallback to detections counting:', detections);
    console.log('getStatistics - is array?', Array.isArray(detections));
    console.log('getStatistics - length:', detections.length);
    
    if (!Array.isArray(detections) || detections.length === 0) {
      return { total: 0, dicentric: 0, monocentric: 0 };
    }
    
    // Count based on CNN classification if available, otherwise use original classification
    const dicentric = detections.filter(d => {
      // Prioritize CNN classification
      if (d.cnn_classification?.predicted_class) {
        return d.cnn_classification.predicted_class === 'dicentric';
      }
      // Fallback to original classification methods
      return (d.classification === 'dicentric') || 
             (d.class_name === 'dicentric') ||
             (d.label === 'dicentric');
    }).length;
    
    const monocentric = detections.filter(d => {
      // Prioritize CNN classification  
      if (d.cnn_classification?.predicted_class) {
        return d.cnn_classification.predicted_class === 'not_dicentric';
      }
      // Fallback to original classification methods
      return (d.classification === 'monocentric') || 
             (d.class_name === 'monocentric') ||
             (d.label === 'monocentric') ||
             (d.classification === 'not_dicentric') || 
             (d.class_name === 'not_dicentric') ||
             (d.label === 'not_dicentric');
    }).length;
    
    return {
      total: detections.length,
      dicentric,
      monocentric
    };
  };

  const stats = getStatistics();

  // Function to scroll to a specific chromosome item
  const scrollToChromosomeItem = (index) => {
    if (chromosomeItemRefs.current[index]) {
      // Get the chromosome list container
      const listContainer = chromosomeItemRefs.current[index].closest('.chromosome-list');
      const targetElement = chromosomeItemRefs.current[index];
      
      if (listContainer && targetElement) {
        // Calculate scroll position relative to the list container
        const containerRect = listContainer.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const currentScrollTop = listContainer.scrollTop;
        
        // Calculate the position to center the target in the container
        const targetScrollTop = currentScrollTop + targetRect.top - containerRect.top - (containerRect.height / 2) + (targetRect.height / 2);
        
        // Smooth scroll within the container only
        listContainer.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
        
        // Add highlight effect
        targetElement.classList.add('highlight-scroll');
        setTimeout(() => {
          targetElement.classList.remove('highlight-scroll');
        }, 1000);
      }
    }
  };

  if (!detectionResults) {
    return (
      <div className="interactive-results-error">
        <h3>No Detection Results</h3>
        <p>Please run chromosome analysis first to view interactive results.</p>
        <button onClick={onBackToAnalysis} className="back-btn">
          Back to Analysis
        </button>
      </div>
    );
  }

  if (!actualData) {
    return (
      <div className="interactive-results-error">
        <h3>No Valid Data Found</h3>
        <p>Could not extract valid detection data from the API response.</p>
        <p>Raw data keys: {JSON.stringify(Object.keys(detectionResults), null, 2)}</p>
        <p>Raw data: {JSON.stringify(detectionResults, null, 2)}</p>
        <button onClick={onBackToAnalysis} className="back-btn">
          Back to Analysis
        </button>
      </div>
    );
  }

  console.log('=== IMAGE URL DEBUG ===');
  console.log('actualData:', actualData);
  console.log('actualData keys:', Object.keys(actualData));
  
  // Check all possible image field variations
  const possibleImageFields = [
    'image_url', 'annotated_image_url', 'original_image_url', 'annotated_image',
    'imageUrl', 'annotatedImageUrl', 'originalImageUrl', 'annotatedImage',
    'image', 'result_image', 'output_image', 'processed_image',
    'base64_image', 'image_data', 'img_url', 'img', 'all_detections_image'
  ];
  
  console.log('=== CHECKING ALL POSSIBLE IMAGE FIELDS ===');
  possibleImageFields.forEach(field => {
    if (actualData[field]) {
      console.log(`Found ${field}:`, typeof actualData[field] === 'string' ? actualData[field].substring(0, 100) + '...' : actualData[field]);
    }
  });
  
  // Also check if any field contains base64 data
  Object.keys(actualData).forEach(key => {
    const value = actualData[key];
    if (typeof value === 'string' && (value.startsWith('data:image') || value.startsWith('/9j/') || value.startsWith('iVBORw0KGgo'))) {
      console.log(`Found potential image data in field "${key}":`, value.substring(0, 100) + '...');
    }
  });
  
  console.log('=== END IMAGE FIELD CHECK ===');
  
  console.log('actualData.image_url:', actualData.image_url);
  console.log('actualData.annotated_image_url:', actualData.annotated_image_url);
  console.log('actualData.original_image_url:', actualData.original_image_url);
  console.log('actualData.annotated_image (length):', actualData.annotated_image?.length);
  console.log('detectionResults.uploadedImageUrl:', detectionResults.uploadedImageUrl);
  console.log('detectionResults.uploadedFile:', detectionResults.uploadedFile);
  console.log('=== END IMAGE URL DEBUG ===');

  // Check for image URL in various possible formats using the actual data
  // First priority: Use the uploaded image from the file selection
  const uploadedImageUrl = detectionResults.uploadedImageUrl || detectionResults.uploadedFile;
  
  console.log('=== UPLOADED IMAGE DEBUG ===');
  console.log('uploadedImageUrl:', uploadedImageUrl);
  console.log('detectionResults.uploadedImageUrl:', detectionResults.uploadedImageUrl);
  console.log('detectionResults.uploadedFile:', detectionResults.uploadedFile);
  console.log('=== END UPLOADED IMAGE DEBUG ===');
  
  // Second priority: Try to get the original uploaded image from API response, then fall back to processed images
  const imageUrl = uploadedImageUrl ||
                   actualData.original_image_url ||
                   actualData.originalImageUrl ||
                   actualData.uploaded_image ||
                   actualData.input_image ||
                   (actualData.original_image ? `data:image/jpeg;base64,${actualData.original_image}` : null) ||
                   (actualData.input_image_base64 ? `data:image/jpeg;base64,${actualData.input_image_base64}` : null) ||
                   // Then try processed/annotated images
                   actualData.image_url || 
                   actualData.annotated_image_url || 
                   actualData.imageUrl ||
                   actualData.annotatedImageUrl ||
                   actualData.image ||
                   actualData.result_image ||
                   actualData.output_image ||
                   actualData.processed_image ||
                   actualData.img_url ||
                   actualData.img ||
                   (actualData.all_detections_image ? `data:image/jpeg;base64,${actualData.all_detections_image}` : null) ||
                   (actualData.annotated_image ? `data:image/jpeg;base64,${actualData.annotated_image}` : null) ||
                   (actualData.annotatedImage ? `data:image/jpeg;base64,${actualData.annotatedImage}` : null) ||
                   (actualData.base64_image ? `data:image/jpeg;base64,${actualData.base64_image}` : null) ||
                   (actualData.image_data ? `data:image/jpeg;base64,${actualData.image_data}` : null);

  console.log('Final imageUrl:', imageUrl);

  // Get the annotated image URL/data first
  const annotatedImageUrl = actualData.image_url || 
                           actualData.annotated_image_url || 
                           actualData.annotatedImageUrl ||
                           actualData.image ||
                           actualData.result_image ||
                           actualData.output_image ||
                           actualData.processed_image ||
                           (actualData.all_detections_image ? `data:image/jpeg;base64,${actualData.all_detections_image}` : null) ||
                           (actualData.annotated_image ? `data:image/jpeg;base64,${actualData.annotated_image}` : null);

  // Get the original uploaded image URL/data
  // Prioritize the actual uploaded image file over API response fields
  const originalImageUrl = uploadedImageUrl ||
                          actualData.original_image_url ||
                          actualData.originalImageUrl ||
                          actualData.uploaded_image ||
                          actualData.input_image ||
                          actualData.original_image_data ||
                          actualData.originalImageData ||
                          actualData.input_image_url ||
                          actualData.inputImageUrl ||
                          actualData.source_image ||
                          actualData.sourceImage ||
                          (actualData.original_image ? `data:image/jpeg;base64,${actualData.original_image}` : null) ||
                          (actualData.input_image_base64 ? `data:image/jpeg;base64,${actualData.input_image_base64}` : null) ||
                          (actualData.source_image_base64 ? `data:image/jpeg;base64,${actualData.source_image_base64}` : null) ||
                          // Fallback to the main image only if no original is found
                          imageUrl;

  console.log('=== ORIGINAL IMAGE DETECTION ===');
  console.log('Checking uploadedImageUrl:', uploadedImageUrl);
  console.log('Checking original_image_url:', actualData.original_image_url);
  console.log('Checking originalImageUrl:', actualData.originalImageUrl);
  console.log('Checking uploaded_image:', actualData.uploaded_image);
  console.log('Checking input_image:', actualData.input_image);
  console.log('Checking source_image:', actualData.source_image);
  console.log('Final originalImageUrl:', originalImageUrl);
  console.log('=== END ORIGINAL IMAGE DETECTION ===');

  // Use the appropriate image based on toggle state
  // Default to showing the original uploaded image, with option to toggle to annotated
  const currentImageUrl = showAnnotatedImage ? (annotatedImageUrl || imageUrl) : (originalImageUrl || imageUrl);

  // Check if images are the same
  const imagesAreSame = originalImageUrl === annotatedImageUrl || 
                       (!annotatedImageUrl && originalImageUrl === imageUrl) ||
                       (originalImageUrl === imageUrl && annotatedImageUrl === imageUrl);

  console.log('Original image URL:', originalImageUrl);
  console.log('Annotated image URL:', annotatedImageUrl);
  console.log('Current image URL:', currentImageUrl);
  console.log('Show annotated:', showAnnotatedImage);
  console.log('Images are same:', imagesAreSame);

  if (!currentImageUrl) {
    return (
      <div className="interactive-results-error">
        <h3>Image Not Available</h3>
        <p>The analyzed image is not available for interactive viewing.</p>
        <p>actualData keys: {JSON.stringify(Object.keys(actualData), null, 2)}</p>
        <p>Looking for: image_url, annotated_image_url, original_image_url, annotated_image, imageUrl, image, result_image, etc.</p>
        <p>Found values:</p>
        <ul>
          <li>image_url: {actualData.image_url || 'undefined'}</li>
          <li>annotated_image_url: {actualData.annotated_image_url || 'undefined'}</li>
          <li>original_image_url: {actualData.original_image_url || 'undefined'}</li>
          <li>annotated_image: {actualData.annotated_image ? `${actualData.annotated_image.substring(0, 50)}...` : 'undefined'}</li>
          <li>image: {actualData.image || 'undefined'}</li>
          <li>result_image: {actualData.result_image || 'undefined'}</li>
          <li>all_detections_image: {actualData.all_detections_image ? `${actualData.all_detections_image.substring(0, 50)}...` : 'undefined'}</li>
        </ul>
        <div style={{marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
          <h4>Full actualData structure:</h4>
          <pre style={{fontSize: '12px', overflow: 'auto', maxHeight: '200px'}}>
            {JSON.stringify(actualData, null, 2)}
          </pre>
        </div>
        <button onClick={onBackToAnalysis} className="back-btn">
          Back to Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="interactive-results">
      <div className="results-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBackToAnalysis} className="back-btn">
              ← Back to Analysis
            </button>
            <div className="header-info">
              <h2>Interactive Detection Results</h2>
              <p>Toggle detection overlays and hover over detected chromosomes for details</p>
            </div>
          </div>
          
          <div className="header-controls">
            {/* Image Toggle Button */}
            <div className="image-toggle-container">
              <label className="toggle-label">View:</label>
              <button 
                className={`image-toggle-btn ${showAnnotatedImage ? 'active' : ''}`}
                onClick={() => setShowAnnotatedImage(true)}
                disabled={!annotatedImageUrl && !imageUrl}
              >
                🔍 With Detections
              </button>
              <button 
                className={`image-toggle-btn ${!showAnnotatedImage ? 'active' : ''}`}
                onClick={() => setShowAnnotatedImage(false)}
                disabled={!originalImageUrl && !imageUrl}
              >
                📷 Clean Image
              </button>
              {imagesAreSame && (
                <span className="same-image-indicator" title="Original and annotated images are the same">
                  ⚠️ Same image
                </span>
              )}
            </div>
            
            <div className="detection-stats">
              <div className="stat-card">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Detected</div>
              </div>
              <div className="stat-card dicentric">
                <div className="stat-number">{stats.dicentric}</div>
                <div className="stat-label">Dicentric</div>
              </div>
              <div className="stat-card monocentric">
                <div className="stat-number">{stats.monocentric}</div>
                <div className="stat-label">Non-Dicentric</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="results-content">
        <div className="image-container" ref={containerRef}>
          {/* Chromosome List Panel */}
          <div className="chromosome-list-panel">
            <div className="chromosome-list-header">
              <h3>Detected Chromosomes</h3>
              <span className="chromosome-count">
                {(() => {
                  const detections = actualData?.detections || 
                                   actualData?.data?.detections || 
                                   actualData?.results?.detections || 
                                   [];
                  return detections.length;
                })()}
              </span>
            </div>
            
            <div className="chromosome-list">
              {(() => {
                const detections = actualData?.detections || 
                                 actualData?.data?.detections || 
                                 actualData?.results?.detections || 
                                 [];
                
                if (!Array.isArray(detections) || detections.length === 0) {
                  return (
                    <div className="no-chromosomes">
                      No chromosomes detected
                    </div>
                  );
                }
                
                return detections.map((detection, index) => {
                  const classification = detection.classification || detection.class_name || detection.label || 'unknown';
                  const confidence = (detection.confidence * 100).toFixed(1);
                  
                  return (
                    <div
                      key={index}
                      ref={el => chromosomeItemRefs.current[index] = el}
                      className={`chromosome-item ${classification} ${selectedDetection === index ? 'selected' : ''} ${hoveredDetection === index ? 'hovered' : ''}`}
                      onClick={() => {
                        console.log('Clicked chromosome item:', index, detection);
                        setSelectedDetection(selectedDetection === index ? null : index);
                      }}
                      onMouseEnter={() => setHoveredDetection(index)}
                      onMouseLeave={() => setHoveredDetection(null)}
                    >
                      <div className="chromosome-preview">
                        {detection.cropped_image ? (
                          <img
                            src={`data:image/jpeg;base64,${detection.cropped_image}`}
                            alt={`Chromosome ${index + 1}`}
                            className="chromosome-thumbnail"
                          />
                        ) : (
                          <div className="chromosome-placeholder">
                            #{index + 1}
                          </div>
                        )}
                      </div>
                      
                      <div className="chromosome-info">
                        <div className="chromosome-header">
                          <span className="chromosome-number">#{index + 1}</span>
                          <span className={`chromosome-type ${classification}`}>
                            {classification}
                          </span>
                        </div>
                        <div className="chromosome-confidence">
                          {confidence}% confidence
                        </div>
                        {detection.cnn_classification && (
                          <div className="cnn-classification">
                            <div className="cnn-title">CNN:</div>
                            <div className={`cnn-result ${detection.cnn_classification.predicted_class}`}>
                              {detection.cnn_classification.predicted_class}
                              <span className="cnn-confidence">
                                ({(detection.cnn_classification.confidence * 100).toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="chromosome-position">
                          {(() => {
                            const bbox = detection.bbox || detection.bounding_box || detection.box;
                            if (bbox && bbox.x1 !== undefined && bbox.y1 !== undefined) {
                              return `(${bbox.x1}, ${bbox.y1})`;
                            }
                            return 'Position N/A';
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div className="main-image-wrapper">
            <img
              ref={imageRef}
              src={currentImageUrl}
              alt={showAnnotatedImage ? "Original Image with Detection Overlays" : "Original Uploaded Image"}
              className="analyzed-image"
              onLoad={handleImageLoad}
            />
            
            {/* Show overlay bounding boxes on the underlying original image when in annotated view mode */}
            {imageLoaded && showAnnotatedImage && (() => {
              // Get detections from various possible structures using actualData
              const detections = actualData?.detections || 
                               actualData?.data?.detections || 
                               actualData?.results?.detections || 
                               [];
              
              console.log('Overlay rendering - detections:', detections);
              
              if (!Array.isArray(detections) || detections.length === 0) {
                console.log('No detections found for overlay');
                return null;
              }
              
              // Debug the first detection to see its structure
              if (detections.length > 0) {
                console.log('First detection structure:', detections[0]);
                console.log('First detection keys:', Object.keys(detections[0]));
              }
              
              return (
                <div className="detection-overlay">
                  {detections.map((detection, index) => {
                    const coords = getScaledCoordinates(detection);
                    if (!coords) return null;

                    const classification = detection.classification || detection.class_name || detection.label || 'unknown';

                    return (
                      <div
                        key={index}
                        className={`detection-box ${classification} ${hoveredDetection === index ? 'hovered' : ''} ${selectedDetection === index ? 'selected' : ''}`}
                        style={{
                          left: `${coords.x}px`,
                          top: `${coords.y}px`,
                          width: `${coords.width}px`,
                          height: `${coords.height}px`,
                        }}
                        onMouseEnter={() => {
                          console.log('Mouse entered detection box:', index, detection);
                          setHoveredDetection(index);
                        }}
                        onMouseLeave={() => {
                          console.log('Mouse left detection box:', index);
                          setHoveredDetection(null);
                        }}
                        onClick={(e) => {
                          console.log('Clicked detection box:', index, detection);
                          setSelectedDetection(selectedDetection === index ? null : index);
                          
                          // Add pulse effect to the clicked box
                          const target = e.currentTarget;
                          target.classList.add('clicked');
                          setTimeout(() => target.classList.remove('clicked'), 300);
                          
                          // Scroll to the corresponding chromosome item in the list
                          if (selectedDetection !== index) {
                            scrollToChromosomeItem(index);
                          }
                        }}
                      >
                        <div className="detection-label">
                          <span className="detection-type">{classification}</span>
                          <span className="confidence">{(detection.confidence * 100).toFixed(1)}%</span>
                          {detection.cnn_classification && (
                            <span className={`cnn-classification-label ${detection.cnn_classification.predicted_class}`}>
                              CNN: {detection.cnn_classification.predicted_class}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            
            {/* Detailed view panel */}
            {selectedDetection !== null && (() => {
              console.log('Rendering detail panel for detection:', selectedDetection);
              
              const detections = actualData?.detections || 
                               actualData?.data?.detections || 
                               actualData?.results?.detections || 
                               [];
              
              const detection = detections[selectedDetection];
              console.log('Detection data for detail panel:', detection);
              
              if (!detection) {
                console.log('No detection found for index:', selectedDetection);
                return null;
              }
              
              const classification = detection.classification || detection.class_name || detection.label || 'unknown';
              
              return (
                <div className={`detail-panel visible`}>
                  <div className="detail-header">
                    <h3>Chromosome #{selectedDetection + 1}</h3>
                    <div className={`classification-badge ${classification}`}>
                      {classification}
                    </div>
                  </div>
                  
                  <div className="detail-content">
                    <div className="detail-image">
                      {detection.cropped_image_url ? (
                        <img
                          src={detection.cropped_image_url}
                          alt={`Chromosome ${hoveredDetection + 1}`}
                          className="cropped-chromosome"
                        />
                      ) : (
                        <div className="no-crop-available">
                          Cropped image not available
                        </div>
                      )}
                    </div>
                    
                    <div className="detail-stats">
                      <div className="detail-row">
                        <span className="label">Confidence:</span>
                        <span className="value">{(detection.confidence * 100).toFixed(2)}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Position:</span>
                        <span className="value">
                          {(() => {
                            // Handle different bbox formats
                            const bbox = detection.bbox || detection.bounding_box || detection.box;
                            if (bbox) {
                              // Handle x1,y1,x2,y2 format
                              if (bbox.x1 !== undefined && bbox.y1 !== undefined) {
                                return `(${bbox.x1}, ${bbox.y1})`;
                              }
                              // Handle x,y format
                              else if (bbox.x !== undefined && bbox.y !== undefined) {
                                return `(${bbox.x}, ${bbox.y})`;
                              }
                              // Handle left,top format
                              else if (bbox.left !== undefined && bbox.top !== undefined) {
                                return `(${bbox.left}, ${bbox.top})`;
                              }
                            }
                            // Direct properties
                            else if (detection.x !== undefined && detection.y !== undefined) {
                              return `(${detection.x}, ${detection.y})`;
                            } else if (Array.isArray(detection.coordinates) && detection.coordinates.length >= 2) {
                              return `(${detection.coordinates[0]}, ${detection.coordinates[1]})`;
                            }
                            return 'N/A';
                          })()}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Size:</span>
                        <span className="value">
                          {(() => {
                            // Handle different bbox formats
                            const bbox = detection.bbox || detection.bounding_box || detection.box;
                            if (bbox) {
                              // Handle x1,y1,x2,y2 format
                              if (bbox.x1 !== undefined && bbox.y1 !== undefined && bbox.x2 !== undefined && bbox.y2 !== undefined) {
                                const width = bbox.x2 - bbox.x1;
                                const height = bbox.y2 - bbox.y1;
                                return `${width} × ${height}`;
                              }
                              // Handle x,y,width,height format
                              else if (bbox.width !== undefined && bbox.height !== undefined) {
                                return `${bbox.width} × ${bbox.height}`;
                              }
                              // Handle left,top,right,bottom format
                              else if (bbox.left !== undefined && bbox.top !== undefined && bbox.right !== undefined && bbox.bottom !== undefined) {
                                const width = bbox.right - bbox.left;
                                const height = bbox.bottom - bbox.top;
                                return `${width} × ${height}`;
                              }
                            }
                            // Direct properties
                            else if (detection.width !== undefined && detection.height !== undefined) {
                              return `${detection.width} × ${detection.height}`;
                            } else if (detection.w !== undefined && detection.h !== undefined) {
                              return `${detection.w} × ${detection.h}`;
                            } else if (Array.isArray(detection.coordinates) && detection.coordinates.length >= 4) {
                              return `${detection.coordinates[2]} × ${detection.coordinates[3]}`;
                            }
                            return 'N/A';
                          })()}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      className="close-detail-btn"
                      onClick={() => setSelectedDetection(null)}
                      title="Close Detail Panel"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveResults;
