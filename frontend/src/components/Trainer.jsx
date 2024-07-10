import { useState, useEffect } from "react";
import "./Trainer.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, generateContent } from "../firebase";
import AIVisualization from "./AIVisualization";
function Trainer() {
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");
  const [thinking, setThinking] = useState(false);

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  async function getContent(message) {
    setThinking(true);

    const result = await generateContent(message);
    setResponse(result);
  }
  useEffect(() => {
    setThinking(false);
  }, [response]);

  return (
    <div>
      <p>PERSONAL TRAINER</p>

      <AIVisualization isThinking={thinking} />

      <input
        type="text"
        placeholder="Ask your personal Trainer a question!"
        onChange={handleMessage}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            getContent(message);
          }
        }}
        value={message}
      />
      <p>{response}</p>
    </div>
  );
}

export default Trainer;
