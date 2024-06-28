import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Exercise.css";
import propTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import Set from "./Set";

const Exercise = (props) => {

    const [sets, setSets] = useState([]);

    const addSet = () => {
      setSets((prevState) => [...prevState, {weight: 0, reps: 0}])
    }

  return (
    <div>
      <h2>Exercise placeholder</h2>

      {sets.map((set, idx) => (
        <Set key={idx} data={set} />
      ))}

      <button onClick={addSet}>Add Set</button>
    </div>
  );
};

export default Exercise;
