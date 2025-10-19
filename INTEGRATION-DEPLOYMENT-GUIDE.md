# Quick Deployment Guide: RentGuy Onboarding Integration

**Purpose**: Step-by-step instructions to deploy and integrate the Mr. DJ onboarding portal
**Time Required**: 2-4 hours for Phase 1, 16-24 hours for full integration
**Difficulty**: Medium

---

## Phase 1: Deploy Onboarding Portal (2-3 hours)

### Step 1: Fix Domain Configuration

```bash
cd /opt/rentguy/onboarding/mr-dj-onboarding-enhanced

# Backup original config
cp docker-compose.yml docker-compose.yml.backup

# Update domain from 'onboarding.rentguy' to 'mr-dj.rentguy.nl'
sed -i 's/onboarding\.rentguy/mr-dj.rentguy.nl/g' docker-compose.yml

# Verify change
grep "Host" docker-compose.yml
# Should show: Host(`mr-dj.rentguy.nl`)
```

### Step 2: Build Docker Image

```bash
# Build the production image
docker-compose build --no-cache

# Verify image created
docker images | grep mr-dj-onboarding
```

### Step 3: Deploy Container

```bash
# Start the container
docker-compose up -d

# Check container status
docker-compose ps

# Expected output:
# NAME                 STATUS          PORTS
# mr-dj-onboarding     Up 10 seconds   80/tcp

# View logs
docker-compose logs -f
```

### Step 4: Verify Deployment

```bash
# Check if container is running
docker ps | grep mr-dj-onboarding

# Test internal connectivity
docker exec mr-dj-onboarding wget -q --spider http://localhost/ && echo "OK" || echo "FAIL"

# Test external access (wait 30 seconds for SSL)
sleep 30
curl -I https://mr-dj.rentguy.nl

# Expected: HTTP/2 200
```

### Step 5: Test Onboarding Portal

Open browser and navigate through all steps:

1. **https://mr-dj.rentguy.nl** - Should load welcome screen
2. Click "Start Configuratie" → Business info form
3. Test navigation between all 10 steps
4. Verify responsive design on mobile
5. Check browser console for errors

### Troubleshooting

**Issue: Container not starting**
```bash
docker-compose logs
# Check for port conflicts or missing dependencies
```

**Issue: 502 Bad Gateway**
```bash
# Check Traefik logs
docker logs traefik | grep mr-dj

# Verify network connection
docker network inspect traefik | grep mr-dj-onboarding
```

**Issue: SSL certificate not working**
```bash
# Check Traefik ACME logs
docker exec traefik cat /opt/traefik/acme-letsencrypt.json | jq

# Manually trigger certificate generation
docker exec traefik traefik healthcheck
```

---

## Phase 2: Add Marketing Site Links (2-4 hours)

### Step 1: Add "Get Started" Button to Homepage

**File**: `/opt/mr-dj/frontend/src/components/Hero.tsx` (or equivalent)

```typescript
<Button
  href="https://mr-dj.rentguy.nl"
  target="_blank"
  rel="noopener noreferrer"
  className="btn-primary"
>
  Start Onboarding
  <ArrowRight className="ml-2" />
</Button>
```

### Step 2: Update Booking Success Page

**File**: `/opt/mr-dj/frontend/src/pages/BookingSuccess.tsx` (or equivalent)

```typescript
export const BookingSuccess = () => {
  return (
    <div className="success-page">
      <h1>Booking Confirmed!</h1>
      <p>Thank you for your request. Complete your setup:</p>

      <Button href="https://mr-dj.rentguy.nl">
        Complete Account Setup →
      </Button>

      <p className="text-sm text-gray-600">
        You'll receive an email with setup instructions shortly.
      </p>
    </div>
  );
};
```

### Step 3: Rebuild and Deploy Marketing Site

```bash
cd /opt/mr-dj

# Rebuild frontend
docker-compose build eds-frontend

# Restart container
docker-compose restart eds-frontend

# Verify
curl -s https://mr-dj.sevensa.nl | grep "onboarding"
```

---

## Phase 3: Token-Based Integration (16-24 hours)

### Step 1: Update Backend API

**File**: `/opt/mr-dj/backend/src/server.js`

Add token generation and prefill endpoints:

