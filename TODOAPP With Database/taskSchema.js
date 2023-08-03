const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

module.exports = mongoose.model('Task', taskSchema);
