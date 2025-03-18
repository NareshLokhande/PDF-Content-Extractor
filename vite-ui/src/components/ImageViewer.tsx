import React from 'react';
import { downloadImage } from '../utils/downloadImage';

interface ImageViewerProps {
  images: string[];
  setFullscreenIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  setFullscreenIndex,
}) => (
  <div className="image-grid">
    {images.map((img, idx) => (
      <div key={idx} className="image-wrapper">
        <img
          src={`data:image/png;base64,${img}`}
          alt={`Extracted Image ${idx + 1}`}
          className="extracted-image"
          onClick={() => setFullscreenIndex(idx)}
        />
        <button
          onClick={() => downloadImage(img, idx)}
          className="download-btn"
        >
          Download
        </button>
      </div>
    ))}
  </div>
);

export default ImageViewer;