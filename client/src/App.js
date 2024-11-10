import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Preferences from './components/Preferences';
import News from './components/News';
import StarredNews from './components/StarredNews';
import Forum from './components/Forum';
import YouTubeLiveNews from './components/YouTubeLiveNews';
import AdminPanel from './AdminPanel';
import './App.css';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/news" element={<News />} />
          <Route path="/starred-news" element={<StarredNews />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/live-news" element={<YouTubeLiveNews />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
