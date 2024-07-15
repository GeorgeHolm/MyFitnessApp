import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DisplayMeal.css";
import PiChart from "./PiChart";

function DisplayMeal(props) {
  useEffect(() => {
    console.log(props.meal?.foods?.map(food => ([food.name, food.calories])));
  }, [props.meal]);

  return (
    <div className="mealDisplay">
      <p>Meal:</p>
      <p>{props.meal.notes}</p>
      <p>calories: {props.meal.totalCalories} cal</p>
      <p>carbohydrates: {props.meal.totalCarbs} g</p>
      <p>fats: {props.meal.totalFats} g</p>
      <p>proteins: {props.meal.totalProteins} g</p>
      <p>grams: {props.meal.totalGrams} g</p>

      {props.meal.id && (
        <div>
          <PiChart
            chartData={[
              ["protien", props.meal.totalProteins],
              ["carbs", props.meal.totalCarbs],
              ["fats", props.meal.totalFats],
            ]}
            chartTotal={["grams", props.meal.totalGrams]}
            width={800}
            height={500}
            title={"Meal macros"}
            units={"g"}
          />
          <PiChart
            chartData={props.meal?.foods?.map(food => ([food.name, food.calories]))}
            chartTotal={["calories", props.meal.totalCalories]}
            width={1000}
            height={500}
            title={"Calorie Ratio"}
            units={"g"}
          />
        </div>
      )}
    </div>
  );
}

export default DisplayMeal;
