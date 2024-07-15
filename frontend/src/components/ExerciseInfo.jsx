import React from "react";
import "./ExerciseInfo.css";

const ExerciseInfo = (props) => {
  const checkToggleOff = (e) => {
    props.toggleInfo();
  }
  return (
    <>
      {props.exercise ? (
        <div className="exerciseInfo" onClick={checkToggleOff}>
          <img className="eImage" src={props.exercise?.image} />
          <p>{props.exercise?.name}</p>
          <p>{props.exercise?.bodyParts}</p>
          <p>{props.exercise?.equipment}</p>
          {props.exercise?.steps.map((step, idx) => (
            <p className="steps" key={idx}>
              {step}
            </p>
          ))}
        </div>
      ) : (
        <div onClick={checkToggleOff} className="exerciseInfo">No information on this exercise</div>
      )}
    </>
  );
};

export default ExerciseInfo;
