import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Graph.css";
import propTypes from "prop-types";
import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const PiChart = (props) => {
  const canvasRef = useRef(null);

  const arcPart = useCallback((x, y, r, color, start, end) => {
    let canvas = canvasRef.current;
    let context = canvas.getContext("2d");

    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x, y);
    context.arc(x, y, r, start, end);
    context.lineTo(x, y);
    context.fill();

    context.fillStyle = "black";
    context.globalAlpha = 1;
    context.lineWidth = 0;
    context.closePath();
  }, []);

  useEffect(() => {
    console.log(props.chartObject);
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

    //Make pichart

    if(props.chartObject.totalCalories) {

        let proteinRatio = props.chartObject.totalProteins / props.chartObject.totalGrams;
        let carbRatio =  props.chartObject.totalCarbs / props.chartObject.totalGrams;
        let fatRatio =  props.chartObject.totalFats / props.chartObject.totalGrams;
        let remainder = 1 - proteinRatio - carbRatio - fatRatio;
        arcPart(
            props.width / 2,
            props.height / 2,
            props.height / 4,
            "rgb(158,49,49)",
            0,
            2 * Math.PI * proteinRatio
          );
          arcPart(
              props.width / 2,
              props.height / 2,
              props.height / 4,
              "rgb(49,53,158)",
              2 * Math.PI * proteinRatio,
              2 * Math.PI * carbRatio + 2 * Math.PI * proteinRatio
            );
            arcPart(
              props.width / 2,
              props.height / 2,
              props.height / 4,
              "rgb(50,209,134)",
              2 * Math.PI * carbRatio + 2 * Math.PI * proteinRatio,
              2 * Math.PI * fatRatio + 2 * Math.PI * carbRatio + 2 * Math.PI * proteinRatio
            );      
            arcPart(
                props.width / 2,
                props.height / 2,
                props.height / 4,
                "rgb(152,152,152)",
                2 * Math.PI * fatRatio + 2 * Math.PI * carbRatio + 2 * Math.PI * proteinRatio,
                2 * Math.PI 
              );      
    }

  }, [props.chartObject]);

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

export default PiChart;
