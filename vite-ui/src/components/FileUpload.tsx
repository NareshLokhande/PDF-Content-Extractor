import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFilePdf } from 'react-icons/fa';
import PulseLoader from 'react-spinners/PulseLoader';
import '../assets/css/dropzone.css'

// Define the type for the extracted data
interface ExtractedData {
  text: string;
  images: string[];
}

// Accept props with `setExtractedData`
interface FileUploadProps {
  setExtractedData: React.Dispatch<React.SetStateAction<ExtractedData>>;
}

const FileUpload: React.FC<FileUploadProps> = ({ setExtractedData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
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
          withCredentials: true,
        },
      );

      console.log('API Response:', response.data);

      // Ensure correct structure when setting data
      const extracted = {
        text: response.data.text || '',
        images: Array.isArray(response.data.images) ? response.data.images : [],
      };
      console.log('Extracted Data:', extracted);

      setExtractedData(extracted);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  return (
    <div className="dropzone-container">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <FaCloudUploadAlt className="dropzone-icon" />
        <p className="dropzone-text">Click or Drag & Drop a PDF</p>
      </div>

      {file && (
        <div className="uploaded-file">
          <FaFilePdf className="text-red-500 text-2xl" />
          <span>{file.name}</span>
        </div>
      )}

      <button disabled={uploading} onClick={uploadFile} className="upload-btn">
        {uploading ? 'Uploading...' : 'Upload & Extract'}
      </button>

      {uploading && <PulseLoader color="#4A90E2" />}
    </div>
  );
};

export default FileUpload;
