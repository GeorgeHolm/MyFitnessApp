import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Workout.css";
import propTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";


const Workout = (props) => {

  return (
    <div className="workout">
      <h2>
        Workout placeholder
      </h2>
      <p>{props.content.notes}</p>
    </div>
  );
};

export default Workout;
