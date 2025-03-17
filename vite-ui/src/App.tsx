// src/App.tsx
import { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import TextViewer from './components/TextViewer';
import './App.css';

interface ExtractedData {
  text: string;
  images: string[];
}

const App: React.FC = () => {
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    text: '',
    images: [],
  });

  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch((err) =>
          console.error('Service Worker registration failed', err),
        );
    }
  }, []);

  // Download Image
  const downloadImage = (imageData: string, index: number) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageData}`;
    link.download = `extracted_image_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Navigation in Fullscreen
  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent overlay click from closing the fullscreen view
    if (fullscreenIndex !== null) {
      setFullscreenIndex((prev) => (prev! + 1) % extractedData.images.length);
    }
  };

  const showPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent overlay click from closing the fullscreen view
    if (fullscreenIndex !== null) {
      setFullscreenIndex(
        (prev) =>
          (prev! - 1 + extractedData.images.length) %
          extractedData.images.length,
      );
    }
  };

  // Handle Keyboard Events for Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenIndex !== null) {
        if (e.key === 'ArrowRight')
          showNextImage(e as unknown as React.MouseEvent);
        if (e.key === 'ArrowLeft')
          showPrevImage(e as unknown as React.MouseEvent);
        if (e.key === 'Escape') setFullscreenIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenIndex]);

  return (
    <div className="app-container">
      <h1 className="title">Text and Image Extractor</h1>

      {/* File Upload Section */}
      <FileUpload setExtractedData={setExtractedData} />

      {/* Extracted Content */}
      <div className="extracted-content">
        {/* Extracted Text */}
        {extractedData.text && (
          <div className="text-section">
            <h2>Extracted Text:</h2>
            <TextViewer extractedText={extractedData.text} />
          </div>
        )}

        {/* Extracted Images */}
        {extractedData.images.length > 0 && (
          <div className="image-section">
            <h2>Extracted Images:</h2>
            <div className="image-grid">
              {extractedData.images.map((img, idx) => (
                <div key={idx} className="image-wrapper">
                  <img
                    src={`data:image/png;base64,${img}`}
                    alt={`Extracted Image ${idx + 1}`}
                    className="extracted-image"
                    onClick={() => setFullscreenIndex(idx)}
                  />
                  <button
                    className="download-btn"
                    onClick={() => downloadImage(img, idx)}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Image Viewer */}
      {fullscreenIndex !== null && (
        <div
          className="fullscreen-overlay"
          onClick={() => setFullscreenIndex(null)}
        >
          <img
            src={`data:image/png;base64,${extractedData.images[fullscreenIndex]}`}
            alt={`Fullscreen View`}
            className="fullscreen-image"
          />

          {/* Image Navigation */}
          <button className="nav-button prev" onClick={showPrevImage}>
            &larr;
          </button>
          <button className="nav-button next" onClick={showNextImage}>
            &rarr;
          </button>

          {/* Image Counter */}
          <div className="image-counter">
            {fullscreenIndex + 1} of {extractedData.images.length}
          </div>

          {/* Download Button */}
          <button
            className="fullscreen-download-btn"
            onClick={(e) => {
              e.stopPropagation();
              downloadImage(
                extractedData.images[fullscreenIndex],
                fullscreenIndex,
              );
            }}
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
// // src/App.tsx
// import { useState, useEffect } from 'react';
// import FileUpload from './components/FileUpload';
// import TextViewer from './components/TextViewer';
// import './App.css';

// interface ExtractedData {
//   text: string;
//   images: string[];
// }

// const App: React.FC = () => {
//   const [extractedData, setExtractedData] = useState<ExtractedData>({
//     text: '',
//     images: [],
//   });

//   const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

//   useEffect(() => {
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker
//         .register('/sw.js')
//         .then(() => console.log('Service Worker registered'))
//         .catch((err) =>
//           console.error('Service Worker registration failed', err),
//         );
//     }
//   }, []);

//   // Download Image
//   const downloadImage = (imageData: string, index: number) => {
//     const link = document.createElement('a');
//     link.href = `data:image/png;base64,${imageData}`;
//     link.download = `extracted_image_${index + 1}.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Handle Navigation in Fullscreen
//   const showNextImage = () => {
//     if (fullscreenIndex !== null && extractedData.images.length > 0) {
//       setFullscreenIndex((prev) => (prev! + 1) % extractedData.images.length);
//     }
//   };

//   const showPrevImage = () => {
//     if (fullscreenIndex !== null && extractedData.images.length > 0) {
//       setFullscreenIndex(
//         (prev) =>
//           (prev! - 1 + extractedData.images.length) %
//           extractedData.images.length,
//       );
//     }
//   };

//   // Handle Keyboard Events
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (fullscreenIndex !== null) {
//         if (e.key === 'ArrowRight') showNextImage();
//         if (e.key === 'ArrowLeft') showPrevImage();
//         if (e.key === 'Escape') setFullscreenIndex(null);
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [fullscreenIndex]);

//   return (
//     <div className="app-container">
//       <h1 className="title">Text and Image Extractor</h1>

//       {/* File Upload Section */}
//       <FileUpload setExtractedData={setExtractedData} />

//       {/* Extracted Content */}
//       <div className="extracted-content">
//         {/* Extracted Text */}
//         {extractedData.text && (
//           <div className="text-section">
//             <h2>Extracted Text:</h2>
//             <TextViewer extractedText={extractedData.text} />
//           </div>
//         )}

//         {/* Extracted Images */}
//         {extractedData.images.length > 0 && (
//           <div className="image-section">
//             <h2>Extracted Images:</h2>
//             <div className="image-grid">
//               {extractedData.images.map((img, idx) => (
//                 <div key={idx} className="image-wrapper">
//                   <img
//                     src={`data:image/png;base64,${img}`}
//                     alt={`Extracted Image ${idx + 1}`}
//                     className="extracted-image"
//                     onClick={() => setFullscreenIndex(idx)}
//                   />
//                   <button
//                     className="download-btn"
//                     onClick={() => downloadImage(img, idx)}
//                   >
//                     Download
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Fullscreen Image Viewer */}
//       {fullscreenIndex !== null && (
//         <div
//           className="fullscreen-overlay"
//           onClick={() => setFullscreenIndex(null)}
//         >
//           <img
//             src={`data:image/png;base64,${extractedData.images[fullscreenIndex]}`}
//             alt={`Fullscreen View`}
//             className="fullscreen-image"
//           />

//           {/* Image Navigation */}
//           <button className="nav-button prev" onClick={showPrevImage}>
//             &larr;
//           </button>
//           <button className="nav-button next" onClick={showNextImage}>
//             &rarr;
//           </button>

//           {/* Image Counter */}
//           <div className="image-counter">
//             {fullscreenIndex + 1} of {extractedData.images.length}
//           </div>

//           {/* Download Button */}
//           <button
//             className="fullscreen-download-btn"
//             onClick={() =>
//               downloadImage(
//                 extractedData.images[fullscreenIndex],
//                 fullscreenIndex,
//               )
//             }
//           >
//             Download
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

// // src/App.tsx
// import { useState, useEffect } from 'react';
// import FileUpload from './components/FileUpload';
// import TextViewer from './components/TextViewer';
// import './App.css';

// // Define the extracted data structure
// interface ExtractedData {
//   text: string;
//   images: string[];
// }

// const App: React.FC = () => {
//   const [extractedData, setExtractedData] = useState<ExtractedData>({
//     text: '',
//     images: [],
//   });

//   const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

//   // Register Service Worker
//   useEffect(() => {
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker
//         .register('/sw.js')
//         .then(() => console.log('Service Worker registered'))
//         .catch((err) =>
//           console.error('Service Worker registration failed', err),
//         );
//     }
//   }, []);

//   // Download Image
//   const downloadImage = (imageData: string, index: number) => {
//     const link = document.createElement('a');
//     link.href = `data:image/png;base64,${imageData}`;
//     link.download = `extracted_image_${index + 1}.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="app-container">
//       <h1 className="title">Text and Image Extractor</h1>

//       {/* File Upload Section */}
//       <FileUpload setExtractedData={setExtractedData} />

//       {/* Extracted Content Section */}
//       <div className="extracted-content">
//         {/* Extracted Text */}
//         {extractedData.text && (
//           <div className="text-section">
//             <h2>Extracted Text:</h2>
//             <TextViewer extractedText={extractedData.text} />
//           </div>
//         )}

//         {/* Extracted Images */}
//         {extractedData.images.length > 0 && (
//           <div className="image-section">
//             <h2>Extracted Images:</h2>
//             <div className="image-grid">
//               {extractedData.images.map((img, idx) => (
//                 <div key={idx} className="image-wrapper">
//                   <img
//                     src={`data:image/png;base64,${img}`}
//                     alt={`Extracted Image ${idx + 1}`}
//                     className="extracted-image"
//                     onClick={() => setFullscreenImage(img)}
//                   />
//                   <button
//                     className="download-btn"
//                     onClick={() => downloadImage(img, idx)}
//                   >
//                     Download
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Fullscreen Image Modal */}
//       {fullscreenImage && (
//         <div
//           className="fullscreen-overlay"
//           onClick={() => setFullscreenImage(null)}
//         >
//           <img
//             src={`data:image/png;base64,${fullscreenImage}`}
//             alt="Fullscreen View"
//             className="fullscreen-image"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

// // src/App.tsx
// import { useState, useEffect } from 'react';
// import FileUpload from './components/FileUpload';
// import TextViewer from './components/TextViewer';
// import './App.css';

// // Define the extracted data structure
// interface ExtractedData {
//   text: string;
//   images: string[];
// }

// const App: React.FC = () => {
//   const [extractedData, setExtractedData] = useState<ExtractedData>({
//     text: '',
//     images: [],
//   });

//   console.log('Extracted Data in App:', extractedData); // ✅ Check if data updates

//   // ✅ Register Service Worker for PWA support (moved inside App component)
//   useEffect(() => {
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker
//         .register('/sw.js')
//         .then(() => console.log('Service Worker registered'))
//         .catch((err) =>
//           console.error('Service Worker registration failed', err),
//         );
//     }
//   }, []);

//   return (
//     <div className="app-container">
//       <h1>Text and Image Extractor</h1>

//       {/* Pass setExtractedData to FileUpload */}
//       <FileUpload setExtractedData={setExtractedData} />

//       {/* Display extracted text */}
//       {extractedData.text && <TextViewer extractedText={extractedData.text} />}

//       {/* Display extracted images */}
//       {extractedData.images.length > 0 && (
//         <div className="image-gallery">
//           <h2>Extracted Images:</h2>
//           {extractedData.images.map((img, idx) => (
//             <img
//               key={idx}
//               src={`data:image/png;base64,${img}`}
//               alt={`Extracted Image ${idx + 1}`}
//               className="extracted-image"
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
