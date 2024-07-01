import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Meal.css";
import propTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Meal = (props) => {

  const deleteMeal = () => {

    const asyncDelete = async () => {

    fetch(`${import.meta.env.VITE_BACKEND_LINK}/meals/${props.content.id}`, {
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
    <div className="meal">
      <button onClick={deleteMeal} className="delete">
        -
      </button>
      <h2>Meal placeholder</h2>
      <p>{props.content.notes}</p>
    </div>
  );
};

export default Meal;
