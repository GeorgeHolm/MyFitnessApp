import { useState } from "react";
import "./Profile.css";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
function Profile(props) {
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  };

  return (
    <>
      <header id="header-bar">
        <p>User Email: {props.user?.email}</p>
        <Link to={"/home"}>
          <button>Home</button>
        </Link>
        <Link to={"/profile"}>
          <button>Profile</button>
        </Link>
        <Link to={"/statistics"}>
          <button>Statistics</button>
        </Link>

        <Link to={"/explore"}>
          <button>Explore</button>
        </Link>

        <button onClick={handleLogout}>Logout</button>
      </header>
    </>
  );
}

export default Profile;
