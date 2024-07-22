import React from "react";
import "./Modal.css";
import { useState, useEffect } from "react";
import Exercise from "./Exercise";
import ExerciseInformation from "../../../webscraping/exercises.json";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
export function Modal(props) {
  const [workout, setWorkout] = useState([]);
  const [exerciseInfo, setExerciseInfo] = useState([]);

  const [notes, setNotes] = useState("");

  const handleNotes = (e) => {
    setNotes(e.target.value);
  };
  const addExercise = () => {
    setWorkout((prevState) => [...prevState, { name: "", sets: [] }]);
  };

  useEffect(() => {
    setExerciseInfo(ExerciseInformation);
  }, [workout]);

  const confirmWorkout = () => {
    //post the workout to the users workouts array

    //I would rather make an API call that takes in the input

    const makeAsync = async () => {
      //may need loading here, this is the wildest async function of all time O(n^2) complexity
      let wid = 0;
      const workoutCreation = await fetch(
        `${import.meta.env.VITE_BACKEND_LINK}/profiles/${
          props.user.id
        }/workouts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notes: notes,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          wid = data.id;
        })

      Promise.all([workoutCreation]);

      workout.map((exercise) => {
        const asyncExercises = async () => {
          //may need loading here

          let eid = 0;

          const exerciseCreation = await fetch(
            `${import.meta.env.VITE_BACKEND_LINK}/workouts/${wid}/exercises`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: exercise.name,
              }),
            }
          )
            .then((response) => response.json())
            .then((data) => {
              eid = data.id;
            })

          Promise.all([exerciseCreation]);

          exercise.sets.map((set) => {
            const asyncSets = async () => {
              //may need loading here
              const setCreation = await fetch(
                `${import.meta.env.VITE_BACKEND_LINK}/exercises/${eid}/sets`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    weight: Number(set.weight),
                    reps: Number(set.reps),
                  }),
                }
              )
                .then((response) => response.json());
              Promise.all([setCreation]);
            };
            asyncSets();
          });
        };

        asyncExercises();
      });
    };
    makeAsync();
    setWorkout([]);
  };

  const deleteExercise = (index) => {
    const updatedWorkout = workout.filter((exercise, idx) => {
      return idx != index;
    });
    setWorkout(updatedWorkout);
  };

  //Code for creating meal

  const [mealSearch, setMealSearch] = useState("");
  const [mealSearchResults, setMealSearchResults] = useState([]);
  const [foodChoice, setFoodChoice] = useState({});
  const [meal, setMeal] = useState([]);

  const handleMealSearch = (e) => {
    setMealSearch(e.target.value);
  };

  const searchForFood = () => {
    fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${
        import.meta.env.VITE_FOOD_API_KEY
      }&query=${mealSearch}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse JSON data from the response
      })
      .then((data) => {
        // Handle successful response
        const limitedFoods = data.foods.filter(
          (food, idx, self) =>
            self.findIndex((i) => i.description === food.description) === idx
        );

        let dummy = data;
        dummy.foods = limitedFoods;

        setMealSearchResults(dummy);
      });
  };

  const confirmMeal = () => {
    const makeAsyncMeal = async () => {
      let carbs = 0;
      let fats = 0;
      let proteins = 0;
      let weight = 0;
      let mid = 0;

      meal.map((foodItem) => {
        let tempTotal = 100;
        let carbRatio =
          Number(foodItem.foodData.foodNutrients[2].value) / tempTotal;
        let fatRatio =
          Number(foodItem.foodData.foodNutrients[1].value) / tempTotal;
        let proteinRatio =
          Number(foodItem.foodData.foodNutrients[0].value) / tempTotal;
        carbs = carbs + Number(carbRatio) * foodItem.weight;
        fats = fats + Number(fatRatio) * foodItem.weight;
        proteins = Number(proteins) + proteinRatio * foodItem.weight;
        weight = weight + Number(foodItem.weight);
      });

      //may need loading here, this is the wildest async function of all time O(n^2) complexity
      const mealCreation = await fetch(
        `${import.meta.env.VITE_BACKEND_LINK}/profiles/${props.user.id}/meals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notes: notes,
            totalCalories: 4 * carbs + 4 * proteins + 9 * fats,
            totalCarbs: carbs,
            totalFats: fats,
            totalProteins: proteins,
            totalGrams: weight,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          mid = data.id;
        });
      {
        meal.map((foodItem) => {
          async function addFoodAsync() {
            let tempTotal = 100;
            let carbRatio =
              Number(foodItem.foodData.foodNutrients[2].value) / tempTotal;
            let fatRatio =
              Number(foodItem.foodData.foodNutrients[1].value) / tempTotal;
            let proteinRatio =
              Number(foodItem.foodData.foodNutrients[0].value) / tempTotal;

            const foodAddition = await fetch(
              `${import.meta.env.VITE_BACKEND_LINK}/meals/${mid}/foods`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: foodItem.foodData.description,
                  calories:
                    4 * carbRatio * Number(foodItem.weight) +
                    4 * proteinRatio * Number(foodItem.weight) +
                    9 * fatRatio * Number(foodItem.weight),
                  carbs: carbRatio * Number(foodItem.weight),
                  fats: fatRatio * Number(foodItem.weight),
                  proteins: proteinRatio * Number(foodItem.weight),
                  grams: Number(foodItem.weight),
                }),
              }
            )
              .then((response) => response.json())
          }
          addFoodAsync();
        });
      }
    };

    makeAsyncMeal();

    setMeal([]);
  };

  const foodSelected = (f) => {
    let dummy = f.food;
    dummy.description = dummy.description.toLowerCase();
    setFoodChoice(dummy);
    setMealSearchResults([]);
  };

  useEffect(() => {
    if (foodChoice.description) {
      setMeal((prevState) => [
        ...prevState,
        { foodData: foodChoice, weight: 0 },
      ]);
    }
  }, [foodChoice]);

  return (
    <div className="overlay">
      {props.type ? (
        <div className="modal">
          <section id="top">
            <h1>New Workout</h1>
            <button onClick={confirmWorkout} className="finish">
              Finish
            </button>
          </section>
          <section>
            <InputGroup className="eighty-width">
              <InputGroup.Text>Workout Notes:</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Write notes about your workout"
                onChange={handleNotes}
                value={notes}
                as="textarea"
                aria-label="With textarea"
              />
            </InputGroup>
            {workout.map((exercise, idx) => (
              <Exercise
                deleteExercise={deleteExercise}
                exerciseInfo={exerciseInfo}
                workout={workout}
                setWorkout={setWorkout}
                index={idx}
                key={idx}
                data={exercise}
              />
            ))}
            <button onClick={addExercise}>Add Exercise</button>
          </section>
        </div>
      ) : (
        <div className="modal">
          <section id="top">
            <h1>New Meal</h1>
            <button onClick={confirmMeal} className="finish">
              Finish
            </button>
          </section>
          <section>
            <InputGroup className="eighty-width">
              <InputGroup.Text>Meal Notes:</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Write notes about your meal"
                onChange={handleNotes}
                value={notes}
                as="textarea"
                aria-label="With textarea"
              />
            </InputGroup>
            <input
              type="text"
              placeholder="find food item"
              onChange={handleMealSearch}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchForFood();
                }
              }}
              value={mealSearch}
            />

            {mealSearchResults.foods
              ?.filter((food, idx) => idx < 5)
              .map((food, idx) => (
                <p
                  key={idx}
                  onClick={() => {
                    foodSelected({ food });
                  }}
                >
                  {food.description.toLowerCase()}
                </p>
              ))}

            <section id="mealContainer">
              {meal.map((foodItem, idx) => (
                <div key={idx}>
                  <span>{foodItem.foodData.description}</span>
                  <span>
                    <button
                      onClick={() => {
                        setMeal([
                          ...meal.slice(0, idx),
                          ...meal.slice(idx + 1),
                        ]);
                      }}
                    >
                      Delete
                    </button>
                  </span>
                  <span>
                    {foodItem.foodData.foodMeasures.length > 0 ? (
                      <select
                        onChange={(e) => {
                          let tempMeal = [...meal];
                          tempMeal[idx].weight = e.target.value;
                          setMeal(tempMeal);
                        }}
                      >
                        <option key={-1} value={0}>
                          none: 0g
                        </option>
                        {foodItem.foodData.foodMeasures.map((measure, mIdx) => (
                          <option key={mIdx} value={measure.gramWeight}>
                            {measure.disseminationText}: {measure.gramWeight} g
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="enter weight (g)"
                        className="chooseWeight"
                        onChange={(e) => {
                          let tempMeal = [...meal];
                          if (Number(e.target.value)) {
                            tempMeal[idx].weight = e.target.value;
                          }
                          //may need if statement
                          setMeal(tempMeal);
                        }}
                        value={foodItem.weight}
                      />
                    )}
                  </span>
                </div>
              ))}
            </section>
          </section>
        </div>
      )}
    </div>
  );
}

export default Modal;
