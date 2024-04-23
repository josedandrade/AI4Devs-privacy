const mongoose = require('mongoose');

const piiTokenSchema = new mongoose.Schema({
  pii: String,
  token: String,
  dataType: String
});

const PiiToken = mongoose.model('PiiToken', piiTokenSchema);

module.exports = PiiToken;
