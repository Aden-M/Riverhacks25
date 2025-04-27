// Existing setup
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Import API routes
const supportApi = require('./api/support'); // ✅ Import support API from external file

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as template engine
app.set('view engine', 'ejs');

// Set static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources', express.static('resources'));

// Mount API routes
app.use('/api', supportApi); // ✅ Cleaner API integration

// Data for /info page
const infoList = [
  { name: "Golden Gate Bridge", location: "San Francisco" },
  { name: "Empire State Building", location: "New York" },
  { name: "Space Needle", location: "Seattle" },
  { name: "Statue of Liberty", location: "New York" },
  { name: "Willis Tower", location: "Chicago" }
];

// View Routes
app.get('/map', (req, res) => {
  res.render('index');
});

app.get('/info', (req, res) => {
  res.render('info', { items: infoList });
});

app.get('/navigation', (req, res) => {
  res.render('navigation');
});

app.get('/', (req, res) => {
  res.redirect('/navigation');
});

app.get('/events', (req, res) => {
  res.render('events');
});

app.get('/support', (req, res) => {
  res.render('support');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}/map`);
});
