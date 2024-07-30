import { useState, useEffect } from "react";
import "./Home.css";
import SearchBar from "./SearchBar";
import Workout from "./Workout";
import Meal from "./Meal";
import Trainer from "./Trainer";
import Modal from "./Modal";
import { onAuthStateChanged } from "firebase/auth";
import { auth, generateContent } from "../firebase";
import DisplayWorkout from "./DisplayWorkout";
import DisplayMeal from "./DisplayMeal";
import getInfo from "./Requests";
import LoadingState from "./LoadingState";
import { useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState();
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [modal, setModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [workoutMeal, setWorkoutMeal] = useState(true); //true == workout, false == meal
  const [chatting, setChatting] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const [currentMeal, setCurrentMeal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBarExtras, setUserBarExtras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (prof) => {
      if (prof) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        getInfo(
          `/profiles/${prof.uid}/workouts`,
          setWorkouts,
          null,
          setLoading
        );
        getInfo(`/profiles/${prof.uid}/meals`, setMeals, null, setLoading);
        getInfo(`/profiles/${prof.uid}`, setUser, 0, setLoading);
      } else {
        //user is logged out
        navigate("/");
      }
    });
  }, [modal]);

  useEffect(() => {
    setUserBarExtras([
      [handleChatting, "Toggle Chat"],
      [workoutMealSwitch, "Toggle Workouts and Meals"],
      [addWorkout, "Create Post"]
    ]);
    if (user) {
      getInfo(`/profiles/${user.uid}/workouts`, setWorkouts);
      getInfo(`/profiles/${user.uid}/meals`, setMeals);
    }
  }, [modal, refresh, workoutMeal, chatting]);

  const addWorkout = () => {
    setModal(!modal);
  };

  const workoutMealSwitch = () => {
    setWorkoutMeal(!workoutMeal);
  };

  const handleChatting = () => {
    console.log(chatting);
    setChatting(!chatting);
  };

  const handleCurrentWorkout = (e) => {
    setCurrentWorkout(e);
  };

  const handleCurrentMeal = (e) => {
    setCurrentMeal(e);
  };



  return (
    <>
      {modal && (
        <Modal
          type={workoutMeal}
          setLoading={setLoading}
          setModal={setModal}
          workoutMealSwitch={workoutMealSwitch}
          user={user}
        />
      )}
      {user && <SearchBar user={user} userBarExtras={userBarExtras} />}
      {user ? (
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
                      edit={true}
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
                      edit={true}
                    />
                  ))}
          </section>
          <section id="chat">
            {chatting && <Trainer />}

            {workoutMeal ? (
              <DisplayWorkout
                workout={currentWorkout}
                refresh={refresh}
                edit={true}
                setRefresh={setRefresh}
              />
            ) : (
              <DisplayMeal
                meal={currentMeal}
                refresh={refresh}
                setRefresh={setRefresh}
                edit={true}
              />
            )}
          </section>

          {loading && <LoadingState />}
        </div>
      ) : (
        <>{loading && <LoadingState />}</>
      )}
    </>
  );
}

export default Home;
