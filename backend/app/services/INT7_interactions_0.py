// src/config/email.config.ts
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  }
}

// Email configuration
const emailConfig: EmailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || ''
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Configure handlebars
const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.resolve('./src/templates/emails/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./src/templates/emails/'),
  extName: '.hbs'
};

transporter.use('compile', hbs(handlebarOptions));

export default transporter;
