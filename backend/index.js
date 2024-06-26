const express = require('express');

require('dotenv').config()

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json());

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