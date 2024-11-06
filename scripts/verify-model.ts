import fs from 'fs';
import path from 'path';

function verifyModel() {
  const modelPath = path.join(process.cwd(), 'public', 'models', 'yolov4-tiny.onnx');
  
  try {
    const stats = fs.statSync(modelPath);
    console.log('Model file exists:', {
      size: stats.size,
      path: modelPath,
    });
  } catch (error) {
    console.error('Model file not found:', modelPath);
    process.exit(1);
  }
}

verifyModel(); 