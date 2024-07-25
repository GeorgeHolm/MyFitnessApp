import React from "react";
import "./Graph.css";
import { useRef, useState, useEffect } from "react";

const Graph = (props) => {
  const canvasRef = useRef(null);
  const render = () => {
    const graphRatio = 0.65;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    // Clear the canvas
    context.clearRect(0, 0, props.width, props.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, props.width, props.height);

    // Draw canvas here...

    const border = context;
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

    const xText = context;
    xText.font = "11px Arial";
    xText.fillStyle = "black";
    xText.textAlign = "left";

    xText.fillText(props.yAxis, 5, props.height / 2);

    const yText = context;
    yText.font = "11px Arial";
    yText.fillStyle = "black";
    yText.textAlign = "left";

    yText.fillText(props.xAxis, props.width / 2, props.height * 0.95);

    if (props.title) {
      const title = context;
      title.textAlign = "center";

      title.font = "30px Arial";
      title.fillStyle = "black";
      title.fillText(props.title, props.width / 2, props.height * 0.1);
    }

    //workout data tracker

    //Search through all datapoints and find the max value as an upper bound for the graph
    let maxData = 0;
    let interval = 0;
    props.dataPoints.map((dataPoints) => {
      if (dataPoints.length > 0) {
        interval = (graphRatio * props.width) / dataPoints.length;
        dataPoints.map((point) => {
          if (point > maxData) {
            maxData = point;
          }
        });
      }
    });


    //Loop through each dataset
    props.dataPoints.map((dataPoints, colorIdx) => {
      if (dataPoints.length > 0) {
        let vertTicFactor = 10;
        let color = "black";
        if (colorIdx === 1) {
          color = "blue";
        }
        if (colorIdx === 2) {
          color = "red";
        }
        if (colorIdx === 3) {
          color = "purple";
        }

        //Setup graph tic marks
        for (let i = 0; i <= vertTicFactor; i++) {
          let tic = context;
          tic.beginPath();
          tic.moveTo(
            ((1 - graphRatio) / 2) * props.width - 2,
            ((1 - graphRatio) / 2) * props.height +
              (1 - i / vertTicFactor) * graphRatio * props.height
          );
          tic.lineTo(
            ((1 - graphRatio) / 2) * props.width + 2,
            ((1 - graphRatio) / 2) * props.height +
              (1 - i / vertTicFactor) * graphRatio * props.height
          );
          tic.stroke();

          const pointText = context;
          pointText.font = "11px Arial";
          pointText.fillStyle = "black";
          pointText.fillText(
            Math.floor((i / vertTicFactor) * maxData),
            ((1 - graphRatio) / 2) * props.width - 35,
            ((1 - graphRatio) / 2) * props.height +
              (1 - i / vertTicFactor) * graphRatio * props.height
          );
        }


        //For a given data set, map the points out
        dataPoints.map((dataPoint, idx) => {
          let coords = [
            idx * interval,
            (dataPoint / maxData) * graphRatio * props.height,
          ];

          //translate point coords to canvas coords then draw point
          let valsX = coords[0] + ((1 - graphRatio) / 2) * props.width;

          let point = context;
          point.beginPath();
          point.arc(
            valsX,
            props.height - (coords[1] + ((1 - graphRatio) / 2) * props.height),
            2,
            0,
            2 * Math.PI
          );
          point.fillStyle = color;
          point.fill();
          point.lineWidth = 1;
          point.strokeStyle = color;
          point.stroke();


          //draw tic mark along with point
          let tic = context;
          tic.strokeStyle = "black";

          tic.beginPath();
          tic.moveTo(
            valsX,
            props.height * graphRatio +
              (1 - graphRatio) * 0.5 * props.height -
              2
          );
          tic.lineTo(
            valsX,
            props.height * graphRatio +
              (1 - graphRatio) * 0.5 * props.height +
              2
          );
          tic.stroke();

          const pointText = context;
          pointText.font = "11px Arial";
          pointText.fillStyle = "black";
          pointText.fillText(
            idx + 1,
            valsX - 4,
            props.height * graphRatio +
              (1 - graphRatio) * 0.5 * props.height +
              12
          );
        });
        let line = context;


        //If required, create linear regression
        if (props.linearRegression[colorIdx]) {

          //find the sum of every x_i y_i, x_i^2, y_i^2
          let xSum = 0,
            ySum = 0,
            xxSum = 0,
            xySum = 0;
          let count = dataPoints.length;
          for (let j = 0; j < count; j++) {
            let i = j + 1;
            xSum += i;
            ySum += dataPoints[j];
            xxSum += i * i;
            xySum += i * dataPoints[j];
          }

          //Formula for the slope and intercept of a linear regression
          let slope =
            (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
          let intercept = ySum / count - (slope * xSum) / count;


          //returns point where the line for the linear regression intersects height
          const findIntercept = (height) => {
            return (height - intercept) / slope;
          };



          //given an equation, return a y value
          const findPointSlope = (x, slo, inter) => {
            return slo * x + inter;
          };

          //draw a line from [start, end] with a slope of lineSlope and a y intercept of lineIntercept
          const drawLine = (start, end, lineSlope, lineIntercept) => {
            line.beginPath();

            //Line starting position
            line.moveTo(
              ((1 - graphRatio) / 2) * props.width +
                ((start - 1) / count) * graphRatio * props.width,
              props.height -
                ((findPointSlope(start, lineSlope, lineIntercept) / maxData) *
                  graphRatio *
                  props.height +
                  ((1 - graphRatio) / 2) * props.height)
            );

            //line ending position
            line.lineTo(
              ((1 - graphRatio) / 2) * props.width +
                ((end - 1) / count) * graphRatio * props.width,
              props.height -
                ((findPointSlope(end, lineSlope, lineIntercept) / maxData) *
                  graphRatio *
                  props.height +
                  ((1 - graphRatio) / 2) * props.height)
            );
            line.strokeStyle = color;

            line.stroke();
          };
          let lineRatio = 1;
          let startingPoint = 1;

          //cannot cross borders of graph so
          //findIntercept is used to make sure 
          //that the regression stays within the graph
          if (slope > 0) {
            lineRatio =
              Math.min(count + 1, findIntercept(maxData)) / (count + 1);
            startingPoint = Math.max(1, findIntercept(0));
          } else {
            lineRatio = Math.min(count + 1, findIntercept(0)) / (count + 1);
            startingPoint = Math.max(1, findIntercept(maxData));
          }
          drawLine(startingPoint, lineRatio * (count + 1), slope, intercept);
        }
      }
    });
  };
  useEffect(() => {

    //necessary to render, delete, rerender immediately after to get linear regression choices to function
    render();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    // Clear the canvas
    context.clearRect(0, 0, props.width, props.height);

    render();
  }, [props.dataPoints, props.linearRegression]);
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

export default Graph;
