import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Modal.css";
import { useState, useEffect } from "react";
import Exercise from "./Exercise";
export function Modal(props) {
  const [workout, setWorkout] = useState([]);

  const addExercise = () => {
    setWorkout((prevState) => [...prevState, { name: "", sets: [] }]);
  };

  useEffect(() => {
    console.log(workout);
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
            notes: "Generic Notes",
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          wid = data.id;
          console.log(data);
        })
        .catch((error) => console.error(error));

      Promise.all([workoutCreation])
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      workout.map((exercise) => {
        console.log(wid);
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
              console.log(data);
            })
            .catch((error) => console.error(error));

          Promise.all([exerciseCreation])
            .then((res) => {
              console.log(res);
            })
            .catch((error) => {
              console.log(error);
            });

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
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error(error));

              Promise.all([setCreation])
                .then((res) => {
                  console.log(res);
                })
                .catch((error) => {
                  console.log(error);
                });
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

  //Code for creating meal

  const [mealSearch, setMealSearch] = useState("");
  const [mealSearchResults, setMealSearchResults] = useState([]);
  const [foodChoice, setFoodChoice] = useState({});
  const [meal, setMeal] = useState([]);

  const handleMealSearch = (e) => {
    setMealSearch(e.target.value);
  };

  const searchForFood = () => {
    console.log(mealSearch);

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
        setMealSearchResults(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching boards:", error);
      });
  };

  const confirmMeal = () => {
    console.log("Meal created");
  };

  const foodSelected = (f) => {
    setFoodChoice(f.food);
    setMealSearchResults([]);
  };

  useEffect(() => {
    console.log(foodChoice);
    console.log(meal);
    if (foodChoice.description) {
      setMeal((prevState) => [...prevState, foodChoice]);
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
            {workout.map((exercise, idx) => (
              <Exercise
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

            {mealSearchResults.foods?.map((food, idx) => (
              <p
                key={idx}
                onClick={() => {
                  foodSelected({ food });
                }}
              >
                {food.description}
              </p>
            ))}

            <section id="mealContainer">
              {meal.map((foodItem, idx) => (
                <p onClick={() => {
                  setMeal([...meal.slice(0, idx), ...meal.slice(idx + 1)]);
                }} key={idx}>{foodItem.description}</p>
              ))}
            </section>
          </section>
        </div>
      )}
    </div>
  );
}

export default Modal;
