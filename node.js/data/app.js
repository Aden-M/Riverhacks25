// Existing setup
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Set EJS as template engine
app.set('view engine', 'ejs');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources', express.static('resources'));


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

app.get('/events', (req, res) => {
  res.render('events');
});

app.get('/support', (req, res) => {
  res.render('support');
});

app.use(express.json()); // Important! Needed for req.body to work

app.post('/api/support', (req, res) => {
  const userMessage = req.body.message;

  console.log('Received:', userMessage); // <- useful for debugging

  const botReply = `You said: "${userMessage}" — Support will contact you soon.`;

  res.json({ reply: botReply });
});



// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}/map`);
});


