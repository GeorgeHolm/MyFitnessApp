import { useState, useEffect } from "react";
import "./Profile.css";
import SearchBar from "./SearchBar";
import ProfileEdit from "./ProfileEdit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
function Profile() {
  const [user, setUser] = useState();
  const [currentEdit, setCurrentEdit] = useState(false);

  useEffect(()=>{
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
          console.log("user is logged out")
        }
      });
     
}, [])

useEffect(() => {
  console.log(user);

}, [user]);

const editProf = () => {
  setCurrentEdit(true);
}

  return (
    <>
      <SearchBar user={user} />
      <div>

        {currentEdit && <ProfileEdit user={user} setUser={setUser} close={setCurrentEdit}/>}

        <section id="left">
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
          <button onClick={editProf} className="edit">
            Edit Profile
          </button>
          <p>
            Name: {user?.name}
          </p>
          <p>
            Sex: {user?.sex}
          </p>
          <p>
            Age: {user?.age}
          </p>
          <p>
            Bio: {user?.bio}
          </p>
        </section>
        <section id="right"></section>
      </div>
    </>
  );
}

export default Profile;
