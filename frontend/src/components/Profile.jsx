import { useState, useEffect } from "react";
import "./Profile.css";
import SearchBar from "./SearchBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
function Profile() {
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
      <SearchBar user={user} />
      <div>
        <section id="left">
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
        </section>
        <section id="right"></section>
      </div>
    </>
  );
}

export default Profile;
