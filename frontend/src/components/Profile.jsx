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

        }
      });
     
}, [])



const editProf = () => {
  setCurrentEdit(true);
}

  return (
    <>
      <SearchBar user={user} />
      <div className="flexbox">

        {currentEdit && <ProfileEdit user={user} setUser={setUser} close={setCurrentEdit}/>}

        <div id="left">
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
        </div>
        <div id="right"></div>
      </div>
    </>
  );
}

export default Profile;
