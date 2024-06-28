import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Workout.css";
import propTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Workout = (props) => {
  return (
    <div className="workout">
      <h2>Workout placeholder</h2>
      <p>{props.content.notes}</p>

      {props.content.exercises.map((exercise, idx) => (
        <div key={idx}>
          <h4>Exercise name: {exercise.name}</h4>
          {exercise.sets.map((set, idxx) => (
            <p key={idxx} >weight: {set.weight}, reps: {set.reps}</p>
          ))}

        </div>
      ))}
    </div>
  );
};

export default Workout;
