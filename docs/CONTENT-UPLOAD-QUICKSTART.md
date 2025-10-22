# 🚀 Quick Start: Content Uploaden naar Mr. DJ Website

## Snelle Instructies (5 minuten)

### Stap 1: Upload Content naar Server
```bash
# Van je computer naar server
rsync -av --progress \
  ~/Desktop/mr-dj-fotos/ \
  root@sevensa.nl:/srv/apps/mr-djv1/content/media/photos/

rsync -av --progress \
  ~/Desktop/mr-dj-videos/ \
  root@sevensa.nl:/srv/apps/mr-djv1/content/media/videos/
```

### Stap 2: Process & Deploy
```bash
# SSH naar server
ssh root@sevensa.nl

# Navigate en process
cd /srv/apps/mr-djv1
bash scripts/content/process-media.sh

# Deploy (indien nodig)
cd mr-dj-eds-components
npm run build
rsync -av dist/ ../frontend/public/
docker-compose up -d --build eds-frontend
```

### Stap 3: Verify
```bash
# Check website
curl -I https://mr-dj.sevensa.nl/media/photos/hero/[jouw-foto].jpg

# Open in browser
open https://mr-dj.sevensa.nl
```

---

## 📂 Waar Upload Ik Wat?

| Content Type | Upload Naar | Gebruik |
|--------------|-------------|---------|
| **Hero Images** | `/content/media/photos/hero/` | Homepage hero section (groot, 1920x1080) |
| **Event Foto's** | `/content/media/photos/gallery/weddings/` | Galerij per event type |
| **Team Foto's** | `/content/media/photos/team/` | Team sectie (vierkant, 600x600) |
| **Stad Foto's** | `/content/media/photos/venues/eindhoven/` | City pages (per stad) |
| **Hero Video's** | `/content/media/videos/hero/` | Homepage video (max 10MB) |
| **Testimonials** | `/content/media/videos/testimonials/` | Klant reviews (30-60sec) |

---

## ✅ Checklist Voor Upload

### Foto's
- [ ] Formaat: JPG of PNG
- [ ] Resolutie: Minimaal 1920px breed (hero), 1200px (gallery)
- [ ] Bestandsgrootte: < 2MB per foto
- [ ] Belichting: Goed belicht, scherp
- [ ] Branding: Mr. DJ logo zichtbaar (indien mogelijk)

### Video's
- [ ] Formaat: MP4 (H.264 codec)
- [ ] Resolutie: 1920x1080 (hero) of 1280x720 (testimonials)
- [ ] Bestandsgrootte: < 10MB (hero), < 5MB (testimonials)
- [ ] Duur: Max 60 seconden
- [ ] Audio: Genormaliseerd, goede kwaliteit

---

## 🎯 Wat Doet het Processing Script?

**Automatisch**:
1. ✅ Converteert naar WebP (60% kleiner!)
2. ✅ Genereert thumbnails (400x300)
3. ✅ Comprimeert video's
4. ✅ Maakt poster frames voor video's
5. ✅ Update media-manifest.json
6. ✅ Sync naar frontend public folder

**Jij hoeft alleen** originele, hoogwaardige bestanden te uploaden!

---

## 🔥 Common Commands

```bash
# Upload enkele foto
scp ~/Desktop/hero-wedding.jpg root@sevensa.nl:/srv/apps/mr-djv1/content/media/photos/hero/

# Check wat er al staat
ssh root@sevensa.nl "ls -lh /srv/apps/mr-djv1/content/media/photos/hero/"

# Process alleen (zonder rebuild)
ssh root@sevensa.nl "bash /srv/apps/mr-djv1/scripts/content/process-media.sh"

# Full rebuild + deploy
ssh root@sevensa.nl "cd /srv/apps/mr-djv1 && bash scripts/content/process-media.sh && cd mr-dj-eds-components && npm run build && rsync -av dist/ ../frontend/public/ && docker-compose up -d --build eds-frontend"
```

---

## 💡 Tips

1. **Batch Upload**: Upload meerdere bestanden tegelijk met `rsync -av folder/`
2. **Test Lokaal**: Check foto's eerst lokaal voor kwaliteit
3. **Naming**: Gebruik duidelijke namen: `bruiloft-eindhoven-001.jpg`
4. **Backup**: Bewaar originelen altijd op je eigen systeem
5. **Verify**: Altijd checken op https://mr-dj.sevensa.nl na deploy

---

## 🆘 Problemen?

**Upload faalt**:
```bash
# Check disk space
ssh root@sevensa.nl "df -h"

# Check permissions
ssh root@sevensa.nl "ls -la /srv/apps/mr-djv1/content/media/"
```

**Processing errors**:
```bash
# Check dependencies
ssh root@sevensa.nl "which convert ffmpeg jq"

# Install if missing
ssh root@sevensa.nl "apt-get update && apt-get install -y imagemagick ffmpeg jq"
```

**Foto's niet zichtbaar**:
```bash
# Check if synced to frontend
ssh root@sevensa.nl "ls /srv/apps/mr-djv1/frontend/public/media/photos/hero/"

# Rebuild frontend
ssh root@sevensa.nl "cd /srv/apps/mr-djv1/mr-dj-eds-components && npm run build"
```

---

## 📞 Meer Informatie

- **Volledige Docs**: `/docs/VISUAL-CONTENT-INTEGRATION-PLAN.md`
- **Technical Support**: backend@sevensa.nl
- **Design Guidelines**: Zie docs voor afmetingen & specs

---

**Ready to upload? Start with 1 hero image to test! 🚀**
