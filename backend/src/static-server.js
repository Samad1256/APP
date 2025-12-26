const express = require('express');
const path = require('path');

const app = express();
const port = 5001;

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Start server
app.listen(port, () => {
  console.log(`Static server running on http://localhost:${port}`);
});
