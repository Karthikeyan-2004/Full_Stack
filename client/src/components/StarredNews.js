import React, { useState, useEffect } from 'react';
import './News.css';

function StarredNews() {
  const [starredNews, setStarredNews] = useState([]);

  useEffect(() => {
    const savedStarredNews = JSON.parse(localStorage.getItem('starredNews')) || [];
    setStarredNews(savedStarredNews);
  }, []);

  return (
    <div className="news">
      <h2>Starred News</h2>
      <div className="news-cards">
        {starredNews.length > 0 ? (
          starredNews.map((story, index) => (
            <div key={index} className="news-card">
              <h1 className="news-title">{story.title || "No title available"}</h1>
              <p className="news-time">
                Published: {story.time ? new Date(story.time).toLocaleString() : "Time not available"}
              </p>
              <a href={story.link} target="_blank" rel="noopener noreferrer">
                <button className="read-more-btn">Read More</button>
              </a>
            </div>
          ))
        ) : (
          <p>No starred news articles yet.</p>
        )}
      </div>
    </div>
  );
}

export default StarredNews;
