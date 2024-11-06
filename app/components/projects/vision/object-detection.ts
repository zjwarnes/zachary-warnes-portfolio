import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

let detector: FaceDetector | null = null;
let isInitializing = false;
let initializationPromise: Promise<FaceDetector | null> | null = null;

export interface Detection {
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  score: number;
  className: string;
}

export async function initializeObjectDetector() {
  if (initializationPromise) {
    return initializationPromise;
  }

  if (detector) {
    return detector;
  }

  if (isInitializing) {
    return null;
  }

  isInitializing = true;

  initializationPromise = (async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      detector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
          delegate: "GPU"
        },
        runningMode: "IMAGE",
        minDetectionConfidence: 0.3
      });

      console.log('MediaPipe model loaded successfully');
      return detector;
    } catch (error) {
      console.error('Failed to initialize MediaPipe detector:', {
        error,
        message: error instanceof Error ? error.message : String(error)
      });
      throw error;
    } finally {
      isInitializing = false;
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

export async function detectObjects(
  canvas: HTMLCanvasElement
): Promise<Detection[]> {
  if (!detector) {
    return [];
  }

  try {
    const scaleFactor = 0.5;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return [];

    tempCanvas.width = canvas.width * scaleFactor;
    tempCanvas.height = canvas.height * scaleFactor;
    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

    const result = await detector.detect(tempCanvas);
    
    return result.detections.map(detection => {
      const bbox = detection.boundingBox!;
      return {
        bbox: {
          x: bbox.originX / scaleFactor,
          y: bbox.originY / scaleFactor,
          width: bbox.width / scaleFactor,
          height: bbox.height / scaleFactor
        },
        score: detection.categories[0].score,
        className: 'face'
      };
    });

  } catch (error) {
    console.error('Detection failed:', error);
    return [];
  }
}