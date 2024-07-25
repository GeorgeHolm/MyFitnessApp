import { useState, useEffect } from "react";
import "./Statistics.css";
import SearchBar from "./SearchBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Graph from "./Graph";
import PiChart from "./PiChart";
import getInfo from "./Requests";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from 'react-bootstrap/SplitButton';
import LoadingState from "./LoadingState";

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
  const [volumeRegression, setVolumeRegression] = useState([false]);
  const [calorieRegression, setCalorieRegression] = useState([false]);
  const [gramRegression, setGramRegression] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [gramsPercent, setGramsPercent] = useState(false);
  const [mealIndex, setMealIndex] = useState(0);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    onAuthStateChanged(auth, (prof) => {
      if (prof) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        //   const uid = user.uid;

        getInfo(`/profiles/${prof.uid}`, setUser, 0, setLoading);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      getInfo(`/profiles/${user.uid}/workouts`, setWorkouts, null, setLoading);
      getInfo(`/profiles/${user.uid}/meals`, setMeals, null, setLoading);
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

  const selectedVolume = (selected) => {
    setVolumeRegression(
      volumeRegression.map((reg, idx) =>
        selected.some((select) => select === String(idx))
      )
    );
  };

  const selectedCalories = (selected) => {
    setCalorieRegression(
      calorieRegression.map((reg, idx) =>
        selected.some((select) => select === String(idx))
      )
    );
  };

  const selectedGrams = (selected) => {
    setGramRegression(
      gramRegression.map((reg, idx) =>
        selected.some((select) => select === String(idx))
      )
    );
  };

  const chooseChartFormat = (eventKey) => {
    if (eventKey === "#/%") {
      setGramsPercent(false);
    }
    if (eventKey === "#/g") {
      setGramsPercent(true);
    }
  };

  const selectMeal = (eventKey) => {
    setMealIndex(Number(eventKey.substring(2)));
  };
  return (
    <>
      <SearchBar user={user} />
      <div className="flexbox">
        <section id="half">
          {totalVolumes.length > 0 && (
            <div className="container">
              <DropdownMultiselect
                options={[{ key: 0, label: "Volume" }]}
                name="Select Volume Regression"
                handleOnChange={selectedVolume}
              />
              <Graph
                dataPoints={[totalVolumes]}
                xAxis={"workout #"}
                yAxis={"volume (lbs)"}
                user={user}
                width={650}
                height={500}
                linearRegression={volumeRegression}
                title={"Graph of Volume"}
              />
            </div>
          )}
        </section>
        <section id="half">
          {meals[0] && (
            <div className="container">
                <SplitButton
                  id="dropdown-basic-button"
                  title="Units"
                  onSelect={chooseChartFormat}
                >
                  <Dropdown.Item href="#/%">%</Dropdown.Item>
                  <Dropdown.Item href="#/g">g</Dropdown.Item>
                </SplitButton>

                <SplitButton
                  id="dropdown-basic-button"
                  title="Select Meal"
                  onSelect={selectMeal}
                >
                  {meals.map((meal, idx) => (
                    <Dropdown.Item key={idx} href={`#/${idx}`}>{idx}</Dropdown.Item>
                  ))}
                  
                  
                </SplitButton>

              <PiChart
                chartData={[
                  ["protien", meals[mealIndex].totalProteins],
                  ["carbs", meals[mealIndex].totalCarbs],
                  ["fats", meals[mealIndex].totalFats],
                ]}
                chartTotal={["grams", meals[mealIndex].totalGrams]}
                user={user}
                width={650}
                height={500}
                title={"Meal one macros"}
                units={gramsPercent && "g"}
              />
            </div>
          )}
          {totalCalories.length > 0 && (
            <div className="container">
              <DropdownMultiselect
                options={[{ key: 0, label: "Calories" }]}
                name="Select Colorie Regression"
                handleOnChange={selectedCalories}
              />
              <Graph
                dataPoints={[totalCalories]}
                xAxis={"meal #"}
                yAxis={"calories"}
                user={user}
                width={650}
                height={500}
                linearRegression={calorieRegression}
                title={"Graph of Calories"}
              />{" "}
            </div>
          )}

          {totalGrams.length > 0 && (
            <div className="container">
              <DropdownMultiselect
                options={[
                  { key: 0, label: "Total" },
                  { key: 1, label: "Carbs" },
                  { key: 2, label: "Fats" },
                  { key: 3, label: "Proteins" },
                ]}
                name="Select Gram Regression"
                handleOnChange={selectedGrams}
              />
              <Graph
                dataPoints={[totalGrams, totalCarbs, totalFats, totalProteins]}
                xAxis={"meal #"}
                yAxis={"grams"}
                user={user}
                width={650}
                height={500}
                linearRegression={gramRegression}
                title={"Grams for Meals"}
              />{" "}
            </div>
          )}
        </section>
        {loading && <LoadingState/>}
      </div>
    </>
  );
}

export default Statistics;
