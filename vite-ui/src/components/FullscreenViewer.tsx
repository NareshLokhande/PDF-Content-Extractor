import React from 'react';
import { useImageNavigation } from '../hooks/useImageNavigation';
import { downloadImage } from '../utils/downloadImage';

interface FullscreenViewerProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({
  images,
  currentIndex,
  onClose,
}) => {
  const { index, next, prev } = useImageNavigation(currentIndex, images.length);

  return (
    <div className="fullscreen-overlay" onClick={onClose}>
      <img
        src={`data:image/png;base64,${images[index]}`}
        alt="Fullscreen"
        className="fullscreen-image"
      />

      {/* Fix: Prevent event bubbling */}
      <button
        className="nav-button prev"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
      >
        &larr;
      </button>

      <button
        className="nav-button next"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
      >
        &rarr;
      </button>

      <button
        className="fullscreen-download-btn"
        onClick={(e) => {
          e.stopPropagation();
          downloadImage(images[index], index);
        }}
      >
        Download
      </button>

      <span className="image-counter">
        {index + 1} of {images.length}
      </span>
    </div>
  );
};

export default FullscreenViewer;
