const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'mr-dj-backend',
    version: '1.0.0'
  });
});

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Mister DJ API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      bookings: '/bookings',
      contact: '/contact',
      packages: '/packages'
    }
  });
});

// Bookings endpoint
app.get('/bookings', (req, res) => {
  res.json({
    message: 'Bookings endpoint',
    data: []
  });
});

// Contact form endpoint
app.post('/contact', (req, res) => {
  const { name, email, phone, message, eventType, eventDate } = req.body;
  
  // TODO: Save to database and send email
  console.log('Contact form submission:', { name, email, phone, eventType, eventDate });
  
  res.json({
    success: true,
    message: 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.'
  });
});

// Packages endpoint
app.get('/packages', (req, res) => {
  res.json({
    packages: [
      {
        id: 'bronze',
        name: 'Brons Pakket',
        price: 795,
        duration: '4 uur',
        features: [
          'Professionele DJ',
          'Geluidssysteem',
          'Basisverlichting',
          'Muziekvoorkeuren formulier',
          '100% Dansgarantie'
        ]
      },
      {
        id: 'silver',
        name: 'Zilver Pakket',
        price: 995,
        duration: '5 uur',
        features: [
          'Professionele DJ',
          'Premium geluidssysteem',
          'LED verlichting',
          'Rookmachine',
          'Muziekvoorkeuren formulier',
          'Persoonlijk intakegesprek',
          '100% Dansgarantie'
        ],
        popular: true
      },
      {
        id: 'gold',
        name: 'Goud Pakket',
        price: 1295,
        duration: '6 uur',
        features: [
          'Professionele DJ',
          'Premium geluidssysteem',
          'Moving head verlichting',
          'Rookmachine',
          'DJ booth met logo',
          'Muziekvoorkeuren formulier',
          'Persoonlijk intakegesprek',
          'Saxofonist (optioneel)',
          '100% Dansgarantie'
        ]
      }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mister DJ Backend API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;

