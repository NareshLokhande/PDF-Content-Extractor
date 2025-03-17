// src/components/TextViewer.tsx
import React from 'react';

interface TextViewerProps {
  extractedText: string;
}

const TextViewer: React.FC<TextViewerProps> = ({ extractedText }) => {
  // Function to copy text to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text. Please try again.');
    }
  };

  return (
    <div className="text-viewer">
      <div className="header">
        {/* <h2>Extracted Text:</h2> */}
        <button onClick={copyToClipboard} className="copy-btn">
          📋 Copy
        </button>
      </div>
      <pre>{extractedText || 'No text extracted yet.'}</pre>
    </div>
  );
};

export default TextViewer;