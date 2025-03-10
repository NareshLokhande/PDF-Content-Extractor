import React from 'react';

const TextViewer = ({ extractedText }) => {
  return (
    <div className="text-viewer">
      <h2>Extracted Text</h2>
      <pre>{extractedText || 'No text extracted yet.'}</pre>
    </div>
  );
};

export default TextViewer;
