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


    //Make pichart

    let textAlignStart = props.width * 4/5;

    let runningTotal = 0;
    props.chartData.map((part, idx) => {
        let ratio = part[1]/props.chartTotal[1];
        let color = `rgb(${200 * runningTotal + 50}, 0, ${200 * runningTotal + 55})`;
        arcPart(
            props.width / 2,
            props.height / 2,
            props.height / 4,
            color,
            Math.PI * 2 * runningTotal,
            Math.PI * 2 * runningTotal + 2 * Math.PI * ratio
          );
          runningTotal = runningTotal + ratio

          context.fillStyle = color;
        
          context.fillRect(
            textAlignStart - 30,
            props.height * idx / props.chartData.length + props.height * 0.5 / props.chartData.length - 20,
            20,
            20
          );
          context.strokeStyle = color;
          context.lineWidth = "1";
          context.stroke();

          context.font = "20px Arial";
          context.fillStyle = "black";
          context.fillText(part[0], textAlignStart, props.height * idx / props.chartData.length + props.height * 0.5 / props.chartData.length);
    })

    arcPart(
        props.width / 2,
        props.height / 2,
        props.height / 4,
        `rgb(155, 155, 155)`,
        Math.PI * 2 * runningTotal,
        2 * Math.PI
      );


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
