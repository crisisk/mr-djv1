// src/controllers/contactController.ts
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

// Define the expected shape of the request body
interface ContactForm {
    name: string;
    email: string;
    message: string;
}

// Configure the email transporter (replace with your SMTP settings)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * POST /api/contact
 * Processes the contact form submission.
 */
export const submitContactForm = [
    // Validate and sanitize the input fields
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Invalid email address'),
    body('message').trim().notEmpty().withMessage('Message is required'),

    async (req: Request, res: Response) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, message }: ContactForm = req.body;

        try {
            // Send an email with the contact form data
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL, // Replace with the admin email address
                subject: `New Contact Form Submission from ${name}`,
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            };

            await transporter.sendMail(mailOptions);

            // Respond with success message
            res.status(200).json({ message: 'Contact form submitted successfully' });
        } catch (error) {
            console.error('Failed to send email:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
];
