// components/ClientLogoWall.jsx
import { useState, useEffect } from 'react';
//import styles from './ClientLogoWall.module.css';

const logos = [
  {
    id: 1,
    name: 'Company One',
    logo: '/images/clients/logo1.png',
    alt: 'Company One Logo'
  },
  // Add more logos here
];

export default function ClientLogoWall() {
  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#1A2C4B]">Trusted By</h2>
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {logos.map((client) => (
          <div key={client.id} className="flex items-center justify-center">
            <img
              src={client.logo}
              alt={client.alt}
              width={150}
              height={80}
              className="max-w-full h-auto grayscale hover:grayscale-0 transition-all"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}