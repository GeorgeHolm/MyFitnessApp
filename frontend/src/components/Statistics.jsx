import { useState, useEffect } from "react";
import "./Statistics.css";
import SearchBar from "./SearchBar";
import ProfileEdit from "./ProfileEdit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Graph from "./Graph";
function Statistics() {
  const [user, setUser] = useState();
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [totalVolumes, setTotalVolumes] = useState([]);
  const [totalCalories, setTotalCalories] = useState([]);
  const [totalGrams, setTotalGrams] = useState([]);
  const [totalCarbs, setTotalCarbs] = useState([]);
  const [totalProteins, setTotalProteins] = useState([]);
  const [totalFats, setTotalFats] = useState([]);

  useEffect(() => {
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
        console.log("user is logged out");
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/profiles/${user.uid}/workouts`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // Parse JSON data from the response
        })
        .then((data) => {
          // Handle successful response
          setWorkouts(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching boards:", error);
        });

      fetch(`http://localhost:3000/profiles/${user.uid}/meals`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // Parse JSON data from the response
        })
        .then((data) => {
          // Handle successful response
          setMeals(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching boards:", error);
        });
    }
  }, [user]);

  useEffect(() => {
    if (workouts.length > 0) {
      let volumes = [];
      workouts.map((workout) => {
        let volume = 0;
        workout.exercises.map((exercise) => {
          exercise.sets.map((set) => {
            volume = volume + set.weight * set.reps;
          });
        });
        volumes.push(volume);
      });

      setTotalVolumes(volumes);
    }
    if (meals.length > 0) {
      let calTemp = [];
      let gramTemp = [];
      let protTemp = [];
      let fatTemp = [];
      let carbTemp = [];

      meals.map((meal) => {
        calTemp.push(meal.totalCalories);
        gramTemp.push(meal.totalGrams);
        protTemp.push(meal.totalProteins);
        fatTemp.push(meal.totalFats);
        carbTemp.push(meal.totalCarbs);
      });

      setTotalCalories(calTemp);
      setTotalGrams(gramTemp);
      setTotalProteins(protTemp);
      setTotalCarbs(carbTemp);
      setTotalFats(fatTemp);
    }
  }, [workouts, meals]);
  return (
    <>
      <SearchBar user={user} />
      <div className="flexbox">
        <section id="half">
          {totalVolumes.length > 0 && (
            <Graph
              dataPoints={[totalVolumes]}
              xAxis={"workout #"}
              yAxis={"volume (lbs)"}
              user={user}
              width={600}
              height={500}
              linearRegression={[true]}
            />
          )}
          {totalVolumes.length > 0 && (
            <Graph
              dataPoints={[totalVolumes]}
              xAxis={"workout #"}
              yAxis={"volume (lbs)"}
              user={user}
              width={600}
              height={500}
              linearRegression={[false]}
            />
          )}
        </section>
        <section id="half">
          {totalCalories.length > 0 && (
            <Graph
              dataPoints={[totalCalories]}
              xAxis={"meal #"}
              yAxis={"calories"}
              user={user}
              width={600}
              height={500}
              linearRegression={[true]}
            />
          )}
          {totalCalories.length > 0 && (
            <Graph
              dataPoints={[totalCalories]}
              xAxis={"meal #"}
              yAxis={"calories"}
              user={user}
              width={600}
              height={500}
              linearRegression={[false]}
            />
          )}
          {totalGrams.length > 0 && (
            <Graph
              dataPoints={[totalGrams, totalCarbs, totalFats, totalProteins]}
              xAxis={"meal #"}
              yAxis={"grams"}
              user={user}
              width={600}
              height={500}
              linearRegression={[true, false, false, false]}
            />
          )}
          {totalGrams.length > 0 && (
            <Graph
              dataPoints={[totalCarbs, totalFats, totalProteins]}
              xAxis={"meal #"}
              yAxis={"grams"}
              user={user}
              width={600}
              height={500}
              linearRegression={[false, false, true, false]}
            />
          )}
        </section>
      </div>
    </>
  );
}

export default Statistics;
