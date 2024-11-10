import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const toastStyle = {
  borderRadius: '8px',
  background: '#333',
  color: '#fff',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  textAlign: 'left', 
  lineHeight: '1.5',
  width: 'fit-content',
  padding: '15px 20px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  display: 'inline-block', 
  whiteSpace: 'nowrap', 
  overflow: 'hidden', 
  textOverflow: 'ellipsis', 
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //const [message, setMessage] = useState('');
  const [newsHeadlines, setNewsHeadlines] = useState([]); 
  const [currentNews, setCurrentNews] = useState(0); 
  const navigate = useNavigate();

  // Fetch breaking news headlines from NewsAPI
  useEffect(() => {
    localStorage.removeItem('userId');

    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=0d9944cf00804f04b20589126324102a`
        );
        // Extract headlines from API response
        const headlines = response.data.articles.map((article) => article.title);
        setNewsHeadlines(headlines);
      } catch (error) {
        toast.error('Error fetching news', {
          position: "top-center",
          style: toastStyle,
          closeButton:false,
        });
      }
    };

    fetchNews();
  }, []);

  // Rotate news headlines every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prevNews) => (prevNews + 1) % newsHeadlines.length);
    }, 15000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [newsHeadlines]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', { username, password });
      toast.success('Login Successful', {
        position: "bottom-right",
        style: toastStyle,
        closeButton:false,
        autoClose: 2000,
      });
      localStorage.setItem('userId', res.data.userId); // Save user ID in local storage
      setTimeout(() => {
        navigate('/preferences');
      }, 2000);
    } catch (err) {
      toast.error(err.response ? err.response.data.error : "Login failed. Please try again.", {
        position: "bottom-right",
        style: toastStyle,
        closeButton:false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="login">
      <ToastContainer />
      <div className="marquee-container">
        {newsHeadlines.length > 0 ? (
          <marquee>{newsHeadlines[currentNews]}</marquee>
        ) : (
          <marquee>Loading breaking news...</marquee>
        )}
      </div>
      <h4>NEWS AGGREGATOR</h4>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <Link to='/register'>Register</Link>
        <Link to='admin'>Admin Login</Link>
      </form>
    </div>
  );
}

export default Login;
