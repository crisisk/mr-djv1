// components/ClientLogoWall.jsx
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ClientLogoWall.module.css';

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
    <section className={styles.logoWallContainer}>
      <h2 className={styles.title}>Trusted By</h2>
      <div className={styles.logoGrid}>
        {logos.map((client) => (
          <div key={client.id} className={styles.logoWrapper}>
            <Image
              src={client.logo}
              alt={client.alt}
              width={150}
              height={80}
              className={styles.logo}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
