// Alternative service configuration for proxy setup
// Use this if you're using package.json proxy or setupProxy.js

// For proxy setup, use relative URLs in development
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'
  : '/api'; // This will use the proxy

/**
 * Service for handling detection-related API calls (Proxy Version)
 */
class DetectionsServiceProxy {
  /**
   * Downloads all detections for a given session
   * @param {string} sessionId - The session ID to download detections for
   * @returns {Promise<Blob>} - Promise that resolves to the downloaded file blob
   */
  async downloadAllDetections(sessionId) {
    try {
      const url = process.env.NODE_ENV === 'production' 
        ? `${API_BASE_URL}/download/${sessionId}/all-detections`
        : `/api/download/${sessionId}/all-detections`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream, application/zip, */*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the filename from the response headers if available
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'all-detections.zip'; // Default filename
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      return { blob, filename };
    } catch (error) {
      console.error('Error downloading detections:', error);
      throw error;
    }
  }

  /**
   * Triggers the download of a blob to the user's device
   * @param {Blob} blob - The blob to download
   * @param {string} filename - The filename for the download
   */
  triggerDownload(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default new DetectionsServiceProxy();
