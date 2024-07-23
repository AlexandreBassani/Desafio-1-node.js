const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Middleware para atualizar `updated_at`
router.use((req, res, next) => {
  req.updatedAt = new Date();
  next();
});

// Criação de uma task
router.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }
  try {
    const task = await Task.create({ title, description });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Listagem de todas as tasks
router.get('/tasks', async (req, res) => {
  const { title, description } = req.query;
  try {
    const where = {};
    if (title) where.title = { [Op.like]: `%${title}%` };
    if (description) where.description = { [Op.like]: `%${description}%` };
    
    const tasks = await Task.findAll({ where });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Atualização de uma task
router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    if (title) task.title = title;
    if (description) task.description = description;
    task.updated_at = req.updatedAt;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remover uma task
router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Marcar uma task como completa
router.patch('/tasks/:id/complete', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    task.completed_at = task.completed_at ? null : new Date();
    task.updated_at = req.updatedAt;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
