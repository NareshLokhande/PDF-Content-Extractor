import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFilePdf } from 'react-icons/fa';
import PulseLoader from 'react-spinners/PulseLoader';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState({ text: '', images: [] });

  const onDrop = (acceptedFiles) => setFile(acceptedFiles[0]);

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
      setExtractedData(response.data);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div {...getRootProps()} className="dropzone cursor-pointer">
        <input {...getInputProps()} />
        <FaCloudUploadAlt className="text-blue-600 text-5xl mb-3" />
        <p className="text-gray-900 font-semibold text-lg">
          Click or Drag & Drop a PDF
        </p>
      </div>

      {file && (
        <div className="mt-5 p-4 bg-gray-200 rounded-xl flex items-center w-full max-w-lg shadow-md">
          <FaFilePdf className="text-red-500 text-2xl mr-3" />
          <span className="text-gray-800 font-medium truncate">
            {file.name}
          </span>
        </div>
      )}

      <button
        disabled={uploading}
        onClick={uploadFile}
        className="btn-primary mt-4"
      >
        {uploading ? 'Uploading...' : 'Upload & Extract'}
      </button>

      {uploading && <PulseLoader color="#4A90E2" />}

      {extractedData.text && (
        <div className="mt-8">
          <h2 className="font-bold text-xl mb-4">Extracted Text:</h2>
          <pre className="whitespace-pre-wrap">{extractedData.text}</pre>

          <h2 className="font-bold text-xl mt-6 mb-4">Extracted Images:</h2>
          <div className="grid grid-cols-2 gap-4">
            {extractedData.images.map((img, idx) => (
              <img
                key={idx}
                src={`data:image/png;base64,${img}`}
                alt={`Extracted ${idx}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useDropzone } from 'react-dropzone';
// import { FaCloudUploadAlt, FaFilePdf } from 'react-icons/fa';
// import PulseLoader from 'react-spinners/PulseLoader';

// const FileUpload = ({ setExtractedText }) => {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const onDrop = (acceptedFiles) => {
//     setFile(acceptedFiles[0]);
//   };

//   const uploadFile = async () => {
//     if (!file) return;

//     setUploading(true);
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post(
//         'http://localhost:8080/api/pdf/upload',
//         formData,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           withCredentials: true,
//         },
//       );
//       setExtractedText(response.data.text);
//     } catch (error) {
//       console.error('Upload failed:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: { 'application/pdf': ['.pdf'] },
//     multiple: false,
//   });

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       {/* File Drop Zone */}
//       <div
//         {...getRootProps()}
//         className="dropzone"
//       >
//         <input {...getInputProps()} />
//         <FaCloudUploadAlt className="text-blue-600 text-5xl mb-3" />
//         <p className="text-gray-900 font-semibold text-lg">
//           Click or Drag & Drop a PDF
//         </p>
//       </div>

//       {/* Selected File Display */}
//       {file && (
//         <div className="mt-5 p-4 bg-gray-200 rounded-xl flex items-center w-full max-w-lg shadow-md">
//           <FaFilePdf className="text-red-500 text-2xl mr-3" />
//           <span className="text-gray-800 font-medium truncate">
//             {file.name}
//           </span>
//         </div>
//       )}

//       {/* Upload Button */}
//       <button
//         disabled={uploading}
//         onClick={uploadFile}
//       >
//         {uploading ? 'Uploading...' : 'Upload & Extract'}
//       </button>

//       {/* Loader Overlay */}
//       {uploading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
//           <PulseLoader />
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;
