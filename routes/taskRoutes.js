const express = require('express');
const Task = require('../models/Task');
const mongoose = require("mongoose");
const router = express.Router();

mongoose.connect('mongodb+srv://skalap2endra:kGOM7z5V54vBFdp1@cluster0.vannl.mongodb.net/lab1_7?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Task: Connected to MongoDB Atlas'))
    .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

router.get('/todo', async (req, res) => {
    if (req.session.userId === undefined) {
        return res.redirect('/login');
    }

    const tasks = await Task.find({ user_id: parseInt(req.session.userId, 10) });
    res.render('todo', { tasks });
});

router.post('/todo', async (req, res) => {
    if (req.session.userId === undefined) {
        return res.redirect('/login');
    }

    const title = req.body.title;
    const description = req.body.description;

    const newTask = new Task({
        user_id: parseInt(req.session.userId, 10),
        title: title,
        description: description,
        is_done: false
    });

    await newTask.save();
    res.redirect('/todo');
});

router.put('/todo/put/:id', async (req, res) => {
    if (req.session.userId === undefined) {
        return res.redirect('/login');
    }

    const taskId = req.params.id;
    const { title, description, is_done } = req.body;

    try {
        const task = await Task.findOne({ _id: taskId });

        if (!task || task.user_id.toString() !== req.session.userId.toString()) {
            return res.status(403).send('Unauthorized to update this task');
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.is_done = is_done !== undefined ? is_done : task.is_done;
        task.updated_at = Date.now();

        await task.save();
        res.redirect('/todo');
    } catch (err) {
        console.error('Error updating task:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/todo/delete/:taskId', async (req, res) => {
    if (req.session.userId === undefined) {
        return res.redirect('/login');
    }

    const taskId = req.params.taskId;
    const response = await Task.findOneAndDelete({ _id: taskId});
    response.redirect('/todo');
});

router.get('/getTasks', async (req, res) => {
    if (req.session.userId === undefined) {
        return res.redirect('/login');
    }

    const tasks = await Task.find();
    res.send(JSON.stringify({tasks: tasks}));
});

module.exports = router;