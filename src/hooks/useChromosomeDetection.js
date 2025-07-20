import { useState, useCallback } from 'react';
import detectionsService from '../services/detectionsService';

/**
 * Custom hook for chromosome detection
 * @returns {Object} Hook state and functions
 */
export const useChromosomeDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const detectChromosomes = useCallback(async (file) => {
    if (!file) {
      setError('Please select a file to upload');
      return null;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, or BMP)');
      return null;
    }

    // Validate file size (e.g., max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      setError('File size must be less than 50MB');
      return null;
    }

    setIsDetecting(true);
    setError(null);
    setResults(null);

    try {
      const detectionResults = await detectionsService.detectChromosomes(file);
      setResults(detectionResults);
      setUploadedFile(file);
      return detectionResults; // Return the results
    } catch (err) {
      setError(err.message || 'Failed to detect chromosomes');
      console.error('Detection error:', err);
      return null;
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setUploadedFile(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    detectChromosomes,
    isDetecting,
    error,
    results,
    uploadedFile,
    clearResults,
    clearError,
  };
};
