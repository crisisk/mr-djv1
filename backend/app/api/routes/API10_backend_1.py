// app.ts
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { setupOAuthRoutes, handleOAuthError } from './oauth2-strategies';

const app = express();

// Configure session middleware
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true,
}));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Setup OAuth routes
setupOAuthRoutes(app);

// Handle OAuth errors
app.use(handleOAuthError);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
