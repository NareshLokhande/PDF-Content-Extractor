
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import TextViewer from './components/TextViewer';
import './App.css';

const App = () => {
  const [extractedText, setExtractedText] = useState('');

  return (
    <div className="app-container">
      <h1>PDF to HTML Converter</h1>
      <FileUpload setExtractedText={setExtractedText} />
      <TextViewer extractedText={extractedText} />
    </div>
  );
};

export default App;

