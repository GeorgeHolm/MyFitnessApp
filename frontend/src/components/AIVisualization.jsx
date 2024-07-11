import { useState, useEffect } from "react";
import "./AIVisualization.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, generateContent } from "../firebase";
import { useRef } from "react";

function AIVisualization(props) {
  let ref = useRef();
  const renderCircleNumber = 16;
  const findTheta = (w, h) => Math.atan(w / h) / (Math.PI / 180); //degrees

  const [mousePos, setMousePosition] = useState({
    x: null,
    y: null,
  });
  const [currI, setCurrI] = useState(0);

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

  useEffect(() => {
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

    const circle = (x, y, r, color, a, w, border) => {
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
    };

    circle(50, 50, 50, "white");

    let requestId,
      i = currI;
    let forceArray = Array(renderCircleNumber).fill([0, 0]);
    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      let border =
        100 / (Math.sqrt((mousePos.x - 50) ** 2 + (mousePos.y - 50) ** 2) + 5);
      circle(50, 50, 50, "white", 1, border, true);

      for (let j = 0; j < renderCircleNumber; j++) {
        let offset = (j / (renderCircleNumber / 2)) * Math.PI;
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

        let dist = Math.sqrt(
          (coord[0] + forceArray[j][0] - mousePos.x) ** 2 +
            (coord[1] - forceArray[j][1] - mousePos.y) ** 2
        );

        let theta = findTheta(coord[0] - mousePos.x, coord[1] - mousePos.y);

        forceArray[j] = [
          forceArray[j][0] * 0.9 + (10 * Math.cos(theta)) / dist,
          forceArray[j][1] * 0 + (10 * Math.sin(theta)) / dist,
        ];

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

        circle(
          coord[0] + forceArray[j][0],
          coord[1] - forceArray[j][1],
          (10 *
            Math.abs(
              Math.cos(((j / 8 + 1) * i) / 6 + offset) + Math.sin(i + offset)
            )) /
            2,
          color,
          1
        );
      }
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
