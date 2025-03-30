const Task = require('../models/task');

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  try {
    console.log('Creating Task with data:', req.body);

    // Validate required fields
    if (!title || !description || !dueDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create and save the task
    const task = new Task({ title, description, dueDate, priority });
    await task.save();
    console.log('Task created:', task);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    console.log('Fetching all tasks...');

    // Retrieve tasks from the database
    const tasks = await Task.find();
    
    // Log the tasks to see what is being retrieved
    console.log('Fetched tasks:', tasks);

    // If no tasks are found, return a 404 error
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found' });
    }

    // Send tasks as response
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const { title, description, dueDate, status, priority } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, status, priority },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Error updating task' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting task' });
  }
};
