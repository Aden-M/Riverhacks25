const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/map', (req, res) => {
    res.render('index');
});

// Optional: Redirect root to /map
app.get('/', (req, res) => {
    res.redirect('/map');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/map`);
});
