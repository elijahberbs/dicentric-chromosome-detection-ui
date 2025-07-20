import { useState, useCallback } from 'react';
import detectionsService from '../services/detectionsService';

/**
 * Custom hook for downloading all detections
 * @returns {Object} Hook state and functions
 */
export const useDetectionsDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [lastDownloadedSession, setLastDownloadedSession] = useState(null);

  const downloadAllDetections = useCallback(async (sessionId) => {
    if (!sessionId) {
      setError('Session ID is required');
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      const { blob, filename } = await detectionsService.downloadAllDetections(sessionId);
      detectionsService.triggerDownload(blob, filename);
      setLastDownloadedSession(sessionId);
    } catch (err) {
      setError(err.message || 'Failed to download detections');
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    downloadAllDetections,
    isDownloading,
    error,
    lastDownloadedSession,
    clearError,
  };
};
