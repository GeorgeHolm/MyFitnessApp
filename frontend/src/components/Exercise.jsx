import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Exercise.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Set from "./Set";

const Exercise = (props) => {
  const addSet = () => {
    const updatedWorkout = props.workout.map((c, i) => {
      if (i === props.index) {
        let temp = c;
        temp.sets.push({ weight: 0, reps: 0 });
        return temp;
      } else {
        return c;
      }
    });
    props.setWorkout(updatedWorkout);
  };

  return (
    <div>
      <h2>Exercise placeholder</h2>

      {props.workout[props.index].sets.map((set, idx) => (
        <Set
          setWorkout={props.setWorkout}
          workout={props.workout}
          exerciseIndex={props.index}
          setIndex={idx}
          key={idx}
          data={set}
        />
      ))}

      <button onClick={addSet}>Add Set</button>
    </div>
  );
};

export default Exercise;
