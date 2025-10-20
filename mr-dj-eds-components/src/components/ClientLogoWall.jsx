// components/ClientLogoWall.jsx
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
    <section className={styles.section} aria-labelledby="client-logo-wall-title">
      <div className={styles.inner}>
        <h2 id="client-logo-wall-title" className={styles.title}>
          Trusted By
        </h2>
        <div className={styles.grid}>
          {logos.map((client) => (
            <figure key={client.id} className={styles.logoItem}>
              <img
                src={client.logo}
                alt={client.alt}
                className={styles.logoImage}
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
