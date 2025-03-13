// src/App.tsx
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import TextViewer from './components/TextViewer';
import './App.css';

interface ExtractedData {
  text: string;
  images: string[];
}

const App: React.FC = () => {
  // Updated state to hold both text and images
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    text: '',
    images: [],
  });

  return (
    <div className="app-container">
      <h1>PDF to HTML Converter</h1>

      {/* Pass setExtractedData to update both text and images */}
      <FileUpload setExtractedData={setExtractedData} />

      {/* Pass only extracted text to TextViewer */}
      <TextViewer extractedText={extractedData.text} />

      {/* Display extracted images */}
      {extractedData.images.length > 0 && (
        <div className="image-gallery">
          <h2>Extracted Images:</h2>
          <div className="grid grid-cols-2 gap-4">
            {extractedData.images.map((img, idx) => (
              <img
                key={idx}
                src={`data:image/png;base64,${img}`} // Render Base64 images
                alt={`Extracted ${idx}`}
                className="extracted-image"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
// // src/App.tsx
// import React, { useState } from 'react';
// import FileUpload from './components/FileUpload';
// import TextViewer from './components/TextViewer';
// import './App.css';

// const App: React.FC = () => {
//   const [extractedText, setExtractedText] = useState<string>('');

//   return (
//     <div className="app-container">
//       <h1>PDF to HTML Converter</h1>
//       <FileUpload setExtractedText={setExtractedText} />
//       <TextViewer extractedText={extractedText} />
//     </div>
//   );
// };

// export default App;
