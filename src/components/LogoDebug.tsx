import React, { useState, useEffect } from 'react';

/**
 * LogoDebug Component
 * 
 * A utility component to diagnose issues with logo loading
 * Use this component temporarily to identify what might be wrong with your logo
 */
export const LogoDebug: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null);
  const [imgSrc, setImgSrc] = useState('/images/logo.png');
  
  // Reset states when the image source changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setImgSize(null);
  }, [imgSrc]);

  // Get image dimensions on load
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    const img = e.currentTarget;
    setImgSize({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  };

  // Test different paths
  const altPaths = [
    '/images/logo.png',          // Standard path
    '/logo.png',                 // Root level
    './images/logo.png',         // Relative path
    'public/images/logo.png',    // With public prefix
    'https://via.placeholder.com/150x150.png?text=Test' // External placeholder
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl mx-auto my-8 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
        Logo Debug Tool
      </h2>
      
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200 transition-colors duration-300">
          Current Logo Status
        </h3>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-4">
          <div className="relative w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden transition-colors duration-300">
            <img
              src={imgSrc}
              alt="Logo Debug"
              onLoad={handleImageLoad}
              onError={() => setHasError(true)}
              className={`object-contain w-full h-full ${hasError ? 'opacity-30' : ''}`}
            />
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center text-red-500 dark:text-red-400 text-sm font-medium transition-colors duration-300">
                Failed to load
              </div>
            )}
          </div>
          
          <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
            <p>
              <span className="font-medium">Status:</span>{' '}
              {hasError ? (
                <span className="text-red-500 dark:text-red-400 transition-colors duration-300">Error</span>
              ) : isLoaded ? (
                <span className="text-green-500 dark:text-green-400 transition-colors duration-300">Loaded</span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Loading...</span>
              )}
            </p>
            <p>
              <span className="font-medium">Path:</span> {imgSrc}
            </p>
            {imgSize && (
              <p>
                <span className="font-medium">Dimensions:</span> {imgSize.width}×{imgSize.height}px
              </p>
            )}
            <p>
              <span className="font-medium">File Type:</span> {imgSrc.split('.').pop()?.toUpperCase() || 'Unknown'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200 transition-colors duration-300">
          Test Alternative Paths
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {altPaths.map((path) => (
            <button
              key={path}
              onClick={() => setImgSrc(path)}
              className={`py-2 px-3 text-sm rounded-lg transition-colors duration-300 ${
                path === imgSrc
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {path}
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-sm space-y-2 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-blue-800 dark:text-blue-200 transition-colors duration-300">
        <h3 className="font-semibold">Troubleshooting Tips:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Verify the image exists at <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded transition-colors duration-300">{imgSrc}</code></li>
          <li>Check that the path is correct relative to your public directory</li>
          <li>Ensure the file is not corrupted by viewing it directly in a browser</li>
          <li>Try different paths to determine where Vite is looking for your assets</li>
          <li>Verify that the image dimensions are appropriate (not too large or zero)</li>
        </ul>
      </div>
    </div>
  );
};