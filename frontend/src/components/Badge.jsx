import { useState, useEffect } from "react";
import { useRef, useCallback } from "react";

function Badge(props) {
  let ref = useRef();
  //Render a circle on the canvas with [x,y] coordinates, r radius, color color,
  //a alpha, w line width, and border for border width

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

  const centeredText = useCallback((x, y, text, fontSize) => {
    let canvas = ref.current;
    let context = canvas.getContext("2d");
    context.textAlign = "center";
    context.font = `${fontSize} Georgia`;
    context.fillStyle = "black";
      context.fillText(
        text,
        canvas.width * (x / 100),
        canvas.height * (y / 100),
        canvas.width * 0.75
      );
  }, []);

  useEffect(() => {
    let requestId;
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



    const render = () => {
        //border setup
      circle(50, 50, 75, props.color, 1, 1, true);
      centeredText(50, 50, props.awardTitle, "40px");
      centeredText(50, 60, props.awardSubtitle, "20px");


      requestId = requestAnimationFrame(render);
    };

    render();

  });

  return (
    <div>
      <canvas ref={ref} width="400px" height="400px" />
    </div>
  );
}

export default Badge;
