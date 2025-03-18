import { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import ExtractedContent from './components/ExtractedContent';
import FullscreenViewer from './components/FullscreenViewer';
import './App.css';

interface ExtractedData {
  text: string;
  images: string[];
  cropped_images: string[];
}

const App: React.FC = () => {
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    text: '',
    images: [],
    cropped_images: [],
  });
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  // Register Service Worker
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

  return (
    <div className="app-container">
      <FileUpload setExtractedData={setExtractedData} />
      <ExtractedContent
        text={extractedData.text}
        images={extractedData.images}
        setFullscreenIndex={setFullscreenIndex}
      />

      {fullscreenIndex !== null && (
        <FullscreenViewer
          images={extractedData.images}
          currentIndex={fullscreenIndex}
          onClose={() => setFullscreenIndex(null)}
        />
      )}
    </div>
  );
};

export default App;