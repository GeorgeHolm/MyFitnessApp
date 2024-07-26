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
import Knn from "./Knn";
import useEffectAfter from "./useEffectAfter";
import getInfo from "./Requests";
import LoadingState from "./LoadingState";

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
  const [profiles, setProfiles] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recentOrRecommended, setRecentOrRecommended] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffectAfter(() => {
    if (
      user &&
      profiles.length !== 0 &&
      workouts.length !== 0 &&
      meals.length !== 0
    ) {
      setRecommendations(Knn(user, workouts, meals, profiles));
    }
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (prof) => {
      if (prof) {
        getInfo(`/workouts`, setWorkouts, null, setLoading);
        getInfo(`/meals`, setMeals, null, setLoading);
        getInfo(`/profiles`, setProfiles, null, setLoading);
        getInfo(`/profiles/${prof.uid}`, setUser, 0, setLoading);
      }
    });
  }, [modal, refresh]);

  useEffect(() => {
    if (user) {
      getInfo(`/workouts`, setWorkouts, null, setLoading);
      getInfo(`/meals`, setMeals, null, setLoading);
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

  const recsOrNot = () => {
    setRecentOrRecommended(!recentOrRecommended);
  };

  const handleCurrentWorkout = (e) => {
    setCurrentWorkout(e);
    //User touched workout
    setRefresh(refresh + 1);
    if (!user.touchWorkouts.some((workout) => workout.workoutId === e.id)) {
      setLoading(true);

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
        ).then((response) => {
          setLoading(false);
          return response.json();
        });
      };
      asyncTouch();
    }
  };

  const handleCurrentMeal = (e) => {
    setCurrentMeal(e);
    setLoading(true);

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
        ).then((response) => {
          setLoading(false);
          return response.json();
        });
      };
      asyncTouch();
    }
  };

  return (
    <>
      {user ? (
        <>
          {modal && (
            <Modal type={workoutMeal} setModal={setModal} user={user} />
          )}
          <SearchBar user={user} />
          <div className="flexbox">
            {recentOrRecommended ? (
              <section id="workouts">
                {workoutMeal
                  ? recommendations.workoutRecsIndex.map((res) => {
                      if (!workouts[res[1]].private) {
                        return (
                          <Workout
                            onClick={handleCurrentWorkout}
                            refresh={refresh}
                            setRefresh={setRefresh}
                            key={workouts[res[1]].id}
                            content={workouts[res[1]]}
                            edit={false}
                          />
                        );
                      }
                    })
                  : recommendations.mealRecsId.map((res) => {
                      if (!meals[res[1]].private) {
                        return (
                          <Meal
                            onClick={handleCurrentMeal}
                            refresh={refresh}
                            setRefresh={setRefresh}
                            key={meals[res[1]].id}
                            content={meals[res[1]]}
                            edit={false}
                          />
                        );
                      }
                    })}
              </section>
            ) : (
              <section id="workouts">
                {workoutMeal
                  ? workouts
                      .sort((a, b) => b.id - a.id)
                      .filter((a) => a.private === false)
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
                      .filter((a) => a.private === false)
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
            )}
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
            <button onClick={recsOrNot} className="round" id="recs">
              {recentOrRecommended ? "New" : "For You"}
            </button>
            {loading && <LoadingState />}
          </div>
        </>
      ) : (
        <>{loading && <LoadingState />}</>
      )}
    </>
  );
}

export default Explore;
