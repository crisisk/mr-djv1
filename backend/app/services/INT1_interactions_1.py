// api/routes/upload.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.body.type as string;
    let uploadPath = '';

    // Determine upload directory based on file type
    if (uploadType === 'event-photo') {
      uploadPath = path.join(__dirname, '../../uploads/event-photos');
    } else if (uploadType === 'contract') {
      uploadPath = path.join(__dirname, '../../uploads/contracts');
    } else {
      return cb(new Error('Invalid upload type'), '');
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter to validate uploads
const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const uploadType = req.body.type as string;
  
  // Define allowed file types for each upload type
  const allowedTypes: Record<string, string[]> = {
    'event-photo': ['image/jpeg', 'image/png'],
    'contract': ['application/pdf', 'image/jpeg', 'image/png']
  };

  if (uploadType in allowedTypes && allowedTypes[uploadType].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${uploadType} upload`));
  }
};

// Configure multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const fileType = req.body.type;
    if (!['event-photo', 'contract'].includes(fileType)) {
      throw new Error('Invalid upload type');
    }

    // Construct relative path for frontend to use
    const relativePath = path.join(
      'uploads',
      fileType === 'event-photo' ? 'event-photos' : 'contracts',
      req.file.filename
    );

    res.json({
      success: true,
      filePath: relativePath
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Upload failed'
    });
  }
});

export default router;
