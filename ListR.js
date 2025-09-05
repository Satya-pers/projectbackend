const express = require('express');
const ListS = require('./ListS');
const router = express.Router();
function getISTTimeString() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const istTime = new Date(utc + 5.5 * 60 * 60 * 1000); 

    const day = String(istTime.getDate()).padStart(2, "0");
    const month = String(istTime.getMonth() + 1).padStart(2, "0");
    const year = istTime.getFullYear();

    const hours = String(istTime.getHours()).padStart(2, "0");
    const minutes = String(istTime.getMinutes()).padStart(2, "0");
    const seconds = String(istTime.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}


router.get("/", async (req, res) => {
  try {
    const tasks = await ListS.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/create-task', async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      createdAt: getISTTimeString(),
      userEmail: req.body.userEmail 
    };

    await ListS.create(taskData);

    
    const tasks = await ListS.find({ userEmail: req.body.userEmail });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/user/:userEmail', async (req, res) => {
  try {
    const tasks = await ListS.find({ userEmail: req.params.userEmail });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/update-task/:id', async (req, res) => {
  try {
    const task = await ListS.findById(req.params.id);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/update-task/:id', async (req, res) => {
  try {
    const task = await ListS.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (req.body.userEmail && task.userEmail !== req.body.userEmail) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedTask = await ListS.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/delete-task/:id', async (req, res) => {
  try {
    const task = await ListS.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (req.body.userEmail && task.userEmail !== req.body.userEmail) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await ListS.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;


