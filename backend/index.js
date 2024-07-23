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
      profileLikes: true,
      profileTouch: true,
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  });
  return res.json(workouts);
});

app.get("/profiles/:uid/meals", async (req, res) => {
  const { uid } = req.params;

  const profile = await prisma.profile.findMany({ where: { uid: uid } });
  if (!profile[0]) {
    return res.status(404).send({ error: "Profile not found" });
  }
  const meals = await prisma.meal.findMany({
    where: { profileId: profile[0].id },
    include: {
      profileLikes: true,
      profileTouch: true,
      foods: true,
    },
  });
  return res.json(meals);
});

app.get("/profiles/:uid", async (req, res) => {
  const { uid } = req.params;

  const profile = await prisma.profile.findMany({
    where: { uid: uid },
    include: {
      likedWorkouts: true,
      touchWorkouts: true,
      likedMeals: true,
      touchMeals: true,
      workouts: {
        include: {
          profileLikes: true,
          profileTouch: true,
          exercises: {
            include: {
              sets: true,
            },
          },
        },
      },
      meals: true,
    },
  });
  if (!profile[0]) {
    return res.status(404).send({ error: "Profile not found" });
  }
  return res.json(profile);
});

app.get("/profiles", async (req, res) => {
  const profiles = await prisma.profile.findMany({
    include: {
      likedWorkouts: true,
      touchWorkouts: true,
      likedMeals: true,
      touchMeals: true,
    },
  });
  res.json(profiles);
});

app.get("/workouts", async (req, res) => {
  const workouts = await prisma.workout.findMany({
    include: {
      profileLikes: true,
      profileTouch: true,
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  });
  res.json(workouts);
});

app.get("/meals", async (req, res) => {
  const meals = await prisma.meal.findMany({
    include: {
      foods: true,
      profileLikes: true,
      profileTouch: true,
    },
  });
  res.json(meals);
});

app.post("/touchworkout", async (req, res) => {
  try {
    const { id, wid } = req.body;
    const alreadyExists = await prisma.profileWorkoutTouched.findMany({
      where: {
        workoutId: Number(wid),
        profileId: Number(id),
      },
    });

    if (!alreadyExists[0]) {
      const newTouch = await prisma.profileWorkoutTouched.create({
        data: {
          workoutId: Number(wid),
          profileId: Number(id),
        },
      });
      res.json(newTouch);
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
});

app.post("/touchmeal", async (req, res) => {
  try {
    const { id, mid } = req.body;

    const alreadyExists = await prisma.profileMealTouched.findMany({
      where: {
        mealId: Number(mid),
        profileId: Number(id),
      },
    });

    if (!alreadyExists[0]) {
      const newTouch = await prisma.profileMealTouched.create({
        data: {
          mealId: Number(mid),
          profileId: Number(id),
        },
      });
      res.json(newTouch);
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
});

app.post("/likeworkout", async (req, res) => {
  try {
    const { id, wid } = req.body;

    const alreadyExists = await prisma.profileWorkoutLikes.findMany({
      where: {
        workoutId: Number(wid),
        profileId: Number(id),
      },
    });

    if (!alreadyExists[0]) {
      const newTouch = await prisma.profileWorkoutLikes.create({
        data: {
          workoutId: Number(wid),
          profileId: Number(id),
        },
      });
      res.json(newTouch);
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
});

app.post("/likemeal", async (req, res) => {
  try {
    const { id, mid } = req.body;

    const alreadyExists = await prisma.profileMealLikes.findMany({
      where: {
        mealId: Number(mid),
        profileId: Number(id),
      },
    });

    if (!alreadyExists[0]) {
      const newTouch = await prisma.profileMealLikes.create({
        data: {
          mealId: Number(mid),
          profileId: Number(id),
        },
      });
      res.json(newTouch);
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
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
    console.log("Error:", error.message);
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

app.post("/meals/:id/foods", async (req, res) => {
  const { id } = req.params;
  const { name, calories, carbs, fats, proteins, grams } = req.body;
  const newFood = await prisma.food.create({
    data: {
      name,
      calories,
      carbs,
      fats,
      proteins,
      grams,
      mealId: Number(id),
    },
  });
  res.json(newFood);
});

app.post("/profiles/:id/meals", async (req, res) => {
  const { id } = req.params;
  const {
    notes,
    totalCalories,
    totalCarbs,
    totalFats,
    totalProteins,
    totalGrams,
  } = req.body;
  const newMeal = await prisma.meal.create({
    data: {
      notes,
      totalCalories,
      totalCarbs,
      totalFats,
      totalProteins,
      totalGrams,
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

app.delete("/workouts/:id", async (req, res) => {
  const { id } = req.params;
  const deletedWorkout = await prisma.workout.deleteMany({
    where: { id: parseInt(id) },
  });
  res.json(deletedWorkout);
});

app.delete("/meals/:id", async (req, res) => {
  const { id } = req.params;
  const deletedMeal = await prisma.meal.deleteMany({
    where: { id: parseInt(id) },
  });
  res.json(deletedMeal);
});

app.delete("/likemeal", async (req, res) => {
  const { id, mid } = req.body;
  const deletedLike = await prisma.profileMealLikes.deleteMany({
    where: { profileId: Number(id), mealId: Number(mid) },
  });
  res.json(deletedLike);
});
app.delete("/likeworkout", async (req, res) => {
  const { id, wid } = req.body;
  const deletedLike = await prisma.profileWorkoutLikes.deleteMany({
    where: { profileId: Number(id), workoutId: Number(wid) },
  });
  res.json(deletedLike);
});

app.put("/profiles/:id", async (req, res) => {
  const { id } = req.params;
  const { email, uid, name, age, sex, bio } = req.body;
  const updatedProfile = await prisma.profile.updateMany({
    where: { id: parseInt(id) },
    data: {
      email,
      uid,
      name,
      age,
      sex,
      bio,
    },
  });
  res.json(updatedProfile);
});

app.put("/workouts/:id", async (req, res) => {
  const { id } = req.params;
  const { workout } = req.body;

  await prisma.exercise.deleteMany({
    where: {
      workoutId: Number(id),
    },
  });

  const updatedWorkout = await prisma.workout.update({
    where: { id: parseInt(id) },
    data: {
      exercises: {
        create: workout.map((exercise) => ({
          name: exercise.name,
          sets: {
            create: exercise.sets.map((set) => ({
              weight: Number(set.weight),
              reps: Number(set.reps),
            })),
          },
        })),
      },
      notes: "",
    },
  });
  res.json(updatedWorkout);
});
