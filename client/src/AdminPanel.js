import React, { useState } from 'react';
import './AdminPanel.css';
const AdminPanel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle login
  const handleLogin = async () => {
    if (username === '' || password === '') {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/admin/view-users-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setPosts(data.posts);
        setIsLoggedIn(true);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while logging in. Please try again later.');
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/admin/delete-post/${postId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the deleted post from the UI
          setPosts(posts.filter((post) => post._id !== postId));
          alert('Post deleted successfully');
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Error deleting post');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the post.');
      }
    }
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        <div>
          <h1>Admin Panel</h1>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <button onClick={handleLogin}>Login</button>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      ) : (
        <div>
          <h2>Users and Posts</h2>

          <h3>Users:</h3>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user.username} ({user.email})
              </li>
            ))}
          </ul>

          <h3>Posts:</h3>
          {posts.map((post) => (
            <div key={post._id} className="post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>
                Posted by: {post.name} on {new Date(post.createdAt).toLocaleString()}
              </small>
              <br />
              <button onClick={() => handleDeletePost(post._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
