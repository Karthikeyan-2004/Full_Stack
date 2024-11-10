import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Forum.css';

function Forum() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/posts');
        setPosts(response.data);
      } catch (error) {
        console.log('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !content || !name) {
      setError('Both title, name, and content are required.');
      return;
    }

    try {
      const newPost = { name, title, content };
      const response = await axios.post('http://localhost:5000/posts', newPost);
      setPosts((prevPosts) => [response.data, ...prevPosts]); // Update state to show new post
      setName('');
      setTitle('');
      setContent('');
    } catch (error) {
      console.log('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="forum">
      <h2>Discussion Forum</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your post here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Create Post</button>
      </form>

      <h3>Blog Posts</h3>
      <div className="posts">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={post._id || index} className="post">
              <h3>Publisher: {post.name}</h3>
              <h3>Title: {post.title}</h3>
              <h3>Description: {post.content}</h3>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default Forum;
