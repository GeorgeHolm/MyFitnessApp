import React from "react";
import "./Meal.css";

const Meal = (props) => {
  const deleteMeal = () => {
    const asyncDelete = async () => {
      fetch(`${import.meta.env.VITE_BACKEND_LINK}/meals/${props.content.id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .catch((error) => console.error(error));
    };

    asyncDelete();

    Promise.all([asyncDelete]).catch((error) => {
      console.error(error);
    });
    props.setRefresh(props.refresh + 1);
  };

  const onClick = (e) => {
    e.stopPropagation();

    props.onClick(props.content);
  };

  return (
    <div onClick={onClick} className="meal">
      {props.edit && (
        <button onClick={deleteMeal} className="delete">
          -
        </button>
      )}
      <h2>Meal placeholder</h2>
      <p>{props.content.notes}</p>
      <p>calories: {props.content.totalCalories} cal</p>
      <p>carbohydrates: {props.content.totalCarbs} g</p>
      <p>fats: {props.content.totalFats} g</p>
      <p>proteins: {props.content.totalProteins} g</p>
      <p>grams: {props.content.totalGrams} g</p>
    </div>
  );
};

export default Meal;
