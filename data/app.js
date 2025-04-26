const express = require('express');
const app = express();
const PORT = process.env.Port || 3000;


app.get('/', (req, res) => {
  res.send("Hello World")
})


app.get('/people', (req, res) => {


})



app.listen(PORT, () => console.log(`App running on port: ${PORT}`))