'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { initializeObjectDetector, detectObjects, Detection } from './object-detection';

interface FallingImagesProps {
  imageCount: number;
  backgroundEnabled: boolean;
  catsEnabled: boolean;
  dogsEnabled: boolean;
  facesEnabled: boolean;
  detectionEnabled: boolean;
  onCombinedImageUpdate?: (imageData: string) => void;
}

interface FallingImage {
  id: number;
  x: number;
  y: number;
  speed: number;
  rotation: number;
  type: 'cat' | 'dog' | 'face';
  faceIndex?: number;
}

interface TimestampedDetection extends Detection {
  timestamp: number;
  frameCount: number;
}

// Add these constants at the top of the file, outside the component
const DETECTION_INTERVAL = 100; // Keep this the same
const DETECTION_THROTTLE = 5; // Keep this the same
const MAX_CACHED_DETECTIONS = 3; // Keep this the same
const FRAME_RATE = 4; // Double from 4 to 8 (slower updates)
const BASE_SPEED = 1.0; // Doubled from 0.5
const MAX_SPEED = 2.4; // Doubled from 1.2
let ROTATION_SPEED = 0.025; // Now can be modified during animation
const IMAGE_SIZE = 400; // Increased by 50% from 150

export function FallingImages({
  imageCount,
  backgroundEnabled,
  catsEnabled,
  dogsEnabled,
  facesEnabled,
  detectionEnabled,
  onCombinedImageUpdate
}: FallingImagesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<FallingImage[]>([]);
  const imagesRef = useRef<FallingImage[]>([]);
  const dogImageRef = useRef<HTMLImageElement | null>(null);
  const catImageRef = useRef<HTMLImageElement | null>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameId = useRef<number>();
  const [detections, setDetections] = useState<TimestampedDetection[]>([]);
  const detectionsRef = useRef<TimestampedDetection[]>([]);
  const processingDetection = useRef(false);
  const detectorReadyRef = useRef(false);
  const faceImageRefs = useRef<HTMLImageElement[]>([]);
  
  // Load images with larger sizes (changed from 50 to 100)
  useEffect(() => {
    const loadAndResizeImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          // Create a temporary canvas to resize the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = IMAGE_SIZE;  // Changed from 300 to 150
          canvas.height = IMAGE_SIZE; // Changed from 300 to 150
          ctx?.drawImage(img, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
          
          const resizedImg = new Image();
          resizedImg.src = canvas.toDataURL();
          resizedImg.onload = () => resolve(resizedImg);
        };
      });
    };

    Promise.all([
      loadAndResizeImage('/images/pexels-charlesdeluvio-1851164.jpg'),
      loadAndResizeImage('/images/pexels-pixabay-45201.jpg'),
      loadAndResizeImage('/images/pexels-pixabay-415829.jpg'),
      loadAndResizeImage('/images/pexels-pixabay-458718.jpg'),
      loadAndResizeImage('/images/pexels-mart-production-9558264.jpg'),
      loadAndResizeImage('/images/pexels-justin-shaifer-501272-1222271.jpg'),
      new Promise<HTMLImageElement>((resolve) => {
        const bgImg = new Image();
        bgImg.src = '/images/pexels-akos-szabo-145938-440731.jpg';
        bgImg.onload = () => resolve(bgImg);
      })
    ]).then(([dogImg, catImg, ...otherImages]) => {
      const [bgImg] = otherImages.slice(-1);
      const faceImages = otherImages.slice(0, -1); // Get all face images
      
      dogImageRef.current = dogImg;
      catImageRef.current = catImg;
      faceImageRefs.current = faceImages;
      backgroundImageRef.current = bgImg;
    });
  }, []);

  // Update imagesRef when images state changes
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Initialize falling images with slower speeds
  useEffect(() => {
    if (!catsEnabled && !dogsEnabled && !facesEnabled) {
      setImages([]);
      return;
    }

    const enabledTypes = [
      ...(catsEnabled ? ['cat'] : []),
      ...(dogsEnabled ? ['dog'] : []),
      ...(facesEnabled ? ['face'] : [])
    ] as ('cat' | 'dog' | 'face')[];

    if (enabledTypes.length === 0) return;

    const newImages: FallingImage[] = Array.from({ length: imageCount }, (_, i) => {
      const type = enabledTypes[Math.floor(Math.random() * enabledTypes.length)];
      return {
        id: i,
        x: Math.random() * (window.innerWidth - IMAGE_SIZE),
        y: Math.random() * (window.innerHeight - IMAGE_SIZE),
        speed: BASE_SPEED + Math.random() * MAX_SPEED,
        rotation: (Math.random() * 180) - 90, // Random rotation between -90 and 90
        type,
        faceIndex: type === 'face' ? Math.floor(Math.random() * faceImageRefs.current.length) : undefined
      };
    });
    
    setImages(newImages);
  }, [imageCount, catsEnabled, dogsEnabled, facesEnabled]);

  // Instead, just set detectorReadyRef to true since we know the model is initialized
  useEffect(() => {
    detectorReadyRef.current = true;
    return () => {
      detectorReadyRef.current = false;
    };
  }, []);

  // Replace the detection effect with this optimized version
  useEffect(() => {
    if (!detectionEnabled || !detectorReadyRef.current) return;

    let frameCount = 0;
    let lastDetectionTime = 0;

    const runDetection = async () => {
      const now = Date.now();
      if (!canvasRef.current || processingDetection.current) return;
      
      // Skip if not enough time has passed since last detection
      if (now - lastDetectionTime < DETECTION_INTERVAL) return;

      frameCount++;
      if (frameCount % DETECTION_THROTTLE !== 0) return;

      processingDetection.current = true;
      try {
        const canvas = canvasRef.current;
        // Create a smaller canvas for detection
        const detectionCanvas = document.createElement('canvas');
        const ctx = detectionCanvas.getContext('2d');
        if (!ctx) return;

        // Downscale the image for faster detection
        detectionCanvas.width = canvas.width / 2;
        detectionCanvas.height = canvas.height / 2;
        ctx.drawImage(canvas, 0, 0, detectionCanvas.width, detectionCanvas.height);

        const newDetections = await detectObjects(detectionCanvas);
        lastDetectionTime = now;
        
        // Scale detection coordinates back up
        const scaledDetections = newDetections.map(detection => ({
          ...detection,
          bbox: {
            x: detection.bbox.x * 2,
            y: detection.bbox.y * 2,
            width: detection.bbox.width * 2,
            height: detection.bbox.height * 2
          },
          timestamp: now,
          frameCount: 0
        }));

        // Update detections, keeping only recent ones
        const updatedDetections = detectionsRef.current
          .map(detection => ({
            ...detection,
            frameCount: detection.frameCount + 1
          }))
          .filter(detection => detection.frameCount < MAX_CACHED_DETECTIONS);

        const combinedDetections = [...scaledDetections, ...updatedDetections]
          .slice(0, MAX_CACHED_DETECTIONS); // Limit total number of cached detections
        
        detectionsRef.current = combinedDetections;
        setDetections(combinedDetections);
      } finally {
        processingDetection.current = false;
      }
    };

    const detectionInterval = setInterval(runDetection, DETECTION_INTERVAL);

    return () => {
      clearInterval(detectionInterval);
    };
  }, [detectionEnabled]);

  // Add this function inside the component
  const getImageRefForType = (type: 'cat' | 'dog' | 'face', faceIndex?: number) => {
    switch (type) {
      case 'cat': return catImageRef.current;
      case 'dog': return dogImageRef.current;
      case 'face': {
        if (faceImageRefs.current.length === 0) return null;
        return faceImageRefs.current[faceIndex ?? 0];
      }
    }
  };

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let frameCount = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background with 25% upward shift
      if (backgroundEnabled && backgroundImageRef.current) {
        const bgImg = backgroundImageRef.current;
        const scale = Math.max(
          canvas.width / bgImg.width,
          canvas.height / bgImg.height
        );
        const width = bgImg.width * scale;
        const height = bgImg.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2 - (canvas.height * 0.25); // Shift up by 25%
        
        ctx.drawImage(bgImg, x, y, width, height);
      }

      // Update positions less frequently
      frameCount = (frameCount + 1) % FRAME_RATE;
      if (frameCount === 0) {
        const updatedImages = imagesRef.current.map(img => {
          const newY = (img.y + img.speed) % (window.innerHeight - IMAGE_SIZE);
          const needsNewFaceIndex = img.y + img.speed >= window.innerHeight - IMAGE_SIZE;
          
          // Update rotation to oscillate between -90 and 90
          let newRotation = img.rotation + ROTATION_SPEED;
          if (newRotation > 90) {
            newRotation = 90;
            ROTATION_SPEED *= -1;
          } else if (newRotation < -90) {
            newRotation = -90;
            ROTATION_SPEED *= -1;
          }
          
          return {
            ...img,
            y: newY,
            rotation: newRotation,
            faceIndex: needsNewFaceIndex && img.type === 'face' 
              ? Math.floor(Math.random() * faceImageRefs.current.length)
              : img.faceIndex
          };
        });
        setImages(updatedImages);
      }

      // Draw the current images using getImageRefForType
      imagesRef.current.forEach(img => {
        const imageRef = getImageRefForType(img.type, img.faceIndex);
        if (!imageRef) return;

        ctx.save();
        ctx.translate(img.x + IMAGE_SIZE/2, img.y + IMAGE_SIZE/2);
        ctx.rotate((img.rotation * Math.PI) / 180);
        ctx.drawImage(imageRef, -IMAGE_SIZE/2, -IMAGE_SIZE/2, IMAGE_SIZE, IMAGE_SIZE);
        ctx.restore();
      });

      // Draw detections
      if (detectionEnabled) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00FF00';
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        
        detectionsRef.current.forEach(detection => {
          // Fade out the detection as it gets older
          const opacity = Math.max(0.2, 1 - (detection.frameCount / 3));
          ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`;
          ctx.fillStyle = `rgba(0, 255, 0, ${opacity * 0.2})`;

          const { x, y, width, height } = detection.bbox;
          ctx.strokeRect(x, y, width, height);
          ctx.fillRect(x, y, width, height);
          
          ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
          ctx.font = '14px Arial';
          ctx.fillText(
            `${detection.className} ${(detection.score * 100).toFixed(0)}%`,
            x,
            y - 5
          );
        });
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [backgroundEnabled, detectionEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
} 