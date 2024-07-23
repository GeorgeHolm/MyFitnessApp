
const Knn = (user, workouts, meals, profiles) => {
  const magnitude = (vect) => {
    let magVal = 0;
    vect.forEach((num) => {
      magVal += num * num;
    });

    return Math.sqrt(magVal);
  };
  const distance = (r1, r2) => {
    const dot = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
    let vectDotProduct = dot(r1, r2);
    let magR1 = magnitude(r1);
    let magR2 = magnitude(r2);

    let cosinSimilarity = vectDotProduct / (magR1 * magR2);
    return cosinSimilarity;
  };

  const getNeighbors = (train, userRow, numNeighbors) => {
    let distances = [];
    train.map((trainRow) => {
      let dist = distance(userRow, trainRow);
      distances.push([trainRow, dist]);
    });

    distances = distances.sort((a, b) => b[1] - a[1]);
    let neighbors = [];

    for (let i = 0; i < numNeighbors; i++) {
      neighbors.push(distances[i][0]);
    }
    return neighbors;
  };

  const predictClassifications = (train, userRow, numNeighbors) => {
    let neighbors = getNeighbors(train, userRow, numNeighbors);
    //Average out the nearest Neighbors

    let rating = userRow.map((x) => 0.0);

    neighbors.map((neighbor) => {
      neighbor.map((rate, idx) => {
        rating[idx] += rate;
      });
    });

    rating = rating.map((rate) => rate / numNeighbors);
    return rating;
  };

  const nRecommendations = (train, targetIndex, numNeighbors) => {
    // normalize each vector in matrix to make sure every element has equal importance
    let userMags = train.map((element) => magnitude(element));
    let normalizedMatrix = train.map((row, idx) =>
      row.map((element) => element / userMags[idx])
    );
    let prediction = predictClassifications(
      normalizedMatrix,
      normalizedMatrix[targetIndex],
      numNeighbors
    );
    let choiceArray = [];
    prediction.map((pred, idx) => {
      if (train[targetIndex][idx] == 0) {
        choiceArray.push([pred, idx]);
      }
    });
    let sortedChoices = choiceArray.sort((a, b) => b[0] - a[0]);
    return sortedChoices;
  };

  const rows = profiles.length;
  const mealCols = meals.length;
  const workoutCols = workouts.length;

  let workoutMatrix = Array(rows).fill(Array(workoutCols).fill(0));
  let mealMatrix = Array(rows).fill(Array(mealCols).fill(0));

  //initialized empty matrix of correct size, need to edit each values to corresponding score

  const likeStrength = 4;
  const touchStrength = 1;

  workoutMatrix = workoutMatrix.map((row, profileIndex) => {
    let profile = profiles[profileIndex];
    return row.map((element, workoutIndex) => {
      let workout = workouts[workoutIndex];
      let retVal = 0;
      if (workout.profileTouch.some((pair) => pair.profileId === profile.id)) {
        retVal += touchStrength;
      }
      if (workout.profileLikes.some((pair) => pair.profileId === profile.id)) {
        retVal += likeStrength;
      }
      return retVal;
    });
  });

  mealMatrix = mealMatrix.map((row, profileIndex) => {
    let profile = profiles[profileIndex];
    return row.map((element, mealIndex) => {
      let meal = meals[mealIndex];
      let retVal = 0;
      if (meal.profileTouch.some((pair) => pair.profileId === profile.id)) {
        retVal += touchStrength;
      }
      if (meal.profileLikes.some((pair) => pair.profileId === profile.id)) {
        retVal += likeStrength;
      }
      return retVal;
    });
  });

  //Find recommendation for user based off of 3 closest neighbors

  let profIndex = 0;

  profiles.forEach((prof, idx) => {
    if (prof.id === user.id) {
      profIndex = idx;
    }
  });

  let recsWithValuesWorkouts = nRecommendations(workoutMatrix, profIndex, 3);
  let recsWithValuesMeals = nRecommendations(mealMatrix, profIndex, 3);

  let recsIndexesWorkouts = [];
  let recsIndexesMeals = [];

  recsWithValuesWorkouts.map((recElement) => {
    recsIndexesWorkouts.push(workouts[recElement[1]].id);
  });
  recsWithValuesMeals.map((recElement) => {
    recsIndexesMeals.push(workouts[recElement[1]].id);
  });

  let returnValue = {
    workoutRecsId: recsIndexesWorkouts,
    workoutRecsIndex: recsWithValuesWorkouts,
    mealRecsId: recsIndexesMeals,
    mealRecsId: recsWithValuesMeals,
  };

  return returnValue;
};

export default Knn;
