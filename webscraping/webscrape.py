import http.client
import json

def find_between(text, start, end):
    start_idx = text.find(start)
    if start_idx == -1:
        return None
    start_idx += len(start)
    end_idx = text.find(end, start_idx)
    if end_idx == -1:
        return None 
    return text[start_idx:end_idx]

def requestHTML(reqName):
    conn = http.client.HTTPSConnection("www.acefitness.org")
    conn.request("GET", reqName)
    r1 = conn.getresponse()
    print(r1.status, r1.reason)
    data1 = r1.read() 
    conn.request("GET",  reqName)
    r1 = conn.getresponse()
    OUTPUT = ""
    with open('file.txt', 'w') as file:
        file.write("")
    while chunk := r1.read(200):
        with open('file.txt', 'a') as file:
            file.write(repr(chunk)[2:-1])
            file.close()
    with open('file.txt', 'r') as file:
        OUTPUT = file.read()
        formatted_output = OUTPUT.replace('\\n', '\n').replace('\\t', '\t').replace('\\r', '')
        file.close()
    with open('file.txt', 'w') as file:
        file.write(formatted_output)
        file.close()
    return OUTPUT


def parseExercise(idx):
    OUTPUT = requestHTML("/resources/everyone/exercise-library/" + str(idx) + "/")
    linkIndexes = [i for i in range(len(OUTPUT)) if OUTPUT.startswith('"', i)]
    if len(linkIndexes) > 1: 
        newLink = OUTPUT[linkIndexes[0] + 1:linkIndexes[1]]
        exerciseHTML = requestHTML(newLink)
        
        exerciseTitle = find_between(exerciseHTML,'exercise-hero__title">', '<' )
        exerciseBodyPart = find_between(exerciseHTML, '<dd>', '<')
        exerciseEquipment = find_between(exerciseHTML, 'Equipment:</dt>\\r\\n\\t\\t<dd>', '</dd>')
        exerciseImage = find_between(exerciseHTML, "<div class=\"exercise-hero__image\" style=\"background-image: url(\\'", "\\'")
        steps = []

        if exerciseTitle and exerciseBodyPart and exerciseEquipment:
            stepNumber = 1

            while ("<h2>Step " + str(stepNumber)) in exerciseHTML:
                currentStep = find_between(exerciseHTML, "<h2>Step " + str(stepNumber) + "</h2>\\r\\n<p>", "<")
                if not currentStep:
                    currentStep = find_between(exerciseHTML, "<h2>Step " + str(stepNumber) + "&gt;</h2>\\r\\n<p>", "<") #alternate step format, has >  character after Step #
                steps.append(currentStep)
                stepNumber = stepNumber + 1

            return {
                "name" : exerciseTitle,
                "bodyParts" : exerciseBodyPart,
                "equipment" : exerciseEquipment,
                "steps" : steps,
                "image" : exerciseImage
                }
    return None    

exercises = []

for idx in range(400):
    exercise = parseExercise(idx)
    if exercise:
        exercises.append(exercise)


dictionary = {
    "exercises" : exercises
}
json_object = json.dumps(dictionary, indent=4)

with open("exercises.json", "w") as outfile:
    outfile.write(json_object)