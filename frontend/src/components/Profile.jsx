import { useState, useEffect } from "react";
import "./Profile.css";
import SearchBar from "./SearchBar";
import ProfileEdit from "./ProfileEdit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import getInfo from "./Requests";
import Badge from "./Badge";
import useEffectAfter from "./useEffectAfter";
function Profile() {
  const [user, setUser] = useState();
  const [currentEdit, setCurrentEdit] = useState(false);
  const [stats, setStats] = useState({
    workoutsPosted: [0, ""],
    mealsPosted: [0, ""],
    postsLiked: [0, ""],
    maxBench: [0, ""],
    maxSquat: [0, ""],
    maxDeadlift: [0, ""],
  });

  useEffect(() => {
    onAuthStateChanged(auth, (prof) => {
      if (prof) {
        getInfo(`/profiles/${prof.uid}`, setUser, 0);
      }
    });
  }, []);

  const editProf = () => {
    setCurrentEdit(true);
  };

  useEffectAfter(() => {
    if (user) {

      let maxBench = 0;
      let maxSquat = 0;
      let maxDeadlift = 0;

      //Find the maxes for the user
      user.workouts?.forEach((workout) => {
        workout.exercises.forEach((exercise) => {
          if (
            exercise.name.toLowerCase() === "chest press" ||
            exercise.name.toLowerCase() === "bench press"
          ) {
            exercise.sets.forEach((set) => {
              if (set.weight > maxBench) {
                maxBench = set.weight;
              }
            });
          }

          if (
            exercise.name.toLowerCase() === "back squat" ||
            exercise.name.toLowerCase() === "squat"
          ) {
            exercise.sets.forEach((set) => {
              if (set.weight > maxSquat) {
                maxSquat = set.weight;
              }
            });
          }

          if (exercise.name.toLowerCase() === "deadlift") {
            exercise.sets.forEach((set) => {
              if (set.weight > maxDeadlift) {
                maxDeadlift = set.weight;
              }
            });
          }
        });
      });

      let workoutLevel = "tan";
      let mealLevel = "tan";
      let postLevel = "tan";
      let benchLevel = "tan";
      let squatLevel = "tan";
      let deadliftLevel = "tan";

      if (maxBench >= 225) {
        benchLevel = "silver";
      }
      if (maxBench >= 315) {
        benchLevel = "gold";
      }

      if (maxSquat >= 315) {
        squatLevel = "silver";
      }
      if (maxSquat >= 405) {
        squatLevel = "gold";
      }

      if (maxDeadlift >= 405) {
        deadliftLevel = "silver";
      }
      if (maxDeadlift >= 495) {
        deadliftLevel = "gold";
      }

      if (user.workouts?.length >= 20) {
        workoutLevel = "silver";
      }
      if (user.workouts?.length >= 100) {
        workoutLevel = "gold";
      }

      if (user.meals?.length >= 20) {
        mealLevel = "silver";
      }
      if (user.meals?.length >= 100) {
        mealLevel = "gold";
      }

      if (user.likedWorkouts?.length + user.likedMeals?.length >= 200) {
        postLevel = "silver";
      }
      if (user.likedWorkouts?.length + user.likedMeals?.length >= 1000) {
        postLevel = "gold";
      }

      setStats({
        workoutsPosted: [user.workouts?.length, workoutLevel],
        mealsPosted: [user.meals?.length, mealLevel],
        postsLiked: [
          user.likedWorkouts?.length + user.likedMeals?.length,
          postLevel,
        ],
        maxBench: [maxBench, benchLevel],
        maxSquat: [maxSquat, squatLevel],
        maxDeadlift: [maxDeadlift, deadliftLevel],
      });
    }
  }, [user]);

  return (
    <>
      <SearchBar user={user} />
      <div className="flexbox">
        {currentEdit && (
          <ProfileEdit user={user} setUser={setUser} close={setCurrentEdit} />
        )}

        <div id="left">
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
          <button onClick={editProf} className="edit">
            Edit Profile
          </button>
          <p>Name: {user?.name}</p>
          <p>Sex: {user?.sex}</p>
          <p>Age: {user?.age}</p>
          <p>Bio: {user?.bio}</p>
        </div>
        <div id="right" className="flexbox">
          <Badge
            className={"col"}
            color={stats.workoutsPosted[1]}
            awardTitle={"Workout Beast"}
            awardSubtitle={`Workouts Posted: ${stats.workoutsPosted[0]}`}
          />
          <Badge
            className={"col"}
            color={stats.mealsPosted[1]}
            awardTitle={"Healthy Eater"}
            awardSubtitle={`Meals Posted: ${stats.mealsPosted[0]}`}
          />
          <Badge
            className={"col"}
            color={stats.postsLiked[1]}
            awardTitle={"Supporter"}
            awardSubtitle={`Posts Liked: ${stats.postsLiked[0]}`}
          />
          <Badge
            className={"col"}
            color={stats.maxBench[1]}
            awardTitle={"Bench Boss"}
            awardSubtitle={`Max Bench: ${stats.maxBench[0]} lbs`}
          />
          <Badge
            className={"col"}
            color={stats.maxSquat[1]}
            awardTitle={"Squat Slayer"}
            awardSubtitle={`Max Squat: ${stats.maxSquat[0]} lbs`}
          />
          <Badge
            className={"col"}
            color={stats.maxDeadlift[1]}
            awardTitle={"Deadlift Demon"}
            awardSubtitle={`Max Deadlift: ${stats.maxDeadlift[0]} lbs`}
          />
        </div>
      </div>
    </>
  );
}

export default Profile;
