'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useABTest, VariantConfig } from '../hooks/useABTest';
import Button from '../ui/Button';

// --- Design Tokens (Simulated) ---
const designTokens = {
  'text-primary': 'text-blue-600',
  'bg-primary': 'bg-blue-600',
  'spacing-xs': 'p-1',
  'spacing-sm': 'p-2',
  'spacing-md': 'p-4',
  'spacing-lg': 'p-6',
  'spacing-xl': 'p-8',
};

// --- Interfaces ---

/**
 * Defines the structure for the custom configuration data
 * expected within the A/B test variant.
 */
interface HeroVariantConfig extends VariantConfig {
  asset_url: string;
  alt_text?: string;
  loading?: 'eager' | 'lazy';
  sizes?: string;
  headline: string;
  subheadline: string;
  cta_text: string;
}

/**
 * Defines the structure for the contact form data.
 */
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// --- Components ---

/**
 * Simple Contact Form component.
 * In a real app, this would be more complex and likely a separate file.
 */
interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Submission failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSubmit]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-2xl w-full max-w-md ${designTokens['spacing-lg']}`}>
        <h2 className={`text-2xl font-bold mb-4 ${designTokens['text-primary']}`}>Neem Contact Op</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Naam
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Bericht
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              size="md"
              onClick={onClose}
              type="button"
              disabled={isSubmitting}
            >
              Annuleren
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verzenden...' : 'Verzenden'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * AB Test Hero Example Component
 */
const ABTestHeroExample: React.FC = () => {
  const [showContactForm, setShowContactForm] = useState(false);

  // Initialize A/B test
  const { variant, trackConversion, isLoading, error, isControl } = useABTest<HeroVariantConfig>(
    'hero-image-001',
    {
      enabled: true,
      autoTrackImpression: true,
      debug: process.env.NODE_ENV === 'development',
      onVariantAssigned: (v) => {
        console.log('User assigned to variant:', v.name);
      },
      onConversion: (data) => {
        console.log('Conversion tracked:', data);
      },
    }
  );

  // Type assertion for the variant config
  const variantConfig = useMemo(() => variant?.config as HeroVariantConfig | undefined, [variant]);

  // Handle contact form opening
  const handleContactFormOpen = useCallback(() => {
    setShowContactForm(true);
    // Track the conversion (low value, just opening the form)
    trackConversion('contact_form_open', 0);
  }, [trackConversion]);

  // Handle contact form closing
  const handleContactFormClose = useCallback(() => {
    setShowContactForm(false);
  }, []);

  // Handle contact form submission
  const handleContactFormSubmit = useCallback(
    async (formData: ContactFormData) => {
      try {
        // Simulate API call
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // Track successful conversion with higher value
          await trackConversion('contact_form_submit', 1);

          alert('Bedankt voor je bericht! We nemen snel contact met je op.');
          setShowContactForm(false);
        } else {
          throw new Error('API submission failed');
        }
      } catch (err) {
        console.error('Form submission error:', err);
        alert('Er is een fout opgetreden bij het verzenden van het formulier.');
        throw err; // Re-throw to allow ContactForm to handle state
      }
    },
    [trackConversion]
  );

  // --- Render States ---

  // Loading state
  if (isLoading) {
    return (
      <div className="relative w-full h-96 overflow-hidden bg-gray-100 animate-pulse flex items-center justify-center" aria-live="polite" aria-busy="true">
        <div className="text-gray-500 text-lg">Laden van de heldensectie...</div>
      </div>
    );
  }

  // Error state or no variant assigned - show fallback (Control Default)
  if (error || !variantConfig) {
    const fallbackConfig: HeroVariantConfig = {
      id: 'fallback',
      name: 'fallback',
      asset_url: '/media/photos/default-hero.jpg',
      alt_text: 'Professionele DJ Setup',
      loading: 'eager',
      sizes: '100vw',
      headline: 'Professionele DJ voor Jouw Feest',
      subheadline: 'Boek nu de perfecte sfeer voor elk evenement.',
      cta_text: 'Neem Contact Op',
    };

    return (
      <div className="relative w-full h-96 overflow-hidden" role="region" aria-label="Fallback Hero Section">
        <img
          src={fallbackConfig.asset_url}
          alt={fallbackConfig.alt_text}
          className="absolute inset-0 w-full h-full object-cover"
          loading={fallbackConfig.loading}
          sizes={fallbackConfig.sizes}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`text-white text-center ${designTokens['spacing-lg']}`}>
            <h1 className="text-4xl font-extrabold mb-2">{fallbackConfig.headline}</h1>
            <p className="text-xl mb-6">{fallbackConfig.subheadline}</p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleContactFormOpen}
            >
              {fallbackConfig.cta_text}
            </Button>
          </div>
        </div>
        {showContactForm && (
          <ContactForm onSubmit={handleContactFormSubmit} onClose={handleContactFormClose} />
        )}
      </div>
    );
  }

  // A/B test is active - render variant
  return (
    <div
      className={`relative w-full h-96 overflow-hidden`}
      data-test-id="hero-image-001"
      data-variant-id={variant?.config.id}
      data-variant-type={isControl ? 'control' : 'variant'}
      role="region"
      aria-label={`A/B Test Hero Section: ${variant?.config.name}`}
    >
      {/* Hero Image (A/B tested) */}
      <img
        src={variantConfig.asset_url}
        alt={variantConfig.alt_text || 'DJ Setup'}
        className="absolute inset-0 w-full h-full object-cover"
        loading={variantConfig.loading || 'eager'}
        sizes={variantConfig.sizes || '100vw'}
      />

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className={`text-white text-center ${designTokens['spacing-lg']}`}>
          <h1 className="text-4xl font-extrabold mb-2">{variantConfig.headline}</h1>
          <p className="text-xl mb-6">{variantConfig.subheadline}</p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleContactFormOpen}
          >
            {variantConfig.cta_text}
          </Button>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm onSubmit={handleContactFormSubmit} onClose={handleContactFormClose} />
      )}
    </div>
  );
};

export default ABTestHeroExample;