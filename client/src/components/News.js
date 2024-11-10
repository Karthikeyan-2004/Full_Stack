import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './News.css';

function News() {
  const [news, setNews] = useState([]);
  const [starredNews, setStarredNews] = useState([]);
  const [category, setCategory] = useState('local');
  const [language, setLanguage] = useState('english');
  const preference = localStorage.getItem('preference');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/news`, {
        params: {
          topic: preference,
          category: category,
          language: language
        }
      })
      .then(response => setNews(response.data))
      .catch(error => console.log('Error fetching news:', error));

    const savedStarredNews = JSON.parse(localStorage.getItem('starredNews')) || [];
    setStarredNews(savedStarredNews);
  }, [preference, category, language]);

  const toggleStar = (story) => {
    const isStarred = starredNews.some(starred => starred.link === story.link);
    let updatedStarredNews;

    if (isStarred) {
      updatedStarredNews = starredNews.filter(starred => starred.link !== story.link);
    } else {
      updatedStarredNews = [...starredNews, story];
    }

    setStarredNews(updatedStarredNews);
    localStorage.setItem('starredNews', JSON.stringify(updatedStarredNews));
  };

  return (
    <div className="news">
      <h2>News on {preference}</h2>

      <div className="filters">
        <label>
          Choose Category:
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="local">Local</option>
            <option value="indian">Indian</option>
            <option value="international">International</option>
          </select>
        </label>

        <label>
          Choose Language:
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="tamil">Tamil</option>
            <option value="hindi">Hindi</option>
          </select>
        </label>
      </div>

      <button onClick={() => navigate('/starred-news')} className="view-starred-btn">
        View Starred News
      </button>
      
      <div className="news-cards">
        {news.map((story, index) => (
          <div key={index} className="news-card">
            <h1 className="news-title">{story.title || "No title available"}</h1>
            <p className="news-time">
              Published: {story.time ? new Date(story.time).toLocaleString() : "Time not available"}
            </p>
            <a href={story.link} target="_blank" rel="noopener noreferrer">
              <button className="read-more-btn">Read More</button>
            </a>
            <button
              className={`star-btn ${starredNews.some(starred => starred.link === story.link) ? 'starred' : ''}`}
              onClick={() => toggleStar(story)}
            >
              {starredNews.some(starred => starred.link === story.link) ? '★ Starred' : '☆ Star'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;
