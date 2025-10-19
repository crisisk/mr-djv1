// pages/EventUploadPage.tsx
import React from 'react';
import DragDropUpload from '../components/DragDropUpload';

const EventUploadPage: React.FC = () => {
  const handlePhotoUploadSuccess = (filePath: string) => {
    console.log('Photo uploaded:', filePath);
    // Update your state or make API call to save the reference
  };

  const handleContractUploadSuccess = (filePath: string) => {
    console.log('Contract uploaded:', filePath);
    // Update your state or make API call to save the reference
  };

  return (
    <div className="upload-page">
      <h2>Upload Event Photos</h2>
      <DragDropUpload
        fileType="event-photo"
        onUploadSuccess={handlePhotoUploadSuccess}
        maxSizeMB={10}
        allowedTypes={['image/jpeg', 'image/png']}
      />

      <h2>Upload Contract</h2>
      <DragDropUpload
        fileType="contract"
        onUploadSuccess={handleContractUploadSuccess}
        maxSizeMB={5}
        allowedTypes={['application/pdf']}
      />
    </div>
  );
};

export default EventUploadPage;
