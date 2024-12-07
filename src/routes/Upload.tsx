import React, { useState } from 'react';
import Papa from 'papaparse';

interface UploadProps {
  onUpload: (data: Record<string, string>[]) => void;
}

const Upload = ({ onUpload }: UploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setUploadMessage(null); // Clear previous messages
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        onUpload(result.data as Record<string, string>[]);
        setUploadMessage('File uploaded successfully! ✅');
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setUploadMessage('Error uploading file. ❌');
      },
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleFile(event.target.files[0]);
    }
  };

  return (
    <div 
      className={`file-upload-container ${dragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className='upload-box'>
        <input
          type='file'
          accept='.csv'
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id='fileInput'
        />
        <label htmlFor='fileInput'>
          <div className='upload-content'>
            <i className='cloud-icon'>☁️</i>
            <p>Drag and drop a CSV file here, or click to upload</p>
          </div>
        </label>
      </div>
      {uploadMessage && (
        <div className={`upload-message ${uploadMessage.includes('Error') ? 'error' : 'success'}`}>
          {uploadMessage}
        </div>
      )}
    </div>
  );
};

export default Upload;
