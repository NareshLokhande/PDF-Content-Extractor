import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ setExtractedText }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/pdf/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      setExtractedText(response.data.text);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="upload-container">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & drop a PDF here, or click to select one</p>
      </div>
      {file && <p>Selected file: {file.name}</p>}
      <button onClick={uploadFile} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload & Extract'}
      </button>
    </div>
  );
};

export default FileUpload;
