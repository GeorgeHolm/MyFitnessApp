import { useState, useEffect } from "react";
import "./Trainer.css";
import { auth, generateContent } from "../firebase";
import AIVisualization from "./AIVisualization";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

import Accordion from "react-bootstrap/Accordion";

function Trainer() {
  const [response, setResponse] = useState([]);
  const [message, setMessage] = useState("");
  const [thinking, setThinking] = useState(false);

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  async function getContent(message) {
    setThinking(true);

    const result = await generateContent(message);
    setResponse((prev) => [...prev, result]);
  }
  useEffect(() => {
    setThinking(false);
  }, [response]);

  return (
    <div>
      <p>PERSONAL TRAINER</p>

      <AIVisualization isThinking={thinking} />

      <Accordion className="messages" defaultActiveKey="0">
        {response.map((res, idx) => (
          <Accordion.Item key={idx} eventKey={idx}>
            <Accordion.Header>Response #{idx + 1}</Accordion.Header>
            <Accordion.Body>{res}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <InputGroup>
        <InputGroup.Text>With textarea</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Ask your personal Trainer a question!"
          onChange={handleMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getContent(message);
            }
          }}
          value={message}
          as="textarea"
          aria-label="With textarea"
        />
      </InputGroup>
    </div>
  );
}

export default Trainer;
