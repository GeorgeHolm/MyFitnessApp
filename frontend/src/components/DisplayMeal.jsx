import "bootstrap/dist/css/bootstrap.min.css";
import "./DisplayMeal.css";
import PiChart from "./PiChart";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, generateContent } from "../firebase";

function DisplayMeal(props) {
  const [user, setUser] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (prof) => {
      if (prof) {
        fetch(`http://localhost:3000/profiles/${prof.uid}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse JSON data from the response
          })
          .then((data) => {
            // Handle successful response
            setUser(data[0]);
            setIsLiked(
              data[0].likedMeals.some((meal) => meal.mealId === props.meal.id)
            );
          })
          .catch((error) => {
            console.error("Error fetching boards:", error);
          });
      } else {
        // User is signed out
        // ...
        console.log("user is logged out");
      }
    });
  }, [isLiked, props.meal]);

  const likeButton = () => {
    if (user) { //cannot say why I need the user here but it is necessary!
      if (isLiked) {
        const asyncTouch = async () => {
          const unlikeMeal = await fetch(
            `${import.meta.env.VITE_BACKEND_LINK}/likemeal`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                mid: props.meal.id,
                id: props.user.id,
              }),
            }
          )
            .then((res) => setIsLiked(false))
            .catch((error) => console.error(error));
        };
        asyncTouch();
      } else {
        //User like meal

        const asyncTouch = async () => {
          const likeMeal = await fetch(
            `${import.meta.env.VITE_BACKEND_LINK}/likemeal`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                mid: props.meal.id,
                id: props.user.id,
              }),
            }
          )
            .then((res) => setIsLiked(true))
            .catch((error) => console.error(error));
        };
        asyncTouch();
      }
    }
  };

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
          {props.user && (
            <button onClick={likeButton}>{isLiked ? "Unlike" : "Like"}</button>
          )}
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
            chartData={props.meal?.foods?.map((food) => [
              food.name,
              food.calories,
            ])}
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
