import { useState, useEffect } from "react";
import "./Home.css";
import SearchBar from "./SearchBar";
import Workout from "./Workout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';

function Home() {
  const [uid, setUid] = useState("");

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
        //   const uid = user.uid;
          setUid(user.uid);
        } else {
          // User is signed out
          // ...
          console.log("user is logged out")
        }
      });
     
}, [])

  return (
    <>
      <SearchBar uid={uid}/>
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
