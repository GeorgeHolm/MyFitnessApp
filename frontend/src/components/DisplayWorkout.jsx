import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DisplayWorkout.css";
import PiChart from "./PiChart";
import ExerciseInformation from "../../../webscraping/exercises.json";
import Exercise from "./Exercise";
import { onAuthStateChanged } from "firebase/auth";
import { auth, generateContent } from "../firebase";

function DisplayWorkout(props) {
  const [chartData, setChartData] = useState([]);
  const [setData, setSetData] = useState([]);
  const [volume, setVolume] = useState(0);
  const [totalSets, setTotalSets] = useState(0);

  const [workout, setWorkout] = useState([]);
  const [exerciseInfo, setExerciseInfo] = useState([]);

  const [user, setUser] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (prof) => {
      if (prof) {
        fetch(`http://localhost:3000/profiles/${prof.uid}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse JSON data from the response
          })
          .then((data) => {
            // Handle successful response
            setUser(data[0]);
            setIsLiked(
              data[0].likedWorkouts.some((workout) => workout.workoutId === props.workout.id)
            );
          })
          .catch((error) => {
            console.error("Error fetching boards:", error);
          });
      } else {
        // User is signed out
        // ...
        console.log("user is logged out");
      }
    });
  }, [isLiked, props.workout]);

  const likeButton = () => {
    if (user) {
      //cannot say why I need the user here but it is necessary!
      if (isLiked) {
        const asyncTouch = async () => {
          const unlikeWorkout = await fetch(
            `${import.meta.env.VITE_BACKEND_LINK}/likeworkout`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                wid: props.workout.id,
                id: props.user.id,
              }),
            }
          )
            .then((res) => setIsLiked(false))
            .catch((error) => console.error(error));
        };
        asyncTouch();
      } else {
        //User like workout

        const asyncTouch = async () => {
          const likeWorkout = await fetch(
            `${import.meta.env.VITE_BACKEND_LINK}/likeworkout`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                wid: props.workout.id,
                id: props.user.id,
              }),
            }
          )
            .then((res) => setIsLiked(true))
            .catch((error) => console.error(error));
        };
        asyncTouch();
      }
    }
  };

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

    if (props.workout.exercises) {
      setWorkout(props.workout.exercises);
    }
  }, [props.workout]);

  useEffect(() => {
    setExerciseInfo(ExerciseInformation);
  }, [workout]);

  const addExercise = () => {
    setWorkout((prevState) => [...prevState, { name: "", sets: [] }]);
  };

  const editWorkout = () => {
    const asyncEditWorkout = async () => {
      const newWorkout = await fetch(
        `${import.meta.env.VITE_BACKEND_LINK}/workouts/${props.workout.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workout: workout,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          props.setRefresh(props.refresh + 1);
        })
        .catch((error) => console.error(error));
    };
    asyncEditWorkout();
  };

  const deleteExercise = (index) => {
    const updatedWorkout = workout.filter((exercise, idx) => {
      return idx != index;
    });
    setWorkout(updatedWorkout);
  };

  return (
    <div className="workoutDisplay">
      {props.user && (
        <button onClick={likeButton}>{isLiked ? "Unlike" : "Like"}</button>
      )}
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

      {props.workout.exercises && props.edit && (
        <section>
          {workout.map((exercise, idx) => (
            <Exercise
              deleteExercise={deleteExercise}
              exerciseInfo={exerciseInfo}
              workout={workout}
              setWorkout={setWorkout}
              index={idx}
              key={idx}
              data={exercise}
            />
          ))}
          <button onClick={addExercise}>Add Exercise</button>
          <button onClick={editWorkout}>Edit Workout</button>
        </section>
      )}
    </div>
  );
}

export default DisplayWorkout;
