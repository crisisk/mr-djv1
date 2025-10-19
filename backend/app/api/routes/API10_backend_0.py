// oauth2-strategies.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Request, Response, NextFunction } from 'express';

// Environment variables for OAuth2 credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your_google_client_id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret';
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || 'your_facebook_app_id';
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || 'your_facebook_app_secret';

// Callback URLs for OAuth2
const GOOGLE_CALLBACK_URL = '/auth/google/callback';
const FACEBOOK_CALLBACK_URL = '/auth/facebook/callback';

// Configure Google OAuth2 Strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
    // This function is called after successful authentication
    // You can save the user profile to your database here
    return done(null, profile);
}));

// Configure Facebook OAuth2 Strategy
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name'], // Requested fields from Facebook
}, (accessToken, refreshToken, profile, done) => {
    // This function is called after successful authentication
    // You can save the user profile to your database here
    return done(null, profile);
}));

// Serialize and deserialize user (required for sessions)
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user as Express.User);
});

// Middleware to handle authentication errors
export const handleOAuthError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        return res.status(401).json({ message: 'Authentication failed', error: err.message });
    }
    next();
};

// Example usage in an Express app
export const setupOAuthRoutes = (app: any) => {
    // Google OAuth routes
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req: Request, res: Response) => {
        // Successful authentication, redirect home
        res.redirect('/');
    });

    // Facebook OAuth routes
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req: Request, res: Response) => {
        // Successful authentication, redirect home
        res.redirect('/');
    });
};
