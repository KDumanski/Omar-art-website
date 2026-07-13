'use client';
import { useState } from 'react';
import { ytThumb, ytEmbed } from '@/lib/videoTestimonials';
import styles from './VideoTestimonials.module.css';

// Click-to-play YouTube Shorts. We show a lightweight thumbnail until the visitor
// chooses to play, so three video iframes never block the page load. Once clicked,
// we swap in the privacy-enhanced (youtube-nocookie) embed and autoplay it.
// `videos` come from a server page that reads the DB; each is { videoId, caption }.
export default function VideoTestimonials({ videos = [] }) {
  const [playing, setPlaying] = useState(null);
  if (videos.length === 0) return null;

  return (
    <div className={styles.grid}>
      {videos.map((v) => (
        <figure key={v.videoId} className={styles.card}>
          <div className={styles.frame}>
            {playing === v.videoId ? (
              <iframe
                className={styles.player}
                src={ytEmbed(v.videoId)}
                title={v.caption}
                allow="accelerated-motion; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className={styles.poster}
                onClick={() => setPlaying(v.videoId)}
                aria-label={`Play video testimonial: ${v.caption}`}
              >
                <img src={ytThumb(v.videoId)} alt="" className={styles.thumb} loading="lazy" />
                <span className={styles.scrim} aria-hidden="true" />
                <span className={styles.play} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
          <figcaption className={styles.cap}>{v.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
