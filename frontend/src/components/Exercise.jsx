import React from "react";
import "./Exercise.css";
import { useState, useEffect } from "react";
import Set from "./Set";
import ExerciseInfo from "./ExerciseInfo";

const Exercise = (props) => {
  const [extraInfo, setExtraInfo] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [infoPopup, setInfoPopup] = useState(false);
  const [infoPopupExercise, setInfoPopupExercise] = useState({});

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
    setExtraInfo(false);
    setInfoPopupExercise({});
    props.exerciseInfo.exercises.map((exercise) => {
      //If we have that exercise, then create a ? buttton to get more information on it.
      if (exercise.name.toLowerCase() === e.target.value.toLowerCase()) {
        setExtraInfo(true);
        setInfoPopupExercise(exercise);
      }
    });
  };

  const toggleInfo = () => {
    setInfoPopup(!infoPopup);
  };
 

  return (
    <div className="exercise">
      <div className="exercise">
        {extraInfo ? (
          <span className="popupWrap">
            {infoPopup && <ExerciseInfo toggleInfo={toggleInfo} exercise={infoPopupExercise} />}
            <button onClick={toggleInfo} className="info">
              ?
            </button>
          </span>
        ) : (
          <span className="popupWrap">
            {infoPopup && <ExerciseInfo toggleInfo={toggleInfo}/>}

            <button onClick={toggleInfo} className="info">
              !
            </button>
          </span>
        )}
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
