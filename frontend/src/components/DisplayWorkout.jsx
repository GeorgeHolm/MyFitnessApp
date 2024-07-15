import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, generateContent } from "../firebase";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Accordion from "react-bootstrap/Accordion";
import "./DisplayWorkout.css";
import PiChart from "./PiChart";
function DisplayWorkout(props) {
  const [chartData, setChartData] = useState([]);
  const [setData, setSetData] = useState([]);
  const [volume, setVolume] = useState(0);
  const [totalSets, setTotalSets] = useState(0);

  useEffect(() => {
    let dummyArrayVolume = Array(props.workout?.length).fill(["", 0]);
    let dummyArraySets = Array(props.workout?.length).fill(["", 0]);

    let totalVolume = 0;
    let totalSetsTemp = 0;
    props.workout?.exercises?.map((exercise, idx) => {
      let volume = 0;
      exercise.sets.map((set) => {
        volume += set.reps * set.weight;
      });
      dummyArrayVolume[idx] = [exercise.name, volume];
      dummyArraySets[idx] = [exercise.name, exercise.sets.length];
      totalSetsTemp += exercise.sets.length;
      totalVolume += volume;
    });
    setChartData(dummyArrayVolume);
    setVolume(totalVolume);
    setSetData(dummyArraySets);
    setTotalSets(totalSetsTemp);
  }, [props.workout]);

  return (
    <div className="workoutDisplay">
      <PiChart
        chartData={chartData}
        chartTotal={["lbs", volume]}
        width={800}
        height={500}
        title={"Workout Volume Distribution"}
        units={"lbs"}
      />
      <PiChart
        chartData={setData}
        chartTotal={["#", totalSets]}
        width={800}
        height={500}
        title={"Workout Set Distribution"}
        units={" "}
      />
    </div>
  );
}

export default DisplayWorkout;
