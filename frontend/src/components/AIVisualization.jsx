import { useState, useEffect } from "react";
import "./AIVisualization.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, generateContent } from "../firebase";
import { useRef } from "react";

function AIVisualization() {
  let ref = useRef();

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
    canvas.style.height = `${height}px`;

    const circle = (x, y, r, color, a) => {
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
      context.fillStyle = "black";
      context.globalAlpha = 1;
    };

    circle(50, 50, 100, `rgb(255, 155,0)`);
    circle(75, 50, 50, "white");

    let requestId,
      i = 0;
    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      circle(
        50,
        50,
        100 * Math.abs(Math.cos(i/6)),
        `rgb(100, 155,${255 - 255 * Math.abs(Math.cos(i/6))})`,
        Math.abs(Math.cos(i))
      );
      circle(75, 50,100 -  50 * Math.abs(Math.cos(i/2)), "white", 1 -  Math.abs(Math.cos(i)));

      i += 0.05;
      requestId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  return (
    <div>
      <canvas ref={ref} width="100" height="100" className="graphCanvas" />
    </div>
  );
}

export default AIVisualization;
