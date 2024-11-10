const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/fullstack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', PostSchema);

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin1pass';

// Admin Authentication Middleware
const adminAuth = (req, res, next) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized access' });
  }
};

// Admin Route to view all users and their posts
app.post('/admin/view-users-posts', async (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin1pass') {
    try {
      const users = await User.find();
      const posts = await Post.find().sort({ createdAt: -1 });
      res.json({ users, posts });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users or posts' });
    }
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

app.delete('/admin/delete-post/:id', async (req, res) => {
  const { id } = req.params;

  // Only allow deletion if the admin is logged in
  // You can implement additional security measures for authentication
  try {
    const post = await Post.findByIdAndDelete(id);
    if (post) {
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
});


// Registration Route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Username or email already exists" });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.json({ message: "Login successful", userId: user._id });
  } else {
    res.status(400).json({ error: "Invalid username or password" });
  }
});

// Route to fetch news based on topic
app.get('/news', async (req, res) => {
  const { topic, category, language } = req.query;
  const searchUrl = `https://news.google.com/search?q=${topic}+${category}+${language}`;

  try {
    const response = await axios.get(searchUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const stories = [];

    $('article').each((_, el) => {
      const title = $(el).text();
      let link = $(el).find('a').attr('href');
      const source = $(el).find('.wEwyrc').text().trim();
      const time = $(el).find('time').attr('datetime');

      if (link && link.startsWith('./')) {
        link = `https://news.google.com${link.slice(1)}`;
      }

      stories.push({
        title: title || "No title available",
        link: link || "No link available",
        source: source || "Unknown source",
        time: time || "Unknown time"
      });
    });

    res.json(stories);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
});
//let posts = []; // In-memory storage for blog posts

// Endpoint to get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Sort by latest posts
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Endpoint to create a new post
app.post('/posts', async (req, res) => {
  const { name, title, content } = req.body;
  if (!title || !content || !name) {
    return res.status(400).json({ error: 'Name, title, and content are required' });
  }

  try {
    const newPost = new Post({ name, title, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});





// Endpoint to get all posts

// app.delete('/posts/:index', (req, res) => {
//   const index = parseInt(req.params.index, 10);
//   if (isNaN(index) || index < 0 || index >= posts.length) {
//     return res.status(404).json({ error: 'Post not found' });
//   }
//   const deletedPost = posts.splice(index, 1);
//   res.status(200).json(deletedPost[0]);
// });

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
