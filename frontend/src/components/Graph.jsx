import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Graph.css";
import propTypes from "prop-types";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Set = (props) => {
  const canvasRef = useRef(null);

  const [workouts, setWorkouts] = useState([]);
  useEffect(() => {
    if (props.user) {
      fetch(`http://localhost:3000/profiles/${props.user.uid}/workouts`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // Parse JSON data from the response
        })
        .then((data) => {
          // Handle successful response
          setWorkouts(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching boards:", error);
        });
    }
  }, [props.user]);

  useEffect(() => {
    const graphRatio = 0.65;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, props.width, props.height);

    // Draw canvas here...

    const border = canvas.getContext("2d");
    border.rect(
      ((1 - graphRatio) / 2) * props.width,
      ((1 - graphRatio) / 2) * props.height,
      graphRatio * props.width,
      graphRatio * props.height
    );
    border.strokeStyle = "black";
    border.lineWidth = "1";
    border.stroke();

    //text setup

    const xText = canvas.getContext("2d");
    xText.font = "11px Arial";
    xText.fillStyle = "black";
    xText.fillText("volume (lbs)", 5, props.height / 2);

    const yText = canvas.getContext("2d");
    yText.font = "11px Arial";
    yText.fillStyle = "black";
    yText.fillText("workout #", props.width / 2, props.height * 0.95);

    //workout volume tracker
    let maxVolume = 0;
    let volumes = [];
    console.log(workouts.length);
    if (workouts.length > 0) {
      const interval = (graphRatio * props.width) / workouts.length;
      console.log(interval);
      workouts.map((workout) => {
        let volume = 0;
        workout.exercises.map((exercise) => {
          exercise.sets.map((set) => {
            volume = volume + set.weight * set.reps;
          });
          if (volume > maxVolume) {
            maxVolume = volume;
          }
        });
        volumes.push(volume);
      });

      let vertTicFactor = 10;

      for (let i = 0; i <= vertTicFactor; i++) {
        let tic = canvas.getContext("2d");
        tic.beginPath();
        tic.moveTo(
            ((1 - graphRatio) / 2)  * props.width - 2,
          ((1 - graphRatio) / 2) * props.height + (1- (i / vertTicFactor))* graphRatio * props.height
        );
        tic.lineTo(
            ((1 - graphRatio) / 2)  * props.width + 2,
            ((1 - graphRatio) / 2) * props.height + (1- (i / vertTicFactor))* graphRatio * props.height
        );
        tic.stroke();

        const pointText = canvas.getContext("2d");
        pointText.font = "11px Arial";
        pointText.fillStyle = "black";
        pointText.fillText(
            Math.floor( (i / vertTicFactor)* maxVolume ),
          ((1 - graphRatio) / 2)  * props.width - 35,
          ((1 - graphRatio) / 2) * props.height + (1- (i / vertTicFactor)) * graphRatio * props.height
        );
      }

      volumes.map((volume, idx) => {
        let coords = [
          idx * interval,
          (volume / maxVolume) * graphRatio * props.height,
        ];

        let valsX = coords[0] + ((1 - graphRatio) / 2) * props.width;

        let point = canvas.getContext("2d");
        point.beginPath();
        point.arc(
          valsX,
          props.height - (coords[1] + ((1 - graphRatio) / 2) * props.height),
          2,
          0,
          2 * Math.PI
        );
        point.fillStyle = "black";
        point.fill();
        point.lineWidth = 1;
        point.strokeStyle = "black";
        point.stroke();

        let tic = canvas.getContext("2d");
        tic.beginPath();
        tic.moveTo(
          valsX,
          props.height * graphRatio + (1 - graphRatio) * 0.5 * props.height - 2
        );
        tic.lineTo(
          valsX,
          props.height * graphRatio + (1 - graphRatio) * 0.5 * props.height + 2
        );
        tic.stroke();

        const pointText = canvas.getContext("2d");
        pointText.font = "11px Arial";
        pointText.fillStyle = "black";
        pointText.fillText(
          idx + 1,
          valsX - 4,
          props.height * graphRatio + (1 - graphRatio) * 0.5 * props.height + 12
        );
      });
    }
  }, [workouts]);
  return (
    <div className="graphDiv">
      <canvas
        ref={canvasRef}
        width={props.width}
        height={props.height}
        className="graphCanvas"
      />
    </div>
  );
};

export default Set;