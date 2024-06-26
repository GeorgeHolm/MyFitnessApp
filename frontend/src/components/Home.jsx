import { useState, useEffect } from "react";
import "./Home.css";
import SearchBar from "./SearchBar";
import Workout from "./Workout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';

function Home() {
  const [user, setUser] = useState();

  useEffect(()=>{
    onAuthStateChanged(auth, (prof) => {
        if (prof) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
        //   const uid = user.uid;
          setUser(prof);
        } else {
          // User is signed out
          // ...
          console.log("user is logged out")
        }
      });
     
}, [])

  return (
    <>
      <SearchBar user={user}/>
      <div className="flexbox">
        <section id="workouts">
          <Workout/>
          <Workout/>
          <Workout/>
        </section>
        <section id="chat">
          <p>Chat</p>
        </section>
      </div>
    </>
  );
}

export default Home;
