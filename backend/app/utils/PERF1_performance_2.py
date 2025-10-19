// Example usage in an API route or controller
import { AlbumArtService } from '../services/albumArtService';

async function handleAlbumArtUpload(req, res) {
  try {
    const { filename } = req.file; // Assuming using multer or similar
    const albumArtService = new AlbumArtService();
    
    const optimizedImages = await albumArtService.processAlbumArt(filename);
    
    // Use in your HTML with picture element
    const pictureHtml = `
      <picture>
        ${optimizedImages.sizes
          .map(
            size => `<source
              media="(max-width: ${size.width}px)"
              srcset="${size.url}"
              type="image/webp"
            >`
          )
          .join('\n')}
        <img
          src="${optimizedImages.webp}"
          alt="Album artwork"
          loading="lazy"
        />
      </picture>
    `;

    res.json({
      success: true,
      images: optimizedImages,
      pictureHtml
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
