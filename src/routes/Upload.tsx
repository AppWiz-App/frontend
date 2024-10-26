import React from 'react';
import Papa from 'papaparse';

interface UploadProps {
  onUpload: (data: Record<string, any>[]) => void;
}

const Upload = ({ onUpload }: UploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log(result)
          onUpload(result.data);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        },
      });
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-box">
        <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="fileInput"
        />
        <label htmlFor="fileInput">
          <div className="upload-content">
            <i className="cloud-icon">☁️</i>
            <p>Upload a CSV of your applications</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Upload;
