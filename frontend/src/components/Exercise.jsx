import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Exercise.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Set from "./Set";

const Exercise = (props) => {
  const [exerciseName, setExerciseName] = useState("");

  const addSet = () => {
    const updatedWorkout = props.workout.map((c, i) => {
      if (i === props.index) {
        let temp = c;
        temp.name = exerciseName;
        temp.sets.push({ weight: 0, reps: 0 });
        return temp;
      } else {
        return c;
      }
    });
    props.setWorkout(updatedWorkout);
  };

  const handleName = (e) => {
    setExerciseName(e.target.value);

    props.exerciseInfo.exercises.map((exercise) => { //WANT SPECIAL EVENT WHEN FIND AN EXERCISE THAT EXISTS
      if(exercise.name.toLowerCase() === e.target.value.toLowerCase()){
        console.log("exists");
      }
    })
    console.log(exerciseName);
  };

  return (
    <div className="exercise">
      <div className="exercise">
        <span>Exercise:</span>

        <span>
          <input
            list="exercises"
            type="text"
            placeholder=""
            onChange={handleName}
            value={exerciseName}
          />
          <datalist id="exercises">
            {props.exerciseInfo.exercises.map((exercise, exerciseIdx) => (
              <option key={exerciseIdx} value={exercise.name} />
            ))}
          </datalist>
        </span>
      </div>

      {props.workout[props.index].sets.map((set, idx) => (
        <Set
          setWorkout={props.setWorkout}
          workout={props.workout}
          exerciseIndex={props.index}
          setIndex={idx}
          key={idx}
          data={set}
        />
      ))}

      <button onClick={addSet}>Add Set</button>
    </div>
  );
};

export default Exercise;
