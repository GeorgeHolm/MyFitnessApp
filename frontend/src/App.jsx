import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import Login from "./components/Login";
import "./App.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route key="-1" path="/home" element={<Home />} />
        <Route key="-1" path="/profile" element={<Profile />} />

        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
