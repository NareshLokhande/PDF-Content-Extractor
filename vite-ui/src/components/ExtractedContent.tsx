// src/components/ExtractedContent.tsx
import React from 'react';
import TextViewer from './TextViewer';
import ImageViewer from './ImageViewer';

// Props for extracted data
interface ExtractedContentProps {
  text: string;
  images: string[];
}

const ExtractedContent: React.FC<ExtractedContentProps> = ({
  text,
  images,
}) => (
  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Text Section */}
    <div className="bg-white p-6 rounded-xl shadow-md max-h-[500px] overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Extracted Text</h2>
      <TextViewer extractedText={text} />
    </div>

    {/* Image Section */}
    <div className="bg-white p-6 rounded-xl shadow-md max-h-[500px] overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Extracted Images</h2>
      <ImageViewer images={images} />
    </div>
  </div>
);

export default ExtractedContent;
