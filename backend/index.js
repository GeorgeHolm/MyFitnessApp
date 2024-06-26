const express = require('express');

require('dotenv').config()

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json());
const cors = require('cors')
app.use(cors())

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
    res.send('Welcome to my app!')
  })


  app.get('/profiles', async (req, res) => {
    const profiles = await prisma.profile.findMany()
    res.json(profiles)
  })

  app.get('/workouts', async (req, res) => {
    const workouts = await prisma.workout.findMany()
    res.json(workouts)
  })

  app.get('/meals', async (req, res) => {
    const meals = await prisma.meal.findMany()
    res.json(meals)
  })


  app.post('/profiles/:id/workouts', async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body
    const newWorkout = await prisma.workout.create({
      data: {
        notes,
        profileId: parseInt(id)
      }
    })
    res.json(newWorkout)
  })

  app.post('/profiles/:id/meals', async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body
    const newMeal = await prisma.meal.create({
      data: {
        notes,
        profileId: parseInt(id)
      }
    })
    res.json(newMeal)
  })

  app.post('/profiles', async (req, res) => {
    const { email, uid } = req.body
    const profile = await prisma.profile.create({
      data: {
        email,
        uid
      }
    })
    res.json(profile)
  })

