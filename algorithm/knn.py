import numpy as Math

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
    
 
# Test distance function
user_item_matrix = Math.array([
    [4, 0, 0, 5, 1, 5, 2, 3, 0, 0, 0, 0],
    [5, 5, 4, 0, 0, 2, 4, 1, 0, 1, 3, 5],
    [0, 0, 0, 2, 4, 3, 2, 1, 5, 5, 3, 5],
    [0, 3, 0, 0, 5, 0, 0, 1, 2, 3, 5, 3],
    [5, 0, 4, 0, 0, 2, 1, 4, 2, 3, 0, 0],
    [0, 3, 0, 2, 5, 3, 4, 1, 5, 2, 4, 5],
    [0, 3, 0, 1, 5, 0, 0, 1, 2, 5, 1, 3],
    [4, 1, 4, 4, 0, 5, 1, 5, 4, 3, 1, 0],
])


test_matrix = Math.array([
    [1, 1, 2],
    [2, 2, 1],
    [2, 0, 0],
])

recs = n_recommendations(test_matrix, 2, 2)
print(recs)