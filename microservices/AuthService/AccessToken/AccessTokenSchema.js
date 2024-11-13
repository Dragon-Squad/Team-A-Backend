const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accessTokenSchema = new Schema({
    accessToken: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '1d' }
});

module.exports = mongoose.model('AccessToken', accessTokenSchema);