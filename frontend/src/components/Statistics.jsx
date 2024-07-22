import { useState, useEffect } from "react";
import "./Statistics.css";
import SearchBar from "./SearchBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Graph from "./Graph";
import PiChart from "./PiChart";
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
          });
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
              title={"Graph of Volume"}
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
              title={"Graph of Volume"}
            />
          )}
        </section>
        <section id="half">
          {meals[0] && (
            <PiChart
              chartData={[["protien", meals[0].totalProteins], ["carbs", meals[0].totalCarbs], ["fats", meals[0].totalFats]]}
              chartTotal={["grams", meals[0].totalGrams]}
              user={user}
              width={600}
              height={500}
              title={"Meal one macros"}
              units={"g"}
            />
          )}
          {meals[0] && (
            <PiChart
              chartData={[["protien", meals[0].totalProteins], ["carbs", meals[0].totalCarbs], ["fats", meals[0].totalFats]]}
              chartTotal={["grams", meals[0].totalGrams]}
              user={user}
              width={600}
              height={500}
              title={"Meal one macros"}
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
              linearRegression={[true]}
              title={"Graph of Calories"}
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
              title={"Graph of Calories"}
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
              title={"Grams for Meals"}
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
              linearRegression={[true, false, true, false]}
              title={"Grams for Meals"}
            />
          )}
        </section>
      </div>
    </>
  );
}

export default Statistics;
