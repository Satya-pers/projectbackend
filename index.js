const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require('node-cron');
const bcrypt = require("bcrypt");
const User = require("./User"); 
const ListS = require("./ListS");
const dotenv=require("dotenv")

dotenv.config();
const mongoURI = process.env.MONGO_URI;


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
const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.set("strictQuery", true);

mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

const port = 5000;


cron.schedule('* * * * *', async () => {
  const now = new Date();
  const upcomingTasks = await ListS.find({
    dateTime: { $lte: now },
    notified: false
  });

  upcomingTasks.forEach(async (task) => {
    console.log(`Reminder: ${task.task} for ${task.userEmail}`);
    task.notified = true;
    await task.save();
  });
});


app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) return res.json("exist");

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email: email.toLowerCase(), password: hashedPassword,createdAt: getISTTimeString() });

        res.json("not exist"); 
    } catch (err) {
        console.error(err);
        res.json("error");
    }
});



app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) return res.json("not exist");

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.json("exist");
        } else {
            res.json("not exist");
        }
    } catch (err) {
        console.error(err);
        res.json("error");
    }
});



const ListR = require("./ListR");
app.use("/tasks", ListR);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
