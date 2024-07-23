import React from "react";
import "./Modal.css";
import { useState, useEffect } from "react";

export function ProfileEdit(props) {
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [age, setAge] = useState(0);
  const [bio, setBio] = useState("");
  const closeModal = () => {
    props.close(false);
  };

  const submitEdits = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_BACKEND_LINK}/profiles/${props.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: props.user.email,
        uid: props.user.uid,
        name: name,
        sex: sex,
        age: Number(age),
        bio: bio,
      }),
    })
      .then((response) => response.json());
      
    props.setUser({
      id: props.user.id,
      email: props.user.email,
      uid: props.user.uid,
      name: name,
      sex: sex,
      age: Number(age),
      bio: bio,
    });
  };

  return (
    <div className="overlay">
      <div className="modal">
        <button onClick={closeModal} className="finish">
          X
        </button>

        <h1>Change Profile</h1>

        <form>
          <label>
            Name:
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
            />
          </label>
          <label>
            Sex:
            <select required onChange={(e) => setSex(e.target.value)}>
              <option>Choose Sex</option>

              <option value={"Male"}>Male</option>
              <option value={"Female"}>Female</option>
              <option value={"Other/Prefer not to say"}>
                Other/Prefer not to say
              </option>
            </select>
          </label>
          <label>
            Age:
            <input
              required
              value={age}
              onChange={(e) => {
                if (Number(e.target.value)) {
                  setAge(e.target.value);
                }
              }}
              type="text"
            />
          </label>
          <label>
            bio:
            <input
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              type="text"
            />
          </label>

          <input onClick={submitEdits} type="submit" />
        </form>
      </div>
    </div>
  );
}

export default ProfileEdit;
