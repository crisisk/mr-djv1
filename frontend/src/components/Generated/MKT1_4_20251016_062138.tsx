// src/components/Partnerships.jsx
import React from 'react';
import styles from './Partnerships.module.css';

const Partnerships = () => {
  const partners = [
    {
      category: 'Venues',
      items: [
        {
          name: 'Grand Plaza Hotel',
          url: 'https://grandplaza.com',
          description: 'Luxury wedding venue partner'
        },
        {
          name: 'Garden Events Center',
          url: 'https://gardenevents.com',
          description: 'Premium outdoor venue partner'
        }
      ]
    },
    {
      category: 'Wedding Planners',
      items: [
        {
          name: 'Perfect Day Planning',
          url: 'https://perfectday.com',
          description: 'Expert wedding planning services'
        },
        {
          name: 'Dream Weddings',
          url: 'https://dreamweddings.com',
          description: 'Luxury wedding planning partner'
        }
      ]
    }
  ];

  return (
    <section className={styles.partnerships}>
      <h2>Our Trusted Partners</h2>
      <div className={styles.partnerGrid}>
        {partners.map((category) => (
          <div key={category.category} className={styles.category}>
            <h3>{category.category}</h3>
            <div className={styles.partnerList}>
              {category.items.map((partner) => (
                <a 
                  key={partner.name}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.partnerCard}
                >
                  <h4>{partner.name}</h4>
                  <p>{partner.description}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Partnerships;
