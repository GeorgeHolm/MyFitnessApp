import { useState } from "react";
import "./Profile.css";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
function SearchBar(props) {
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/");
    });
  };

  const toggles = (e) => {
    console.log(props.userBarExtras[e.target.value][1])
    props.userBarExtras[e.target.value][0](!props.userBarExtras[e.target.value][1]);
  }

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

        {props.userBarExtras && props.userBarExtras.map((res, idx) => 
        <button key={idx} value={idx} onClick={res[0]}>{res[1]}</button>
        )}

        <button onClick={handleLogout}>Logout</button>
      </header>
    </>
  );
}

export default SearchBar;
