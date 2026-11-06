const express = require('express');
const app = express();
const port = process.env.PORT || 5001;

// http://localhost:5001/welcome should return a status code 200 with a welcome message of your choice in html format

// http://localhost:5001/redirect should redirect the request to '/redirected' by using 302 as the status code / the redirected page should return a redirected message of your choice

// http://localhost:5001/cache should return 'this resource was cached' in html format and set the cache max age to a day

// http://localhost:5001/cookie should return 'cookies… yummm' in plain text and set 'hello=world' as a cookie

// For other routes, such as http://localhost:5001/other, this exercise should return a status code 404 with '404 - page not found' in html format

app.get('/', (req, res) => {
  res.status(200).type('html').send('Express Routing Exercise');
  res.set({ 'Content-Type': 'text/html' });
  res.send('Express Routing Exercise');
});

app.get('/welcome', (req, res) => {
  res.status(200).type('html').send('<h1>Welcome!</h1><p>Howdy!</p>');
});

app.get('/redirect', (req, res) => {
  res.redirect(302, '/redirected');
});

app.get('/redirected', (req, res) => {
  res.status(200).type('html').send('<h1>This is the redirected page!</h1>');
});

app.get('/cache', (req, res) => {
  // 86400 seconds = 1 day
  res.set('Cache-Control', 'public, max-age=86400');
  res.type('html').send('<p>this resource was cached</p>');
});

app.get('/cookie', (req, res) => {
  res.cookie('hello', 'world');
  res.type('text/plain').send('cookies… yummm');
});

// Catch-all: must come after every other route
app.use((req, res) => {
  res.status(404).type('html').send('<h1>404 - page not found</h1>');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
