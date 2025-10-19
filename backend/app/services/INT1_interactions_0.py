// components/DragDropUpload.tsx
import React, { useCallback, useState, useRef } from 'react';
import axios from 'axios';

type FileType = 'event-photo' | 'contract';

interface UploadResponse {
  success: boolean;
  message?: string;
  filePath?: string;
}

interface DragDropUploadProps {
  fileType: FileType;
  onUploadSuccess: (filePath: string) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  fileType,
  onUploadSuccess,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      return false;
    }

    // Check file size (MB to bytes)
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max size: ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      const file = files[0];
      if (!validateFile(file)) return;

      await uploadFile(file);
    },
    [fileType]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      if (!validateFile(file)) return;

      await uploadFile(file);
    },
    [fileType]
  );

  const uploadFile = async (file: File) => {
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileType);

    try {
      const response = await axios.post<UploadResponse>('/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success && response.data.filePath) {
        onUploadSuccess(response.data.filePath);
      } else {
        setError(response.data.message || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadProgress(0);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="drag-drop-upload">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept={allowedTypes.join(',')}
          style={{ display: 'none' }}
        />
        <div className="upload-instructions">
          {isDragging ? (
            <p>Drop the file here</p>
          ) : (
            <>
              <p>Drag & drop {fileType === 'event-photo' ? 'an event photo' : 'a contract'} here</p>
              <p>or click to browse</p>
              <p className="file-requirements">
                Max size: {maxSizeMB}MB | Allowed: {allowedTypes.join(', ')}
              </p>
            </>
          )}
        </div>
      </div>

      {uploadProgress > 0 && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DragDropUpload;
