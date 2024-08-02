const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'CollabUser', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  experience: { type: String, required: true },
  isPaid: { type: Boolean, required: true },
  charge: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
