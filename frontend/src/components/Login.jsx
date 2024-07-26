import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { NavLink, useNavigate } from "react-router-dom";
import LoadingState from "./LoadingState";
import "./Signup.css"

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        setLoading(false);
      // Signed in
      const user = userCredential.user;
      navigate("/home");
    });
  };

  return (
    <>
      <main>
        <section>
          <div className="signupPage">
            <h1> MyFitnessTracker </h1>

            <form>
              <div>
                <label htmlFor="email-address">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <button onClick={onLogin}>Login</button>
              </div>
            </form>

            <p className="text-sm text-center">
              No account yet? <NavLink to="/">Sign up</NavLink>
            </p>
            {loading && <LoadingState />}
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
