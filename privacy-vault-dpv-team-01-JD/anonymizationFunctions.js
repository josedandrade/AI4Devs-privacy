// Import necessary modules
const crypto = require('crypto');
const PiiToken = require('./models/piiToken');

// Function to anonymize text
function anonymizeText(message) {
  const piiPatterns = {
    name: /\b[A-Z][a-z]+(?: [A-Z][a-z]+)?\b/g,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,6}\b/g,
    phone: /\b\d{3}-\d{3}-\d{4}\b/g,
    date: /\b\d{2}\/\d{2}\/\d{4}\b/g,
    dni: /\b\d{8}[A-Z]\b/g
  };

  Object.keys(piiPatterns).forEach(type => {
    message = message.replace(piiPatterns[type], match => {
      const token = crypto.randomBytes(8).toString('hex');
      const piiToken = new PiiToken({ pii: match, token: token, dataType: type });
      piiToken.save();
      return token;
    });
  });

  return message;
}

// Function to deanonymize text
async function deanonymizeText(message) {
  const tokenPattern = /\b[0-9a-f]{16}\b/g;
  const tokens = message.match(tokenPattern);

  for (let token of tokens) {
    const piiToken = await PiiToken.findOne({ token: token });
    if (piiToken) {
      message = message.replace(token, piiToken.pii);
    }
  }

  return message;
}

// Export the functions for use in the server
module.exports = {
  anonymizeText,
  deanonymizeText
};
