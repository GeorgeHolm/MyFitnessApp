import { useState, useEffect } from "react";
import "./AIVisualization.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, generateContent } from "../firebase";
import { useRef } from "react";



function AIVisualization() {
  let ref = useRef();
  const [mousePos, setMousePosition] = useState({
    x: null,
    y: null,
  });

  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);


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

    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      };
    }

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

    circle(50, 50, 100, "white", 1);
    circle(50, 50, 100, `rgb(255, 155,0)`);
    circle(75, 50, 50, "white");

    let requestId,
      i = 0;
    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      circle(50, 50, 100, "white", 1);

      for (let j = 0; j < 16; j++) {
        let offset = (j / 8) * Math.PI;
        circle(
          50 +
            22.5 * Math.cos(((j / 8 + 1) * i) / 6 + offset) +
            22.5 * Math.sin(i + offset),
          50 +
            22.5 * Math.sin(((j / 8 + 1) * i) / 6 + offset) +
            22.5 * Math.cos(i + offset),
          (10 *
            Math.abs(
              Math.cos(((j / 8 + 1) * i) / 6 + offset) + Math.sin(i + offset)
            )) /
            2,
          `rgb(0, 102,${255 - 255 * Math.abs(Math.cos((i * j) / 6))})`,
          1
        );
      }

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
        <p>
            {JSON.stringify(mousePos)}
        </p>
      <canvas ref={ref} width="200px" height="200px" />
    </div>
  );
}

export default AIVisualization;
