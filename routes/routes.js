const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      password: user.password,
      tasks: user.tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(req.body);

    const newUser = new User({ username, password });
    console.log(newUser);
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error en la creación de usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
    console.log(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/users/:username/tasks", async (req, res) => {
  try {
    const { task } = req.body;
    const name = req.body.username;
    const user = await User.findOne({ username: name });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.tasks.push({ task });

    await user.save();

    res.status(201).json(user.tasks[user.tasks.length - 1]);
  } catch (error) {
    console.error("Error en la ruta:", error);
    res.status(400).json({ message: error.message });
  }
});

router.get("/tasks/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const tasks = user.tasks.map((task) => ({
      task: task.task,
      _id: task._id,
    }));

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/users/:username/tasks/:taskId", async (req, res) => {
  try {
    const { username, taskId } = req.params;
    const user = await User.findOneAndUpdate(
      { username: username },
      { $pull: { tasks: { _id: taskId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
