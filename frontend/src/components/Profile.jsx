import { useState } from "react";
import "./Profile.css";
import SearchBar from "./SearchBar";

function Profile() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SearchBar/>
      <body>
        <section id="left">
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"/>
        </section>
        <section id="right">

        </section>
      </body>
    </>
  );
}

export default Profile;
