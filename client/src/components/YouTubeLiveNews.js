import React from 'react';
import './YouTubeLiveNews.css';
const liveNewsChannels = [
  {
    "title": "Sun news (Tamil)",
    "url": "https://www.youtube.com/embed/9M02G5c6x6w"
  },
  { title: 'Puthiya Thalaimurai (Tamil)', url: 'https://www.youtube.com/embed/RUzgphgBRzI' },
  { title: 'Thanthi TV (Tamil)', url: 'https://www.youtube.com/embed/j1nzTy5q_1Y' },
  { title: 'Sky News (English)', url: 'https://www.youtube.com/embed/oJUvTVdTMyY' },
  { title: 'France 24 (English)', url: 'https://www.youtube.com/embed/Ap-UM1O9RBU' },
  { title: 'Live Now (English)', url: 'https://www.youtube.com/embed/YDfiTGGPYCk' },
  { title: 'NTV Telugu', url: 'https://www.youtube.com/embed/L0RktSIM980' },
  { title: 'TV9 Telugu', url: 'https://www.youtube.com/embed/II_m28Bm-iM' },
  { title: 'Aaj Tak (Hindi)', url: 'https://www.youtube.com/embed/Nq2wYlWFucg' },
  { title: 'India TV (Hindi)', url: 'https://www.youtube.com/embed/Xmm3Kr5P1Uw' },
  { title: 'Asianet News', url: 'https://www.youtube.com/embed/Ko18SgceYX8' },
  { title: 'News 18 Kerala', url: 'https://www.youtube.com/embed/VY_fsAvlRAA' }
];

const YouTubeLiveNews = () => {
  return (
    <div>
      <h1>24/7 Live News Channels</h1>
      <div className="video-grid">
        {liveNewsChannels.map((channel, index) => (
          <div key={index} className="video-item">
            <h3>{channel.title}</h3>
            <iframe
              src={channel.url}
              title={channel.title}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeLiveNews;