```javascript
const crypto = require('crypto');

// Add after existing endpoints

// Generate onboarding token on booking
app.post('/bookings', async (req, res) => {
  try {
    const { name, email, phone, eventType, eventDate, message } = req.body;

    // Save booking to database
    const booking = await pool.query(
      'INSERT INTO bookings (name, email, phone, event_type, event_date, message, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, email, phone, eventType, eventDate, message, 'pending']
    );

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const prefillData = {
      bookingId: booking.rows[0].id,
      businessName: name,
      contactPerson: name,
      email: email,
      phone: phone,
      eventType: eventType
    };

    // Store in Redis with 24h expiry
    await redis.setex(
      `onboarding:${token}`,
      86400, // 24 hours
      JSON.stringify(prefillData)
    );

    // Generate onboarding URL
    const onboardingUrl = `https://mr-dj.rentguy.nl/onboarding?token=${token}`;

    res.json({
      success: true,
      bookingId: booking.rows[0].id,
      onboardingUrl: onboardingUrl,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Prefill endpoint for onboarding portal
app.get('/api/onboarding/prefill', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    // Fetch from Redis
    const data = await redis.get(`onboarding:${token}`);

    if (!data) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    // Parse and return
    const prefillData = JSON.parse(data);

    // Optional: Delete token after first use (single-use)
    // await redis.del(`onboarding:${token}`);

    res.json({
      success: true,
      data: prefillData
    });
  } catch (error) {
    console.error('Prefill error:', error);
    res.status(500).json({ error: 'Failed to fetch prefill data' });
  }
});
```

### Step 2: Update Redis Connection

**File**: `/opt/mr-dj/backend/src/server.js`

Add Redis client initialization:

```javascript
const Redis = require('ioredis');

// Add after PostgreSQL pool
const redis = new Redis({
  host: 'mr-dj-redis',
  port: 6379,
  password: 'mrdj_redis_password_2025',
  db: 0
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});
```

### Step 3: Install Redis Client

```bash
cd /opt/mr-dj/backend

# Add ioredis dependency
npm install ioredis

# Update package.json in docker-compose volumes or rebuild
docker-compose build mr-dj-backend
docker-compose restart mr-dj-backend
```

### Step 4: Update Onboarding Portal

**New File**: `/opt/rentguy/onboarding/mr-dj-onboarding-enhanced/src/hooks/useBookingPrefill.js`

```javascript
import { useEffect, useState } from 'react';

