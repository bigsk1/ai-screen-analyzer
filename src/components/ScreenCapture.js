// src/components/ScreenCapture.js
import React, { useState, useCallback } from 'react';
import { CameraIcon, ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ScreenCapture = ({ onNewCapture }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const captureScreen = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting screen capture...');
      
      // Request screen sharing
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          cursor: "always"
        },
        audio: false
      }).catch(err => {
        console.error('Error getting display media:', err);
        throw new Error(`Screen sharing failed: ${err.message || 'User cancelled'}`);
      });
      
      // Create a video element to capture the stream
      const video = document.createElement('video');
      video.srcObject = stream;
      
      // Wait for the video to load enough data
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });
      
      // Wait a small amount of time for the video to actually start playing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create canvas with the video dimensions
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      
      // Draw the current video frame to the canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL with reduced quality for large screens
      let quality = 0.85;
      if (canvas.width * canvas.height > 1920 * 1080) {
        quality = 0.7; // Lower quality for very large screens
      }
      
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // Check if dataUrl is valid
      if (dataUrl === 'data:,') {
        throw new Error('Failed to capture image from screen');
      }
      
      // Create capture object
      const capture = {
        id: Date.now(),
        dataUrl,
        timestamp: new Date().toISOString(),
        width: canvas.width,
        height: canvas.height
      };
      
      console.log('Capture successful:', capture.id);
      
      // Stop all tracks in the stream
      stream.getTracks().forEach(track => track.stop());
      
      // Send to parent component
      onNewCapture(capture);
    } catch (err) {
      console.error('Error capturing screenshot:', err);
      setError(err.message || 'Failed to capture screenshot');
    } finally {
      setIsLoading(false);
    }
  }, [onNewCapture]);

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-neutral-100">Screen Capture</h2>
      </div>
      
      {error && (
        <div className="mb-5 p-4 rounded-lg bg-danger-500/20 border border-danger-700 flex items-start">
          <ExclamationCircleIcon className="h-5 w-5 text-danger-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-danger-200">{error}</div>
        </div>
      )}
      
      <div className="flex justify-center mb-5">
        <button
          onClick={captureScreen}
          disabled={isLoading}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
              <span>Capturing...</span>
            </>
          ) : (
            <>
              <CameraIcon className="h-5 w-5 mr-2" />
              <span>Capture Screenshot</span>
            </>
          )}
        </button>
      </div>
      
      <div className="text-center">
        <p className="text-neutral-400 text-sm">
          Click the button above to capture your screen or a specific window.
        </p>
        <p className="text-neutral-500 text-xs mt-2">
          You'll be prompted to select which screen or window you want to share.
        </p>
      </div>
    </div>
  );
};

export default ScreenCapture;