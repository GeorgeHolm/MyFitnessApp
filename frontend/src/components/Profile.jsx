import { useState, useEffect } from "react";
import "./Profile.css";
import SearchBar from "./SearchBar";
import ProfileEdit from "./ProfileEdit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import getInfo from "./Requests";
function Profile() {
  const [user, setUser] = useState();
  const [currentEdit, setCurrentEdit] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (prof) => {
      if (prof) {
        getInfo(`/profiles/${prof.uid}`, setUser, 0);
      }
    });
  }, []);

  const editProf = () => {
    setCurrentEdit(true);
  };

  return (
    <>
      <SearchBar user={user} />
      <div className="flexbox">
        {currentEdit && (
          <ProfileEdit user={user} setUser={setUser} close={setCurrentEdit} />
        )}

        <div id="left">
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
          <button onClick={editProf} className="edit">
            Edit Profile
          </button>
          <p>Name: {user?.name}</p>
          <p>Sex: {user?.sex}</p>
          <p>Age: {user?.age}</p>
          <p>Bio: {user?.bio}</p>
        </div>
        <div id="right"></div>
      </div>
    </>
  );
}

export default Profile;
