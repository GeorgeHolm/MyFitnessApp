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
                name: "General Exercise",
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
                    weight: set.weight,
                    reps: set.reps,
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



  return (
    <div className="overlay">
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
    </div>
  );
}

export default Modal;
