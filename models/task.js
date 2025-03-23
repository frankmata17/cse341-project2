const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  priority: { type: String, default: 'low' },
  // Removed 'assignedTo' field here
}, { timestamps: true });

module.exports = mongoose.model('task', TaskSchema);
