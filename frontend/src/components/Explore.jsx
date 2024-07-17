import { useState, useEffect } from "react";
import "./Explore.css";
import SearchBar from "./SearchBar";
import Workout from "./Workout";
import Meal from "./Meal";
import Trainer from "./Trainer";
import Modal from "./Modal";
import { onAuthStateChanged } from "firebase/auth";
import { auth, generateContent } from "../firebase";
import DisplayWorkout from "./DisplayWorkout";
import DisplayMeal from "./DisplayMeal";

function Explore() {
  const [user, setUser] = useState();
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [modal, setModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [workoutMeal, setWorkoutMeal] = useState(true); //true == workout, false == meal
  const [chatting, setChatting] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const [currentMeal, setCurrentMeal] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (prof) => {
      if (prof) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        fetch(`http://localhost:3000/workouts`)
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

        fetch(`http://localhost:3000/meals`)
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
  }, [modal, refresh]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/workouts`)
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

      fetch(`http://localhost:3000/meals`)
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
  };

  const workoutMealSwitch = () => {
    setWorkoutMeal(!workoutMeal);
  };

  const handleChatting = () => {
    setChatting(!chatting);
  };

  const handleCurrentWorkout = (e) => {
    setCurrentWorkout(e);
    //User touched workout
    setRefresh(refresh + 1);

    if (!user.touchWorkouts.some((workout) => workout.workoutId === e.id)) {
      const asyncTouch = async () => {
        const touchworkout = await fetch(
          `${import.meta.env.VITE_BACKEND_LINK}/touchworkout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              wid: e.id,
              id: user.id,
            }),
          }
        )
          .then((response) => response.json())
          .catch((error) => console.error(error));
      };
      asyncTouch();
    }
  };

  const handleCurrentMeal = (e) => {
    setCurrentMeal(e);

    //user touched meal
    setRefresh(refresh + 1);

    if (!user.touchMeals.some((meal) => meal.mealId === e.id)) {
      const asyncTouch = async () => {
        const touchmeal = await fetch(
          `${import.meta.env.VITE_BACKEND_LINK}/touchmeal`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mid: e.id,
              id: user.id,
            }),
          }
        )
          .then((response) => response.json())
          .catch((error) => console.error(error));
      };
      asyncTouch();
    }
  };

  return (
    <>
      {modal && <Modal type={workoutMeal} setModal={setModal} user={user} />}
      <SearchBar user={user} />
      <div className="flexbox">
        <section id="workouts">
          {workoutMeal
            ? workouts
                .sort((a, b) => b.id - a.id)
                .map((res) => (
                  <Workout
                    onClick={handleCurrentWorkout}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    key={res.id}
                    content={res}
                    edit={false}
                  />
                ))
            : meals
                .sort((a, b) => b.id - a.id)
                .map((res) => (
                  <Meal
                    onClick={handleCurrentMeal}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    key={res.id}
                    content={res}
                    edit={false}
                  />
                ))}
        </section>
        <section id="chat">
          {chatting && <Trainer />}

          {workoutMeal ? (
            <DisplayWorkout
              user={user}
              workout={currentWorkout}
              refresh={refresh}
              setRefresh={setRefresh}
              edit={false}
            />
          ) : (
            <DisplayMeal
              user={user}
              edit={false}
              meal={currentMeal}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          )}
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
        <button onClick={handleChatting} className="round" id="chatButton">
          {chatting ? "Chat" : "None"}
        </button>
      </div>
    </>
  );
}

export default Explore;
