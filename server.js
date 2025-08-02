const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;

// Serve static files from the Angular app build output
app.use(express.static(path.join(__dirname, 'dist/angular-orvian-travel/browser')));

// For all GET requests, send back index.html so that PathLocationStrategy can be used
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/angular-orvian-travel/browser/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
