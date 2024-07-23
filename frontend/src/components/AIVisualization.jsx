import { useState, useEffect } from "react";
import { useRef, useCallback } from "react";

function AIVisualization(props) {
  let ref = useRef();
  const renderCircleNumber = 16;

  //calcualte theta in degrees based off of a width and height
  const findTheta = (w, h) => Math.atan(w / h) / (Math.PI / 180);

  const [mousePos, setMousePosition] = useState({
    x: null,
    y: null,
  });
  const [currI, setCurrI] = useState(0);
  const [forceArray, setForceArray] = useState([]);

  const getPixelRatio = (context) => {
    var backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;

    return (window.devicePixelRatio || 1) / backingStore;
  };

  //Render a circle on the canvas with [x,y] coordinates, r radius, color color,
  //a alpha, w line width, and border for border width
  const circle = useCallback((x, y, r, color, a, w, border) => {
    let canvas = ref.current;
    let context = canvas.getContext("2d");

    context.fillStyle = color;
    context.globalAlpha = a;

    context.beginPath();

    context.arc(
      canvas.width * (x / 100),
      canvas.height * (y / 100),
      (canvas.width / 2) * (r / 100),
      0,
      2 * Math.PI
    );

    context.fill();

    if (border) {
      context.lineWidth = w;
      context.stroke();
    }
    context.fillStyle = "black";
    context.globalAlpha = 1;
    context.lineWidth = 0;
    context.closePath();
  }, []);

  useEffect(() => {
    //setup context for canvas
    let canvas = ref.current;
    let context = canvas.getContext("2d");
    let ratio = getPixelRatio(context);
    let width = getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    let height = getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2);

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;

    //create relative mousepotition for any cursor interaction
    const updateMousePosition = (ev) => {
      if (ref) {
        setMousePosition({
          x: Math.floor(
            ((ev.clientX - ref?.current?.getBoundingClientRect().left) * 100) /
              width
          ),
          y: Math.floor(
            ((ev.clientY - ref?.current?.getBoundingClientRect().top) * 100) /
              height
          ),
        });
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    circle(50, 50, 50, "white");

    let requestId,
      i = currI;
    setForceArray(Array(renderCircleNumber).fill([0, 0]));

    const render = () => {
      //setup interactive border, as mouse gets closer the border gets thicker upto a point
      let border =
        100 / (Math.sqrt((mousePos.x - 50) ** 2 + (mousePos.y - 50) ** 2) + 10);
      circle(50, 50, 50, "white", 1, border, true);

      //render each circle
      let dummyForceArray = forceArray;

      for (let j = 0; j < renderCircleNumber; j++) {
        let offset = (j / (renderCircleNumber / 2)) * Math.PI;

        //initial coordinates based off of math trigonometric
        //function in polar coordinates centered around [50,50]
        let coord = [
          50 +
            10 *
              Math.cos(((j / (renderCircleNumber / 2) + 1) * i) / 6 + offset) +
            10 * Math.sin(i + offset),
          50 +
            10 *
              Math.sin(((j / (renderCircleNumber / 2) + 1) * i) / 6 + offset) +
            10 * Math.cos(i + offset),
        ];

        //Calculate distance mouse is from circle center
        let dist = Math.sqrt(
          (coord[0] - mousePos.x) ** 2 + (coord[1] - mousePos.y) ** 2
        );

        let theta = findTheta(coord[0] - mousePos.x, coord[1] - mousePos.y);

        //calculate how much the circle should change based off of distance from mouse
        if (dummyForceArray.length > 0) {
          let xSign = Math.abs(coord[0] - mousePos.x) / (coord[0] - mousePos.x);
          let ySign = Math.abs(coord[1] - mousePos.y) / (coord[1] - mousePos.y);
          dummyForceArray[j] = [
            dummyForceArray[j][0] * 0.99 +
              (xSign * (10 * Math.cos(theta))) / dist ** 2,
            dummyForceArray[j][1] * 0.99 -
              (ySign * (10 * Math.sin(theta))) / dist ** 2,
          ];
          dist = Math.sqrt(
            (coord[0] + dummyForceArray[j][0] - mousePos.x) ** 2 +
              (coord[1] - dummyForceArray[j][1] - mousePos.y) ** 2
          );
        } else {
          dummyForceArray = Array(renderCircleNumber).fill([0, 0]);
        }

        //color based off of if the AI is in an active state or not, will change over time too
        let color;
        if (props.isThinking) {
          color = `rgb(${200 - 150 * Math.abs(Math.cos((i * j) / 6))}, 102,${
            255 - 255 * Math.abs(Math.cos((i * j) / 6))
          })`;
        } else {
          color = `rgb(${255 - 200 * Math.abs(Math.cos((i * j) / 6))}, ${
            255 - 200 * Math.abs(Math.cos((i * j) / 6))
          }, ${255 - 200 * Math.abs(Math.cos((i * j) / 6))})`;
        }

        //render circle given it is in the border of the image
        let newX = coord[0] + dummyForceArray[j][0];
        let newY = coord[1] - dummyForceArray[j][1];
        let centerDist = Math.sqrt((newX - 50) ** 2 + (newY - 50) ** 2);
        if (centerDist <= 25) {
          circle(
            newX,
            newY,
            (10 *
              Math.abs(
                Math.cos(((j / 8 + 1) * i) / 6 + offset) + Math.sin(i + offset)
              )) /
              2,
            color,
            1
          );
        } else if (centerDist <= 30) {
          //Further way from the  center you are the less visible it is
          circle(
            newX,
            newY,
            (10 *
              Math.abs(
                Math.cos(((j / 8 + 1) * i) / 6 + offset) + Math.sin(i + offset)
              )) /
              2,
            color,
            1 + (25 - centerDist) / 5
          );
        }
      }
      setForceArray(dummyForceArray);

      //if in active state, speed up faster
      setCurrI(i);

      if (props.isThinking) {
        i += 0.05;
      } else {
        i += 0.005;
      }

      requestId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(requestId);
      window.removeEventListener("mousemove", updateMousePosition);
    };
  });

  return (
    <div>
      <canvas ref={ref} width="200px" height="200px" />
    </div>
  );
}

export default AIVisualization;
