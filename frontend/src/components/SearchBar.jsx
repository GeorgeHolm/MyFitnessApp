import { useState } from "react";
import "./SearchBar.css";
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
          <button className="finish">Home</button>
        </Link>
        <Link to={"/profile"}>
          <button className="finish">Profile</button>
        </Link>
        <Link to={"/statistics"}>
          <button className="finish">Statistics</button>
        </Link>

        <Link to={"/explore"}>
          <button className="finish">Explore</button>
        </Link>

        {props.userBarExtras && props.userBarExtras.map((res, idx) => 
        <button className="finish" key={idx} value={idx} onClick={res[0]}>{res[1]}</button>
        )}

        <button className="finish" onClick={handleLogout}>Logout</button>
      </header>
    </>
  );
}

export default SearchBar;
