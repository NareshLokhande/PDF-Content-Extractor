// src/components/ImageViewer.tsx
import React from 'react';

// Props for images
interface ImageViewerProps {
  images: string[];
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {images.length > 0 ? (
      images.map((src, index) => (
        <div
          key={index}
          className="border rounded-lg overflow-hidden shadow-sm"
        >
          <img
            src={`data:image/png;base64,${src}`}
            alt={`Extracted ${index + 1}`}
            className="w-full h-auto"
          />
        </div>
      ))
    ) : (
      <p className="text-gray-500">No images extracted.</p>
    )}
  </div>
);

export default ImageViewer;
