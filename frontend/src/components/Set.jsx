import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Set.css";
import propTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Set = (props) => {
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);

  const handleWeight = (e) => {
    if (!Number(e.target.value)) {
      return;
    }
    setWeight(e.target.value);
    console.log(weight);
  };

  const handleReps = (e) => {
    if (!Number(e.target.value)) {
      return;
    }
    setReps(e.target.value);
    console.log(reps);
  };

  useEffect(() => {
    console.log("OurWorkout:");
    console.log(props.workout);
    const updatedWorkout = props.workout.map((c, i) => {
      if (i === props.exerciseIndex) {
        let newSets = props.workout[i].sets.map((s, j) => {
          if (j === props.setIndex) {
            return { weight: weight, reps: reps };
          } else {
            return s;
          }
        });
        return { name: c.name, sets: newSets };
      } else {
        return c;
      }
    });

    console.log("updated:");
    console.log(updatedWorkout);
    props.setWorkout(updatedWorkout);
  }, [weight, reps]);
  return (
    <div>
      <span>weight:</span>
      <span>
        <input
          type="text"
          placeholder="0"
          onChange={handleWeight}
          value={weight}
        />
      </span>
      <span>Reps:</span>
      <span>
        <input placeholder="0" type="text" onChange={handleReps} value={reps} />
      </span>
    </div>
  );
};

export default Set;
