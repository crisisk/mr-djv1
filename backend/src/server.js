const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

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

// Test database connection on startup
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => console.error('❌ Database connection error:', err.message));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbResult = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'mr-dj-backend',
      version: '1.0.0',
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      service: 'mr-dj-backend',
      version: '1.0.0',
      database: 'disconnected',
      error: error.message
    });
  }
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

// Contact form endpoint with validation
app.post('/contact', [
  body('name').trim().notEmpty().withMessage('Naam is verplicht').isLength({ min: 2 }).withMessage('Naam moet minimaal 2 tekens bevatten'),
  body('email').trim().notEmpty().withMessage('Email is verplicht').isEmail().withMessage('Ongeldig emailadres').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).matches(/^[\d\s\-\+\(\)]{10,}$/).withMessage('Ongeldig telefoonnummer'),
  body('message').trim().notEmpty().withMessage('Bericht is verplicht').isLength({ min: 10 }).withMessage('Bericht moet minimaal 10 tekens bevatten'),
  body('eventType').trim().notEmpty().withMessage('Type evenement is verplicht').isIn(['bruiloft', 'bedrijfsfeest', 'verjaardag', 'jubileum', 'feest', 'anders']).withMessage('Ongeldig type evenement'),
  body('eventDate').optional({ checkFalsy: true }).isISO8601().withMessage('Ongeldige datum'),
], async (req, res) => {
  // Validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validatie fouten',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  const { name, email, phone, message, eventType, eventDate } = req.body;

  try {
    // Insert into database
    const result = await pool.query(
      `INSERT INTO contacts (name, email, phone, message, event_type, event_date, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id, created_at`,
      [name, email, phone || null, message, eventType, eventDate || null, 'new']
    );

    console.log('✅ Contact form submission saved:', {
      id: result.rows[0].id,
      name,
      email,
      eventType,
      eventDate
    });

    // TODO: Send email notification (future enhancement)

    res.json({
      success: true,
      message: 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
      contactId: result.rows[0].id
    });
  } catch (error) {
    console.error('❌ Database error saving contact:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het verzenden. Probeer het later opnieuw.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
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

