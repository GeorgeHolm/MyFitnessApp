import { useState, useEffect } from "react";
import "./LoadingState.css";
import AIVisualization from "./AIVisualization";

import "bootstrap/dist/css/bootstrap.min.css";

function LoadingState() {
  const [response, setResponse] = useState([]);
  const [message, setMessage] = useState("");
  const [thinking, setThinking] = useState(true);

  return (
    <div className="loadingLocation">
      <AIVisualization isThinking={thinking} />
    </div>
  );
}

export default LoadingState;
