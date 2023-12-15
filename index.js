const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

require("dotenv").config();

const users = [];

const exercises = [];

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const { username } = req.body;
  const userId = Math.floor(Math.random() * 900) + 100;
  const user = { _id: userId, username };

  users.push(user);
  res.status(201).json(user);
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const id = req.params._id;
  const { description, duration, date } = req.body;
  const calculatedDate = date ? date : new Date();
  const exercise = {
    _id: id,
    description,
    duration,
    date: calculatedDate.toDateString(),
  };

  exercises.push(exercise);
  res.status(201).send(JSON.stringify(exercise));
});

app.get("/api/users/:_id/exercises", (req, res) => {
  const { _id } = req.params;
  const user = users.find((user) => user._id.toString() === _id);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  const userExercises = exercises.filter((exercise) => exercise._id === _id);
  const responseData = {
    ...user,
    ...userExercises[0],
  };

  res.json(responseData);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
