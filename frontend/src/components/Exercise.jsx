import React from "react";
import "./Exercise.css";
import { useState, useEffect } from "react";
import Set from "./Set";
import ExerciseInfo from "./ExerciseInfo";
import useEffectAfter from "./useEffectAfter";

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

  useEffect(() => {
    if (props.data.id) {
      setExerciseName(props.data.name);
    }
  }, [props.data]);

  useEffectAfter(() => {
    if (props.data.id) {
      const updatedWorkout = props.workout.map((c, i) => {
        if (i === props.index) {
          let temp = c;
          temp.name = exerciseName;
          return temp;
        } else {
          return c;
        }
      });
      props.setWorkout(updatedWorkout);
    }
  }, [exerciseName]);

  const deleteExercise = () => {
    props.deleteExercise(props.index);
  };

  const deleteSet = (index) => {
    const updatedWorkout = props.workout.map((c, i) => {
      if (i === props.index) {
        let temp = c;
        temp.name = exerciseName;
        temp.sets = temp.sets.filter((set, idx) => {
          return idx !== index;
        });
        return temp;
      } else {
        return c;
      }
    });
    props.setWorkout(updatedWorkout);
  };

  return (
    <div className="exercise">
      <div className="exercise">
        {extraInfo ? (
          <span className="popupWrap">
            {infoPopup && (
              <ExerciseInfo
                toggleInfo={toggleInfo}
                exercise={infoPopupExercise}
              />
            )}
            <button onClick={toggleInfo} className="info">
              ?
            </button>
          </span>
        ) : (
          <span className="popupWrap">
            {infoPopup && <ExerciseInfo toggleInfo={toggleInfo} />}

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
          <button onClick={deleteExercise} className="info deleteButton">
            x
          </button>
        </span>
      </div>

      {props.workout[props.index].sets.map((set, idx) => (
        <Set
          deleteSet={deleteSet}
          setWorkout={props.setWorkout}
          workout={props.workout}
          exerciseIndex={props.index}
          setIndex={idx}
          key={idx}
          data={set}
        />
      ))}

      <button onClick={addSet} className="finish" >Add Set</button>
    </div>
  );
};

export default Exercise;
