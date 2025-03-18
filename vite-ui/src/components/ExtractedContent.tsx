import React from 'react';
import TextViewer from './TextViewer';
import ImageViewer from './ImageViewer';

interface ExtractedContentProps {
  text: string;
  images: string[];
  setFullscreenIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const ExtractedContent: React.FC<ExtractedContentProps> = ({
  text,
  images,
  setFullscreenIndex,
}) => (
  <div className="extracted-content">
    {text && (
      <div className="text-section">
        <h2>Extracted Text:</h2>
        <div className="scrollable-content">
          <TextViewer extractedText={text} />
        </div>
      </div>
    )}

    {images.length > 0 && (
      <div className="image-section">
        <h2>Extracted Images:</h2>
        <div className="scrollable-content">
          <ImageViewer images={images} setFullscreenIndex={setFullscreenIndex} />
        </div>
      </div>
    )}
  </div>
);

export default ExtractedContent;