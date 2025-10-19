// Example usage in a profile page component
import React from 'react';
import { ImageCropper } from './ImageCropper';

const ProfilePage: React.FC = () => {
  const handleCroppedImage = async (croppedImage: string) => {
    try {
      // Convert base64 to blob for upload
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('profileImage', blob, 'profile.jpg');

      // Upload to server
      const uploadResponse = await fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await uploadResponse.json();
      console.log('Upload successful:', result);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="profile-page">
      <h1>Edit Profile Picture</h1>
      <ImageCropper
        aspectRatio={1}
        onCropComplete={handleCroppedImage}
        maxFileSize={5 * 1024 * 1024} // 5MB
        allowedTypes={['image/jpeg', 'image/png']}
      />
    </div>
  );
};

export default ProfilePage;
