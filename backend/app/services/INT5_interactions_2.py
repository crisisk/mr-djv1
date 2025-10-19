// profileImageUpload.ts
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const router = express.Router();

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'));
      return;
    }
    cb(null, true);
  },
});

router.post('/api/upload-profile-image', upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Generate unique filename
    const fileName = `${uuidv4()}.jpg`;
    const uploadPath = path.join(__dirname, '../public/uploads/profiles', fileName);

    // Process image with sharp
    await sharp(req.file.buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toFile(uploadPath);

    // Save image path to database (example)
    // await User.updateProfileImage(req.user.id, fileName);

    res.json({
      success: true,
      imageUrl: `/uploads/profiles/${fileName}`,
    });

  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({
      error: 'Failed to process image upload',
    });
  }
});

export default router;
