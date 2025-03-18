import React from 'react';
import { ClockIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const CaptureHistory = ({ captures, onSelectCapture, onDeleteCapture }) => {
  if (!captures || captures.length === 0) {
    return (
      <div className="card animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-neutral-100">Recent Captures</h2>
        </div>
        <div className="p-8 text-center">
          <ClockIcon className="h-12 w-12 mx-auto text-neutral-600 mb-3" />
          <p className="text-neutral-400">No captures yet</p>
          <p className="text-sm text-neutral-500 mt-2">Screenshots you take will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-neutral-100">Recent Captures</h2>
        <span className="text-xs px-2.5 py-1 bg-neutral-700 rounded-full">
          {captures.length} {captures.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      
      <div className="space-y-4 max-h-[350px] overflow-y-auto scrollbar-styled pr-1">
        {captures.map((capture) => {
          const captureDate = new Date(capture.timestamp);
          const formattedDate = captureDate.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          return (
            <div 
              key={capture.id}
              className="flex items-center p-3 rounded-lg border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 transition-colors group cursor-pointer"
              onClick={() => onSelectCapture(capture)}
            >
              <div className="flex-shrink-0 h-16 w-16 rounded-md bg-black overflow-hidden">
                <img 
                  src={capture.dataUrl} 
                  alt={`Capture ${formattedDate}`}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Capture {formattedDate}</p>
                <p className="text-xs text-neutral-400 mt-1">Click to analyze</p>
              </div>
              
              <div className="ml-2 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCapture(capture);
                  }}
                  className="p-1.5 rounded-full bg-primary-800/50 text-primary-300 hover:bg-primary-700 transition-colors"
                  aria-label="View"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCapture(capture.id);
                  }}
                  className="p-1.5 rounded-full bg-neutral-700 text-neutral-400 hover:bg-danger-800/70 hover:text-danger-200 transition-colors"
                  aria-label="Delete"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaptureHistory; 