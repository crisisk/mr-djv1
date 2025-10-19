// src/components/MusicShowcase.jsx
import React from 'react';
import styles from './MusicShowcase.module.css';

const MusicShowcase = () => {
  const playlists = [
    {
      title: "House & EDM",
      spotifyId: "37i9dQZF1DX6J5NfMJS675"
    },
    {
      title: "Hip-Hop Hits",
      spotifyId: "37i9dQZF1DX0XUsuxWHRQd"
    },
    {
      title: "Party Classics",
      spotifyId: "37i9dQZF1DXa2PvUpywmrr"
    }
  ];

  return (
    <section className={styles.showcaseSection}>
      <h2>Music Styles</h2>
      <div className={styles.playlistGrid}>
        {playlists.map((playlist) => (
          <div key={playlist.spotifyId} className={styles.playlistContainer}>
            <h3>{playlist.title}</h3>
            <iframe
              src={`https://open.spotify.com/embed/playlist/${playlist.spotifyId}`}
              width="100%"
              height="380"
              frameBorder="0"
              allowtransparency="true"
              allow="encrypted-media"
              loading="lazy"
              title={`${playlist.title} Playlist`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MusicShowcase;
