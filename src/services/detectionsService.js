// Base URL for the API - adjust this according to your backend configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000')
  : ''; // In development, use proxy (empty string means relative to current origin)

/**
 * Service for handling detection-related API calls
 */
class DetectionsService {
  /**
   * Downloads all detections for a given session
   * @param {string} sessionId - The session ID to download detections for
   * @returns {Promise<Blob>} - Promise that resolves to the downloaded file blob
   */
  async downloadAllDetections(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/download/${sessionId}/all-detections`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/octet-stream, application/zip, */*',
          // Remove Content-Type for GET requests as it's not needed
          // Add any authentication headers here if needed
          // 'Authorization': `Bearer ${token}`,
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
   * Upload an image file and detect and classify chromosomes
   * @param {File} file - The image file to upload
   * @returns {Promise<Object>} - Promise that resolves to the detection and classification results
   */
  async detectChromosomes(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/detect-and-classify-chromosomes`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: formData,
        // Don't set Content-Type header - let the browser set it with boundary for FormData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      // Validate the response structure
      if (!result.success) {
        throw new Error(result.message || 'Detection failed');
      }

      return result;
    } catch (error) {
      console.error('Error detecting and classifying chromosomes:', error);
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

export default new DetectionsService();
