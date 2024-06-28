import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Workout.css";
import propTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Workout = (props) => {

  const deleteWorkout = () => {

    const asyncDelete = async () => {

    fetch(`${import.meta.env.VITE_BACKEND_LINK}/workouts/${props.content.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  }

  asyncDelete();
  props.setRefresh(props.refresh + 1);
  }

  return (
    <div className="workout">
      <button onClick={deleteWorkout} className="delete">
        -
      </button>
      <h2>Workout placeholder</h2>
      <p>{props.content.notes}</p>

      {props.content.exercises.map((exercise, idx) => (
        <div key={idx}>
          <h4>Exercise name: {exercise.name}</h4>
          {exercise.sets.map((set, idxx) => (
            <p key={idxx}>
              weight: {set.weight}, reps: {set.reps}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Workout;
