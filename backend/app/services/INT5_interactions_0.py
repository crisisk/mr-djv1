// ImageCropper.tsx
import React, { useState, useRef, useCallback } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface ImageCropperProps {
  initialImage?: string;
  aspectRatio?: number;
  onCropComplete: (croppedImage: string) => void;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  initialImage,
  aspectRatio = 1, // 1:1 for profile photos
  onCropComplete,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [image, setImage] = useState<string>(initialImage || '');
  const [error, setError] = useState<string>('');
  const cropperRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a valid image.');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setError(`File size must be less than ${maxFileSize / (1024 * 1024)}MB`);
      return;
    }

    // Clear previous error
    setError('');

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImage = useCallback(() => {
    try {
      const cropper = cropperRef.current?.cropper;
      if (!cropper) return;

      // Get cropped canvas
      const canvas = cropper.getCroppedCanvas({
        width: 400, // Output size
        height: 400,
        fillColor: '#fff'
      });

      // Convert to base64
      const croppedImage = canvas.toDataURL('image/jpeg', 0.8);
      onCropComplete(croppedImage);
    } catch (err) {
      setError('Error cropping image. Please try again.');
      console.error('Cropping error:', err);
    }
  }, [onCropComplete]);

  return (
    <div className="image-cropper">
      {error && <div className="error-message">{error}</div>}
      
      <input
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        className="file-input"
      />

      {image && (
        <>
          <Cropper
            ref={cropperRef}
            src={image}
            aspectRatio={aspectRatio}
            guides={true}
            viewMode={1}
            minCropBoxHeight={100}
            minCropBoxWidth={100}
            background={false}
            responsive={true}
            checkOrientation={false}
          />
          <button 
            onClick={getCroppedImage}
            className="crop-button"
          >
            Crop Image
          </button>
        </>
      )}
    </div>
  );
};
