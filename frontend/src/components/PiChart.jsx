import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Graph.css";
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
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, props.width, props.height);

    if (props.title) {
      context.textAlign = "center";
      context.font = "30px Arial";
      context.fillStyle = "black";
      context.fillText(props.title, props.width / 2, props.height * 0.1);
      context.textAlign = "left";
    }

    arcPart(
      props.width / 2,
      props.height / 2,
      props.height / 4 + 4,
      "black",
      0,
      2 * Math.PI
    );
    //Create Pichart
    //Map through the chart data, creating a slice of the chart that is proportional to
    //the amount it takes up in the whole data set
    //If there is any remainder, fill it with grey
    let textAlignStart = (props.width * 4) / 5;
    let runningTotal = 0;
    props.chartData.map((part, idx) => {
      let ratio = part[1] / props.chartTotal[1];
      let color = `rgb(${200 * runningTotal + 50}, 0, ${
        200 * runningTotal + 55
      })`;
      arcPart(
        props.width / 2,
        props.height / 2,
        props.height / 4,
        color,
        Math.PI * 2 * runningTotal,
        Math.PI * 2 * runningTotal + 2 * Math.PI * ratio
      );
      runningTotal = runningTotal + ratio;

      context.fillStyle = color;

      context.fillRect(
        textAlignStart - 30,
        (props.height * idx) / (props.chartData.length + 1) +
          (props.height * 0.5) / (props.chartData.length + 1) -
          20,
        20,
        20
      );
      context.strokeStyle = color;
      context.lineWidth = "1";
      context.stroke();

      context.font = "20px Arial";
      context.fillStyle = "black";
      if (props.units) {
        context.fillText(
          part[0] +
            ": " +
            (part[1]).toString() +
            props.units,
          textAlignStart,
          (props.height * idx) / (1 + props.chartData.length) +
            (props.height * 0.5) / (1 + props.chartData.length)
        );
      } else {
        context.fillText(
          part[0] + ": " + (Math.floor(ratio * 1000) / 10).toString() + "%",
          textAlignStart,
          (props.height * idx) / (1 + props.chartData.length) +
            (props.height * 0.5) / (1 + props.chartData.length)
        );
      }
    });

    //if there is any non-negligible remainder leftover, include it
    if (Math.floor((1 - runningTotal) * 1000) > 0) {
      arcPart(
        props.width / 2,
        props.height / 2,
        props.height / 4,
        `rgb(155, 155, 155)`,
        Math.PI * 2 * runningTotal,
        2 * Math.PI
      );

      context.fillStyle = `rgb(155, 155, 155)`;

      context.fillRect(
        textAlignStart - 30,
        props.height - (props.height * 0.5) / (props.chartData.length + 1) - 20,
        20,
        20
      );
      context.strokeStyle = `rgb(155, 155, 155)`;
      context.lineWidth = "1";
      context.stroke();

      context.font = "20px Arial";
      context.fillStyle = "black";
      if (props.units) {
        context.fillText(
          "other: " +
            (
              Math.ceil((1 - runningTotal) * props.chartTotal[1] * 10) / 10
            ).toString() +
            props.units,
          textAlignStart,
          props.height - (props.height * 0.5) / (props.chartData.length + 1)
        );
      } else {
        context.fillText(
          "other: " +
            (Math.ceil((1 - runningTotal) * 1000) / 10).toString() +
            "%",
          textAlignStart,
          props.height - (props.height * 0.5) / (props.chartData.length + 1)
        );
      }
    }
  }, [props.chartObject, props.chartData, props.chartTotal]);

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
