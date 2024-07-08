import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./Graph.css";
import propTypes from "prop-types";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Set = (props) => {
    const canvasRef = useRef(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
      context.fillStyle = 'white';
      context.fillRect(0, 0, props.width, props.height);
    // Draw canvas here...
    }, [])
  return (
    <div className="graphDiv">
        <canvas ref={canvasRef} width={props.width} height={props.height} className="graphCanvas"/>
    </div>
  );
};

export default Set;
