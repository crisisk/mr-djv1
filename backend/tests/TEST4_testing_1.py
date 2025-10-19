const express = require('express');

const app = express();

app.use(express.json());

// Sample routes for testing
app.get('/api/users', (req, res) => {
  res.json({ users: [{ id: 1, name: 'John' }] });
});

app.post('/api/users', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  res.status(201).json({ id: 2, name });
});

app.get('/api/auth', (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  res.json({ authenticated: true });
});

module.exports = app;
