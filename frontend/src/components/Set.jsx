import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Set.css";
import propTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";

const Set = (props) => {
  return (
    <span>
      <h3>weight: {props.data.weight}, reps: {props.data.reps}</h3>
    </span>
  );
};

export default Set;
