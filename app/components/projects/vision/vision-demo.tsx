'use client'

import { useState, useEffect } from 'react'
import { DemoControls } from './demo-controls'
import { FallingImages } from './falling-images'
import { initializeObjectDetector } from './object-detection'

export function VisionDemo() {
  const [imageCount, setImageCount] = useState(3);
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);
  const [catsEnabled, setCatsEnabled] = useState(false);
  const [dogsEnabled, setDogsEnabled] = useState(false);
  const [facesEnabled, setFacesEnabled] = useState(false);
  const [detectionEnabled, setDetectionEnabled] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelInitialized, setModelInitialized] = useState(false);

  // Initialize detector once when component mounts
  useEffect(() => {
    if (modelInitialized) return; // Skip if already initialized

    initializeObjectDetector()
      .then(() => {
        setIsModelLoading(false);
        setModelInitialized(true);
      })
      .catch(error => {
        console.error('Failed to initialize model:', error);
        setIsModelLoading(false);
      });
  }, []); // Empty dependency array ensures this runs once

  if (isModelLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading object detection model...</p>
      </div>
    );
  }

  const handleCombinedImageUpdate = (imageData: string) => {
    // This will be used later for object detection
    // You can pass this image data to your detection model
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="w-full">
        <DemoControls
          onImageCountChange={setImageCount}
          onBackgroundToggle={() => setBackgroundEnabled(!backgroundEnabled)}
          onCatToggle={() => setCatsEnabled(!catsEnabled)}
          onDogToggle={() => setDogsEnabled(!dogsEnabled)}
          onFaceToggle={() => setFacesEnabled(!facesEnabled)}
          isBackgroundEnabled={backgroundEnabled}
          isCatsEnabled={catsEnabled}
          isDogsEnabled={dogsEnabled}
          isFacesEnabled={facesEnabled}
          isDetectionEnabled={detectionEnabled}
          onDetectionToggle={() => setDetectionEnabled(!detectionEnabled)}
        />
      </div>
      
      <div className="flex-1 relative">
        <FallingImages
          imageCount={imageCount}
          backgroundEnabled={backgroundEnabled}
          catsEnabled={catsEnabled}
          dogsEnabled={dogsEnabled}
          facesEnabled={facesEnabled}
          detectionEnabled={detectionEnabled}
          onCombinedImageUpdate={handleCombinedImageUpdate}
        />
      </div>
    </div>
  );
} 