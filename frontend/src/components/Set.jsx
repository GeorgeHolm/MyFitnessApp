import React from "react";
import "./Set.css";
import { useState, useEffect } from "react";

const Set = (props) => {
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);

  const handleWeight = (e) => {
    if (!Number(e.target.value)) {
      return;
    }
    setWeight(e.target.value);
  };

  const handleReps = (e) => {
    if (!Number(e.target.value)) {
      return;
    }
    setReps(e.target.value);
  };

  useEffect(() => {
    if (props.data.id) {
      setWeight(props.data.weight);
      setReps(props.data.reps);
    }
  });

  useEffect(() => {
    const updatedWorkout = props.workout.map((c, i) => {
      if (i === props.exerciseIndex) {
        let newSets = props.workout[i].sets.map((s, j) => {
          if (j === props.setIndex) {
            return { weight: weight, reps: reps };
          } else {
            return s;
          }
        });
        return { name: c.name, sets: newSets };
      } else {
        return c;
      }
    });

    props.setWorkout(updatedWorkout);
  }, [weight, reps]);

  const deleteSet = () => {
    props.deleteSet(props.setIndex);
  };

  return (
    <div className="exercise">
      <span>Weight (lbs):</span>
      <span>
        <input
          type="text"
          placeholder="0"
          onChange={handleWeight}
          value={weight}
        />
      </span>
      <span>Reps:</span>
      <span>
        <input placeholder="0" type="text" onChange={handleReps} value={reps} />
        <button onClick={deleteSet} className="info deleteButton">
          x
        </button>
      </span>
    </div>
  );
};

export default Set;
