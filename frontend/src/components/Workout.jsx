import React from "react";
import "./Workout.css";

const Workout = (props) => {

  const deleteWorkout = () => {

    const asyncDelete = async () => {

    fetch(`${import.meta.env.VITE_BACKEND_LINK}/workouts/${props.content.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  asyncDelete();

  Promise.all([asyncDelete])
  .catch((error) => {
    console.error(error);
  });

  props.setRefresh(props.refresh + 1);
  }

  const handleClick = () => {
    props.onClick(props.content)
  }

  return (
    <div className="workout" onClick={handleClick}>
      <button onClick={deleteWorkout} className="delete">
        -
      </button>
      <h2>Workout placeholder</h2>
      <p>{props.content.notes}</p>

      {props.content.exercises.map((exercise, idx) => (
        <div key={idx}>
          <h4>Exercise name: {exercise.name}</h4>
          {exercise.sets.map((set, idxx) => (
            <p key={idxx}>
              weight: {set.weight}, reps: {set.reps}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Workout;
