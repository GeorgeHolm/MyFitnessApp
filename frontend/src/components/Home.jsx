import { useState, useEffect } from "react";
import "./Home.css";
import SearchBar from "./SearchBar";
import Workout from "./Workout";
import Modal from "./Modal";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function Home() {
  const [user, setUser] = useState();
  const [workouts, setWorkouts] = useState([]);
  const [modal, setModal] = useState(false);
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
            console.log("Boards:", data);
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
            console.log("Boards:", data);
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

  const addWorkout = () => {
    setModal(!modal);

    console.log(modal);
  };

  return (
    <>
      {modal && <Modal setModal={setModal} user={user}/>}
      <SearchBar user={user} />
      <div className="flexbox">
        <section id="workouts">
          {workouts.map((res) => (
            <Workout key={res.id} content={res} />
          ))}
        </section>
        <section id="chat">
          <p>Chat</p>
        </section>
        <button onClick={addWorkout} className="round">
          {modal ? ("-") : ("+")}
        </button>
      </div>
    </>
  );
}

export default Home;
