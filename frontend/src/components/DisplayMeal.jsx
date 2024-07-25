import "bootstrap/dist/css/bootstrap.min.css";
import "./DisplayMeal.css";
import PiChart from "./PiChart";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, generateContent } from "../firebase";
import useEffectAfter from "./useEffectAfter";
function DisplayMeal(props) {
  const [user, setUser] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(0);

  useEffect(() => {
    onAuthStateChanged(auth, (prof) => {
      if (prof) {
        fetch(`${import.meta.env.VITE_BACKEND_LINK}/profiles/${prof.uid}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            // Handle successful response
            setUser(data[0]);
            setIsLiked(
              data[0].likedMeals.some((meal) => meal.mealId === props.meal?.id)
            );
          });
      }
    });
  }, [isLiked, props.meal]);
  const likeButton = () => {
    if (user) {
      //cannot say why I need the user here but it is necessary!
      if (isLiked) {
        setNumLikes(numLikes - 1);
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
          ).then((res) => setIsLiked(false));
        };
        asyncTouch();
      } else {
        //User like meal
        setNumLikes(numLikes + 1);

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
          ).then((res) => setIsLiked(true));
        };
        asyncTouch();
      }
    }
  };
  useEffectAfter(() => {
    if (props.meal) {
      setNumLikes(props.meal.profileLikes?.length);
    }
  }, [props.meal]);
  return (
    <div className="mealDisplay">
      {props.meal.id && (
        <div>
          {props.user ? (
            <div>
              <button onClick={likeButton}>
                {isLiked ? "Unlike" : "Like"}: {numLikes}
              </button>
            </div>
          ) : (
            <div>
              <p>Post like count: {numLikes}</p>
            </div>
          )}
          <h2>Meal Information:</h2>
          <p>{props.meal.notes}</p>
          <p>calories: {props.meal.totalCalories} cal</p>
          <p>carbohydrates: {props.meal.totalCarbs} g</p>
          <p>fats: {props.meal.totalFats} g</p>
          <p>proteins: {props.meal.totalProteins} g</p>
          <p>grams: {props.meal.totalGrams} g</p>

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
