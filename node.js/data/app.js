// Existing setup
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Set EJS as template engine
app.set('view engine', 'ejs');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/map', (req, res) => {
  res.render('index');
});


const infoList = [
    { name: "Golden Gate Bridge", location: "San Francisco" },
    { name: "Empire State Building", location: "New York" },
    { name: "Space Needle", location: "Seattle" },
    { name: "Statue of Liberty", location: "New York" },
    { name: "Willis Tower", location: "Chicago" }
  ];
  
app.get('/info', (req, res) => {
  res.render('info', { items: infoList });
});

app.get('/navigation', (req, res) => {
    res.render('navigation');
  });
  
app.get('/', (req, res) => {
  res.redirect('/navigation');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}/map`);
});
