import { useState, useEffect } from "react";
import "./Home.css";
import SearchBar from "./SearchBar";
import Workout from "./Workout";
import Meal from "./Meal";

import Modal from "./Modal";
import { onAuthStateChanged } from "firebase/auth";
import { auth, generateContent } from "../firebase";

function Home() {
  const [user, setUser] = useState();
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [modal, setModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [workoutMeal, setWorkoutMeal] = useState(true); //true == workout, false == meal
  const [response, setResponse] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (prof) => {
      if (prof) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        fetch(`http://localhost:3000/profiles/${prof.uid}/workouts`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse JSON data from the response
          })
          .then((data) => {
            // Handle successful response
            setWorkouts(data);
          })
          .catch((error) => {
            console.error("Error fetching boards:", error);
          });

        fetch(`http://localhost:3000/profiles/${prof.uid}/meals`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse JSON data from the response
          })
          .then((data) => {
            // Handle successful response
            setMeals(data);
          })
          .catch((error) => {
            console.error("Error fetching boards:", error);
          });

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
  }, [modal]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/profiles/${user.uid}/workouts`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // Parse JSON data from the response
        })
        .then((data) => {
          // Handle successful response
          setWorkouts(data);
        })
        .catch((error) => {
          console.error("Error fetching boards:", error);
        });

      fetch(`http://localhost:3000/profiles/${user.uid}/meals`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // Parse JSON data from the response
        })
        .then((data) => {
          // Handle successful response
          setMeals(data);
        })
        .catch((error) => {
          console.error("Error fetching boards:", error);
        });
    }
  }, [modal, refresh, workoutMeal]);

  const addWorkout = () => {
    setModal(!modal);

    console.log(modal);
  };

  const workoutMealSwitch = () => {
    setWorkoutMeal(!workoutMeal);
  };

  const getContent = () => {
    setResponse(generateContent());
  };
  useEffect(() => {
    console.log(response);
  }, [response]);

  return (
    <>
      {modal && <Modal type={workoutMeal} setModal={setModal} user={user} />}
      <SearchBar user={user} />
      <div className="flexbox">
        <section id="workouts">
          {workoutMeal
            ? workouts.map((res) => (
                <Workout
                  refresh={refresh}
                  setRefresh={setRefresh}
                  key={res.id}
                  content={res}
                />
              ))
            : meals.map((res) => (
              <Meal
              refresh={refresh}
              setRefresh={setRefresh}
              key={res.id}
              content={res}
              />
            ))}
        </section>
        <section id="chat">
          <p>Chat</p>
          <button onClick={getContent}>
            Click Me!
          </button>
        </section>
        <button
          onClick={workoutMealSwitch}
          className="round"
          id="workoutMealSwitch"
        >
          {workoutMeal ? "W" : "M"}
        </button>
        <button onClick={addWorkout} className="round">
          {modal ? "-" : "+"}
        </button>
      </div>
    </>
  );
}

export default Home;
