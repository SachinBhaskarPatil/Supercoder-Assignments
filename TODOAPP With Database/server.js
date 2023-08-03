const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const db = require('./db');
const Task = require('./taskSchema');

app.use(express.static(path.join(__dirname)));
app.use(express.json());

db.init().then(() => {
  console.log('Connected to the database');
}).catch((err) => {
  console.error(err);
});

app.post('/addTask', async (req, res) => {
  const taskText = req.body.taskText;
  if (taskText) {
    try {
      const newTask = new Task({ text: taskText, completed: false });
      await newTask.save();
      res.status(201).json({ message: 'Task added successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Error adding task to the database.' });
    }
  } else {
    res.status(400).json({ error: 'Task text is required.' });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks from the database.' });
  }
});

app.patch('/updateTask/:index', async (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (Number.isNaN(index) || index < 0) {
    return res.status(400).json({ error: 'Invalid task index.' });
  }

  try {
    const tasks = await Task.find();
    if (index >= tasks.length) {
      return res.status(400).json({ error: 'Invalid task index.' });
    }

    tasks[index].completed = req.body.completed;
    await tasks[index].save();
    res.json({ message: 'Task updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating task in the database.' });
  }
});

app.delete('/deleteTask/:index', async (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (Number.isNaN(index) || index < 0) {
    return res.status(400).json({ error: 'Invalid task index.' });
  }

  try {
    const tasks = await Task.find();
    if (index >= tasks.length) {
      return res.status(400).json({ error: 'Invalid task index.' });
    }

    await Task.findByIdAndDelete(tasks[index]._id);
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task from the database.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
