import { useState, useEffect } from "react";
import "./Statistics.css";
import SearchBar from "./SearchBar";
import ProfileEdit from "./ProfileEdit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Graph from "./Graph"
function Statistics() {
  const [user, setUser] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (prof) => {
      if (prof) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        //   const uid = user.uid;

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
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <>
      <SearchBar user={user} />
      <div className="flexbox">
        <section id="half">
            <Graph user={user} width={600} height={500}/>
    




 
        </section>
        <section id="half"></section>
      </div>
    </>
  );
}

export default Statistics;
