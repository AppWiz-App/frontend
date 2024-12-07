import React, { useState } from 'react';
import Papa from 'papaparse';

interface UploadProps {
  onUpload: (data: Record<string, string>[]) => void;
}

const Upload = ({ onUpload }: UploadProps) => {
  const [filename, setFilename] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilename(file.name);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log(result);
          onUpload(result.data as Record<string, string>[]);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        },
      });
  const [dragOver, setDragOver] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setUploadMessage(null); // Clear previous messages
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        onUpload(result.data as Record<string, string>[]);
        setUploadMessage('CSV file uploaded successfully! ✅');
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setUploadMessage('Error uploading CSV file. ❌');
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
    <div className='file-upload-container'>
      <label htmlFor='fileInput' className='upload-box'>
        <input
          type='file'
          accept='.csv'
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id='fileInput'
        />
        <div className='upload-content flex flex-col gap-4'>
          <i className='cloud-icon'>☁️</i>

          <p>Upload a CSV of your applications</p>

          <b>{filename}</b>
        </div>
      </label>
    </div>
  );
};

export default Upload;