"use client";

import { useEffect, useState } from 'react';

interface HydrationGuardProps {
  children: React.ReactNode;
  mode?: 'debug' | 'warn' | 'silent';
}

export default function HydrationGuard({ children, mode = 'warn' }: HydrationGuardProps) {
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);

    // Listen for React hydration errors
    const handleError = (event: ErrorEvent) => {
      const message = event.message || event.error?.message || '';

      if (
        message.includes('Hydration') ||
        message.includes('hydration') ||
        message.includes('did not match') ||
        message.includes('suppressed')
      ) {
        const errorMsg = `HYDRATION ERROR: ${message}`;
        setErrors(prev => [...prev, errorMsg]);

        if (mode === 'debug') {
          console.error('🚨 [HydrationGuard]', errorMsg);
          console.error('Stack:', event.error?.stack);
        } else if (mode === 'warn') {
          console.warn('⚠️  [HydrationGuard]', errorMsg);
        }
      }
    };

    window.addEventListener('error', handleError);

    // Check for React DevTools warnings
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (
        message.includes('Hydration') ||
        message.includes('hydration') ||
        message.includes('did not match')
      ) {
        const errorMsg = `HYDRATION WARNING: ${message}`;
        setErrors(prev => [...prev, errorMsg]);

        if (mode !== 'silent') {
          originalConsoleError.apply(console, args);
        }
      } else {
        originalConsoleError.apply(console, args);
      }
    };

    return () => {
      window.removeEventListener('error', handleError);
      console.error = originalConsoleError;
    };
  }, [mode]);

  // Show debug overlay in development
  if (mode === 'debug' && errors.length > 0) {
    return (
      <>
        {children}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '30vh',
            overflow: 'auto',
            background: '#ff0000',
            color: '#fff',
            padding: '1rem',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 999999,
            borderTop: '3px solid #fff',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '14px', fontWeight: 'bold' }}>
            🚨 Hydration Errors Detected ({errors.length})
          </h3>
          {errors.map((error, i) => (
            <div key={i} style={{ marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem' }}>
              {error}
            </div>
          ))}
        </div>
      </>
    );
  }

  return <>{children}</>;
}
