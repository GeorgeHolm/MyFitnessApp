const express = require("express");

require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
const cors = require("cors");
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.get("/profiles/:uid/workouts", async (req, res) => {
  const { uid } = req.params;

  const profile = await prisma.profile.findMany({ where: { uid: uid } });
  if (!profile[0]) {
    return res.status(404).send({ error: "Profile not found" });
  }
  const workouts = await prisma.workout.findMany({
    where: { profileId: profile[0].id },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  });
  return res.json(workouts);
});

app.get("/profiles/:uid", async (req, res) => {
  const { uid } = req.params;

  const profile = await prisma.profile.findMany({ where: { uid: uid } });
  if (!profile[0]) {
    return res.status(404).send({ error: "Profile not found" });
  }
  return res.json(profile);
});

app.get("/profiles", async (req, res) => {
  const profiles = await prisma.profile.findMany();
  res.json(profiles);
});

app.get("/workouts", async (req, res) => {
  const workouts = await prisma.workout.findMany();
  res.json(workouts);
});

app.get("/meals", async (req, res) => {
  const meals = await prisma.meal.findMany();
  res.json(meals);
});

app.post("/exercises/:id/sets", async (req, res) => {

  try {

    const { id } = req.params;
    const { weight, reps } = req.body;
    const newSet = await prisma.set.create({
      data: {
        weight,
        reps,
        exerciseId: Number(id),
      },
    });
    res.json(newSet);
  } catch (error) {
    console.log('Error:', error.message);
  }

});

app.post("/workouts/:id/exercises", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const newExercise = await prisma.exercise.create({
    data: {
      name,
      workoutId: Number(id),
    },
  });
  res.json(newExercise);
});

app.post("/profiles/:id/workouts", async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const newWorkout = await prisma.workout.create({
    data: {
      notes,
      profileId: Number(id),
    },
  });
  res.json(newWorkout);
});

app.post("/profiles/:id/meals", async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const newMeal = await prisma.meal.create({
    data: {
      notes,
      profileId: Number(id),
    },
  });
  res.json(newMeal);
});

app.post("/profiles", async (req, res) => {
  const { email, uid } = req.body;
  const profile = await prisma.profile.create({
    data: {
      email,
      uid,
    },
  });
  res.json(profile);
});
