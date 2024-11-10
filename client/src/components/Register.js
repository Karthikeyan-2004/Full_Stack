import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

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



function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/register', { username, email, password });
      toast.success(res.data.message, {
        position: "top-right",
        style: toastStyle,
        closeButton: false,
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response ? err.response.data.error : "Registration failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        style: toastStyle,
        closeButton: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        <Link to='/'>Login</Link>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Register;
