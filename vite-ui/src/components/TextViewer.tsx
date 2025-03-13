// src/components/TextViewer.tsx
import React from 'react';

interface TextViewerProps {
  extractedText: string;
}

const TextViewer: React.FC<TextViewerProps> = ({ extractedText }) => (
  <div className="text-viewer">
    <h2>Extracted Text</h2>
    <pre>{extractedText || 'No text extracted yet.'}</pre>
  </div>
);

export default TextViewer;
