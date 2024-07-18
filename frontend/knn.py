import numpy as Math
import requests
from dotenv import load_dotenv
import os
from pprint import pprint






def euclidean_distance(r1, r2):
    dot_product = Math.dot(r1, r2)
    magnitude_A = Math.linalg.norm(r1)
    magnitude_B = Math.linalg.norm(r2)
    cosine_similarity = dot_product / (magnitude_A * magnitude_B)
    return cosine_similarity
def get_neighbors(train, test_row, num_neighbors):
    distances = list()
    for train_row in train:
        dist = euclidean_distance(test_row, train_row)
        distances.append((train_row, dist))
    distances.sort(key=lambda tup: tup[1])
    distances.reverse()
    neighbors = list()
    for i in range(num_neighbors):
        neighbors.append(distances[i][0])
    return neighbors


def predict_classification(train, test_row, num_neighbors):
    neighbors = get_neighbors(train, test_row, num_neighbors)
    
    #Have neighbors, grab their distances
    rating = test_row * 0.0
    for neighbor in neighbors:
        rating += neighbor
    rating = rating/num_neighbors
    
    return rating

def n_recommendations(train, target_index, num_neighbors):
    # Normalize the matrix by subtracting the mean rating of each user
    mean_user_rating = Math.mean(train, axis=1).reshape(-1, 1)
    normalized_matrix = train - mean_user_rating
    prediction = predict_classification(normalized_matrix, train[target_index], num_neighbors)
    #Have prediction, have target index, now need to return indexes of the best choices
    choice_array = []
    for i in range(len(prediction)):
        if train[target_index][i] == 0:
            choice_array.append((prediction[i], i))
    sorted_choices = sorted(choice_array)
    sorted_choices.reverse()
    return sorted_choices


load_dotenv()

VITE_BACKEND_LINK = os.getenv('VITE_BACKEND_LINK')
print(VITE_BACKEND_LINK)

profiles = requests.get(VITE_BACKEND_LINK + "/profiles").json()
workouts = requests.get(VITE_BACKEND_LINK + "/workouts").json()
meals = requests.get(VITE_BACKEND_LINK + "/meals").json()


rows= len(profiles)
meal_cols = len(meals)
workout_cols = len(workouts)


workout_row = [0] * workout_cols
workout_matrix = Math.array([workout_row] * rows)

meal_row = [0] * meal_cols
meal_matrix = Math.array([meal_row] * rows)


#Now I have an initialized matrix, I need to edit each value to their corresponding user score
like_strength = 4
touch_strength = 1

for workout_index in  range(workout_cols):
    workout = workouts[workout_index]
    profileTouch = workout['profileTouch']
    profileLikes = workout['profileLikes']
    #loop through profileLikes and profileTouch and add corresponding Values
    for profile_index in range(rows):
        profile = profiles[profile_index]
        if any(element['profileId'] == profile['id'] for element in profileTouch):
            workout_matrix[profile_index][workout_index] += touch_strength
        if any(element['profileId'] == profile['id'] for element in profileLikes):
            workout_matrix[profile_index][workout_index] += like_strength
       
        
pprint(workout_matrix)
    
 
 
#Find recommendations for georgeholm@meta.com based off of 3 closest neighbors

recs_with_values = n_recommendations(workout_matrix, 0, 3)

recs_indexes = []

#convert matrix elements to a list that gets returned to database for user to recommend
for rec_element in recs_with_values:
    recs_indexes.append(workouts[rec_element[1]]['id'])
    pprint(workouts[rec_element[1]])
    
pprint(recs_indexes)


