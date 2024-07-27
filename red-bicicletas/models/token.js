const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const tokenSchema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Usuario' },  // reference to usuario schema
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },  // eliminates after that time
});

module.exports = mongoose.model('Token', tokenSchema);
