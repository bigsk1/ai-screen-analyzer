// src/components/ScreenCapture.js
import React, { useState, useRef, useCallback } from 'react';

const ScreenCapture = ({ onNewCapture, darkMode }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsCapturing(true);
    } catch (err) {
      console.error('Error starting screen capture:', err);
    }
  }, []);

  const stopCapture = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCapturing(false);
  }, []);

  const captureScreen = useCallback(() => {
    if (!isCapturing) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    const capture = {
      id: Date.now(),
      dataUrl: canvas.toDataURL('image/jpeg'),
      timestamp: new Date().toISOString()
    };

    onNewCapture(capture);
  }, [isCapturing, onNewCapture]);

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-200`}>
      <h2 className="text-xl font-semibold mb-4">Screen Capture</h2>
      <div className="flex space-x-2">
        <button
          onClick={isCapturing ? stopCapture : startCapture}
          className={`px-4 py-2 rounded ${
            isCapturing 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold transition-colors duration-200`}
        >
          {isCapturing ? 'Stop Capturing' : 'Start Capturing'}
        </button>
        {isCapturing && (
          <button
            onClick={captureScreen}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-200"
          >
            Capture Screenshot
          </button>
        )}
      </div>
      <video ref={videoRef} autoPlay muted style={{ display: 'none' }} />
    </div>
  );
};

export default ScreenCapture;