export const useBookingPrefill = () => {
  const [prefillData, setPrefillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`https://mr-dj.sevensa.nl/api/onboarding/prefill?token=${token}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch prefill data');
        return res.json();
      })
      .then(result => {
        if (result.success) {
          setPrefillData(result.data);
        } else {
          setError(result.error);
        }
      })
      .catch(err => {
        console.error('Prefill error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { prefillData, loading, error, hasToken: !!prefillData };
};
```

### Step 5: Update Business Info Step

**File**: `/opt/rentguy/onboarding/mr-dj-onboarding-enhanced/src/components/AllOnboardingComponents.jsx`

Update `BusinessInfoStep` component:

```javascript
import { useBookingPrefill } from '@/hooks/useBookingPrefill';

export const BusinessInfoStep = ({ onNext, onBack, initialData = {} }) => {
  const { prefillData, loading } = useBookingPrefill();

  const [formData, setFormData] = useState({
    businessName: prefillData?.businessName || initialData.businessName || '',
    contactPerson: prefillData?.contactPerson || initialData.contactPerson || '',
    email: prefillData?.email || initialData.email || '',
    phone: prefillData?.phone || initialData.phone || '',
    // ... rest of fields
  });

  // Update form when prefill data arrives
  useEffect(() => {
    if (prefillData) {
      setFormData(prev => ({
        ...prev,
        ...prefillData
      }));
    }
  }, [prefillData]);

  if (loading) {
    return <div>Loading your information...</div>;
  }

  // ... rest of component
};
```

### Step 6: Rebuild and Deploy

```bash
# Backend
cd /opt/mr-dj
docker-compose build mr-dj-backend
docker-compose restart mr-dj-backend

# Onboarding Portal
cd /opt/rentguy/onboarding/mr-dj-onboarding-enhanced
docker-compose build
docker-compose restart mr-dj-onboarding
```

### Step 7: Test Integration

```bash
# Test token generation
curl -X POST https://mr-dj.sevensa.nl/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+31612345678",
    "eventType": "bruiloft",
    "eventDate": "2025-12-31",
    "message": "Test booking"
  }'

# Expected response:
# {
#   "success": true,
#   "bookingId": 123,
#   "onboardingUrl": "https://mr-dj.rentguy.nl/onboarding?token=..."
# }

# Copy the token from response and test prefill
curl "https://mr-dj.sevensa.nl/api/onboarding/prefill?token=YOUR_TOKEN_HERE"

# Expected response:
# {
#   "success": true,
#   "data": {
#     "businessName": "Test User",
#     "email": "test@example.com",
#     ...
#   }
# }
```

---

## Testing Checklist

### Phase 1: Onboarding Portal Deployment

- [ ] Container running: `docker ps | grep mr-dj-onboarding`
- [ ] HTTPS working: `curl -I https://mr-dj.rentguy.nl`
- [ ] All 10 steps load without errors
- [ ] Form validation working
- [ ] Mobile responsive design
- [ ] No console errors in browser

### Phase 2: Marketing Site Links

- [ ] "Get Started" button visible on homepage
- [ ] Button redirects to onboarding portal
- [ ] Booking success page shows onboarding link
- [ ] Links open in new tab (target="_blank")

### Phase 3: Token Integration

- [ ] POST /api/bookings generates token
- [ ] Token stored in Redis with 24h TTL
- [ ] GET /api/onboarding/prefill returns data
- [ ] Onboarding portal accepts ?token parameter
- [ ] Business info form pre-fills correctly
- [ ] Invalid tokens return 404 error
- [ ] Expired tokens (24h+) return 404 error

---

## Monitoring & Maintenance

### Check Container Health

```bash
# All services
docker-compose -f /opt/mr-dj/docker-compose.yml ps
docker-compose -f /opt/rentguy/onboarding/mr-dj-onboarding-enhanced/docker-compose.yml ps

# Logs
docker logs mr-dj-backend --tail 100
docker logs mr-dj-onboarding --tail 100
```

### Check Redis Token Storage

```bash
# Connect to Redis
docker exec -it mr-dj-redis redis-cli -a mrdj_redis_password_2025

# List onboarding tokens
KEYS onboarding:*

# Check token data
GET onboarding:YOUR_TOKEN_HERE

# Check TTL (time to live)
TTL onboarding:YOUR_TOKEN_HERE

# Exit Redis
exit
```

### Monitor Integration Metrics

```bash
# Count bookings with onboarding tokens
docker exec mr-dj-postgres psql -U mrdj_user -d mrdj_db -c \
  "SELECT COUNT(*) FROM bookings WHERE created_at > NOW() - INTERVAL '24 hours';"

# Check Redis token count
docker exec -it mr-dj-redis redis-cli -a mrdj_redis_password_2025 DBSIZE
```

---

## Rollback Procedures

### Rollback Onboarding Portal

```bash
cd /opt/rentguy/onboarding/mr-dj-onboarding-enhanced

# Stop and remove container
docker-compose down

# Restore original config
cp docker-compose.yml.backup docker-compose.yml

# Or completely remove
docker-compose down -v
docker rmi rentguy/mr-dj-onboarding
```

### Rollback Backend API Changes

```bash
cd /opt/mr-dj

# Revert to previous version
git checkout HEAD^ backend/src/server.js

# Rebuild
docker-compose build mr-dj-backend
docker-compose restart mr-dj-backend
```

---

## Security Checklist

- [ ] HTTPS enforced on both domains
- [ ] Tokens are cryptographically secure (32+ bytes)
- [ ] Tokens expire after 24 hours
- [ ] Redis password protected
- [ ] CORS configured to allow only specific origins
- [ ] Rate limiting enabled on prefill endpoint
- [ ] No sensitive data in URL parameters
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (CSP headers)

---

## Support & Troubleshooting

### Common Issues

**"Connection refused" from onboarding to API**
- Check CORS settings in backend
- Verify network connectivity between containers
- Check firewall rules

**"Invalid or expired token"**
- Verify Redis is running
- Check token TTL: `TTL onboarding:TOKEN`
- Ensure token passed in URL correctly

**502 Bad Gateway**
- Check if container is running: `docker ps`
- Verify Traefik routing: `docker logs traefik`
- Check nginx logs: `docker logs mr-dj-onboarding`

**Form not pre-filling**
- Check browser console for errors
- Verify token parameter in URL
- Test prefill endpoint directly with curl

---

## Next Steps After Deployment

1. **Monitor conversion rates**: Track how many bookings complete onboarding
2. **Gather user feedback**: Survey users about the onboarding experience
3. **A/B testing**: Test different CTA placements and copy
4. **Email automation**: Set up automated emails with onboarding links
5. **Analytics integration**: Add GA4 events for onboarding funnel
6. **CRM integration**: Sync onboarded users to main RentGuy CRM

---

**Last Updated**: October 19, 2025
**Maintainer**: DevOps Team
**Questions**: Contact admin@sevensa.nl
