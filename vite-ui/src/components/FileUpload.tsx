// src/components/FileUpload.tsx
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFilePdf } from 'react-icons/fa';
import PulseLoader from 'react-spinners/PulseLoader';
import '../assets/css/dropzone.css';

// Define the type for the extracted data
interface ExtractedData {
  text: string;
  images: string[];
  cropped_images: string[];
}

// Accept props with `setExtractedData`
interface FileUploadProps {
  setExtractedData: React.Dispatch<React.SetStateAction<ExtractedData>>;
}

const FileUpload: React.FC<FileUploadProps> = ({ setExtractedData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [keyword, setKeyword] = useState<string>('Name');
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file drop
  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setError(null); // Clear any previous errors
  };

  // Upload file and extract data
  const uploadFile = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('keyword', keyword); // Send the keyword to the backend

    try {
      const response = await axios.post<ExtractedData>(
        import.meta.env.VITE_OCR_API_URL,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        },
      );

      const extracted: ExtractedData = {
        text: response.data.text || '',
        images: [
          ...(Array.isArray(response.data.images) ? response.data.images : []),
          ...(Array.isArray(response.data.cropped_images)
            ? response.data.cropped_images
            : []),
        ],
        cropped_images: response.data.cropped_images || [],
      };

      setExtractedData(extracted);
      console.log('Extracted Data:', extracted);
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        typeof error.response?.data === 'string'
          ? error.response.data
          : 'Upload failed. Ensure FastAPI is running.';

      console.error('Upload failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Dropzone configuration
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  return (
    <div className="dropzone-container">
      <h1 className="text-4xl font-bold mb-8 text-center">
        PDF Content Extractor
      </h1>

      {/* PDF Dropzone */}
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <FaCloudUploadAlt className="dropzone-icon" />
        <p className="dropzone-text">Click or Drag & Drop a PDF</p>
      </div>

      {/* Display selected file */}
      {file && (
        <div className="uploaded-file">
          <FaFilePdf className="text-red-500 text-2xl" />
          <span>{file.name}</span>
        </div>
      )}

      {/* Keyword Input */}
      <div className="keyword-input">
        <label htmlFor="keyword" className="block font-semibold mt-4">
          Keyword:
        </label>
        <input
          type="text"
          id="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter a keyword (e.g., 'Name')"
          className="border p-2 rounded-lg w-full mt-2"
        />
      </div>

      {/* Upload Button */}
      <button
        disabled={uploading}
        onClick={uploadFile}
        className={`upload-btn ${uploading ? 'disabled' : ''}`}
      >
        {uploading ? 'Uploading...' : 'Upload & Extract'}
      </button>

      {/* Loader */}
      {uploading && <PulseLoader color="#4A90E2" />}

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default FileUpload;