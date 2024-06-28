import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Modal.css";
import { useState, useEffect } from "react";
import Exercise from "./Exercise";
export function Modal(props) {


  const [workout, setWorkout] = useState([]);

  const addExercise = () => {
    setWorkout((prevState) => [...prevState, {name: "", sets : []}])
  }

  return (
    <div className="overlay">
      <div className="modal">
        <section id="top">
          <h1>
            New Workout
          </h1>
          <button className="finish">
            Finish
          </button>
        </section>
        <section>

          {workout.map((exercise, idx) => (
            <Exercise key={idx} data={exercise}/>
          ))}

          <button onClick={addExercise}>
            Add Exercise
          </button>

        </section>


      </div>
    </div>
  );
}

export default Modal;
