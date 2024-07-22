import React from "react";
import "./Graph.css";
import { useRef, useState, useEffect } from "react";

const Graph = (props) => {
  const canvasRef = useRef(null);

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
    xText.textAlign = "left";

    xText.fillText(props.yAxis, 5, props.height / 2);

    const yText = canvas.getContext("2d");
    yText.font = "11px Arial";
    yText.fillStyle = "black";
    yText.textAlign = "left";

    yText.fillText(props.xAxis, props.width / 2, props.height * 0.95);

    if (props.title) {
      const title = canvas.getContext("2d");
      title.textAlign = "center";

      title.font = "30px Arial";
      title.fillStyle = "black";
      title.fillText(props.title, props.width / 2, props.height * 0.1);
    }

    //workout data tracker
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
        for (let i = 0; i <= vertTicFactor; i++) {
          let tic = canvas.getContext("2d");
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

          const pointText = canvas.getContext("2d");
          pointText.font = "11px Arial";
          pointText.fillStyle = "black";
          pointText.fillText(
            Math.floor((i / vertTicFactor) * maxData),
            ((1 - graphRatio) / 2) * props.width - 35,
            ((1 - graphRatio) / 2) * props.height +
              (1 - i / vertTicFactor) * graphRatio * props.height
          );
        }

        dataPoints.map((dataPoint, idx) => {
          let coords = [
            idx * interval,
            (dataPoint / maxData) * graphRatio * props.height,
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
          point.fillStyle = color;
          point.fill();
          point.lineWidth = 1;
          point.strokeStyle = color;
          point.stroke();

          let tic = canvas.getContext("2d");
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

          const pointText = canvas.getContext("2d");
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

        if (props.linearRegression[colorIdx]) {
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
          let slope =
            (count * xySum - xSum * ySum) / (count * xxSum - xSum * xSum);
          let intercept = ySum / count - (slope * xSum) / count;

          const findIntercept = (height) => {
            return (height - intercept) / slope;
          };

          const findPointSlope = (x, slo, inter) => {
            return slo * x + inter;
          };

          const drawLine = (start, end, lineSlope, lineIntercept) => {
            let line = canvas.getContext("2d");
            line.beginPath();
            line.moveTo(
              ((1 - graphRatio) / 2) * props.width +
                ((start - 1) / count) * graphRatio * props.width,
              props.height -
                ((findPointSlope(start, lineSlope, lineIntercept) / maxData) *
                  graphRatio *
                  props.height +
                  ((1 - graphRatio) / 2) * props.height)
            );

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
          //cannot cross borders of graph
          if (slope > 0) {
            lineRatio =
              Math.min(count + 1, findIntercept(maxData)) / (count + 1);
          } else {
            lineRatio = Math.min(count + 1, findIntercept(0)) / (count + 1);
          }
          drawLine(1, lineRatio * (count + 1), slope, intercept);
        }
      }
    });
  }, [props.dataPoints]);
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
