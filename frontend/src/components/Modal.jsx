import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Modal.css";
import { useState, useEffect } from "react";

export function Modal(props) {


  const [workout, setWorkout] = useState([]);



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

          <button>
            Add Exercise
          </button>

        </section>


      </div>
    </div>
  );
}

export default Modal;
