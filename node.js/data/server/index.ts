import express from 'express';
import { join } from 'path';

const app = express();

// Serve static files from the public directory
app.use(express.static(join(__dirname, '../public')));

const port = 8080; // Using port 8080 instead
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
