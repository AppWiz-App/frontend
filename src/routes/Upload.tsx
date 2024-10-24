import React from 'react';

interface UploadProps {
  onUpload: (file: File) => void;
}

const Upload = ({ onUpload }: UploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onUpload(event.target.files[0]);
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
