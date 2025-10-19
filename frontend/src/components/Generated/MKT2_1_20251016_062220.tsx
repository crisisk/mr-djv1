import React from 'react';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import styles from './BlogPost.module.css';

const WeddingMusicTips = () => {
  return (
    <Layout>
      <SEO 
        title="10 Tips voor Perfecte Bruiloft Muziek | Mr. DJ"
        description="Ontdek hoe je de perfecte muziek voor je bruiloft kiest met deze 10 essentiële tips van professionele DJs."
      />
      
      <article className={styles.blogPost}>
        <h1>10 Tips voor Perfecte Bruiloft Muziek</h1>
        
        <div className={styles.content}>
          <section>
            <h2>1. Begin vroeg met plannen</h2>
            <p>Start minimaal 6 maanden voor de bruiloft met het plannen van je muziek. Goede DJs zijn vaak ver van tevoren volgeboekt.</p>
          </section>

          <section>
            <h2>2. Maak een must-play lijst</h2>
            <p>Stel een lijst samen met nummers die absoluut gespeeld moeten worden tijdens je bruiloft.</p>
          </section>

          {/* Additional 8 tips... */}
          
          <section>
            <h2>10. Vertrouw op je DJ</h2>
            <p>Een ervaren DJ weet hoe hij de dansvloer vol houdt en kan inspelen op de sfeer van het moment.</p>
          </section>
        </div>

        <div className={styles.cta}>
          <h3>Klaar om je bruiloftsmuziek te bespreken?</h3>
          <button onClick={() => window.location.href='/contact'}>
            Neem contact op
          </button>
        </div>
      </article>
    </Layout>
  );
};

export default WeddingMusicTips;
