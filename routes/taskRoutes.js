const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

router.get('/todo', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const tasks = await Task.find({ user_id: req.session.userId }, {});
    res.render('todo', { tasks });
});

router.post('/todo', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const { title, description, task_type } = req.body;

    const newTask = new Task({
        title,
        description,
        task_type,
        user_id: req.session.userId,
    });

    await newTask.save();
    res.redirect('/todo');
});

router.put('/todo/put/:taskId', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);

    if (task && task.user_id.toString() === req.session.userId.toString()) {
        task.is_done = true;
        await task.save();
    }

    res.redirect('/todo'); // Redirect back to the ToDo list after marking the task as done
});

router.delete('/todo/delete/:taskId', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const taskId = req.params.taskId;
    await Task.findByIdAndDelete(taskId); // Delete the task by ID
    res.redirect('/todo'); // Redirect back to the ToDo list after deletion
});

module.exports = router;
