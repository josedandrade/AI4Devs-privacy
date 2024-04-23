// Importing necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const { anonymizeText, deanonymizeText } = require('./anonymizationFunctions');

// Initialize the Express application
const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Use body-parser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/privacyVault', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the /anonymize endpoint
app.post('/anonymize', async (req, res) => {
  try {
    const anonymizedMessage = anonymizeText(req.body.message);
    res.json({ anonymizedMessage });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred during the anonymization process.' });
  }
});

// Define the /deanonymize endpoint
app.post('/deanonymize', async (req, res) => {
  try {
    const deanonymizedMessage = await deanonymizeText(req.body.message);
    res.json({ deanonymizedMessage });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred during the deanonymization process.' });
  }
});

// Add this to handle any other routes not defined previously
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Server listening
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
