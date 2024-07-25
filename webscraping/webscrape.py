import http.client
import json

def find_index(text, goal, start_idx = 0):
    goal_length = len(goal)
    for idx in range(start_idx, len(text)):
        if text[idx: idx + goal_length] == goal:
            return idx
    return -1


def replace_all(text, find_text, replaced_text):
    if text == None:
        return None
    return_string = ''
    split_text = text.split(find_text)
    return_string = split_text[0]
    for chunk in split_text[1:]:
        return_string += replaced_text +  chunk
    
    return return_string
        

def find_between(text, start, end):
    start_idx = find_index(text, start)
    if start_idx == -1:
        return None
    start_idx += len(start)
    end_idx = find_index(text, end, start_idx)
    if end_idx == -1:
        return None 
    return text[start_idx:end_idx]

def requestHTML(reqName):
    conn = http.client.HTTPSConnection("www.acefitness.org")
    conn.request("GET", reqName)
    r1 = conn.getresponse()
    print(r1.status, r1.reason)
    OUTPUT = repr(r1.read())[2:-1]
    formatted_output = OUTPUT.replace('\\n', '\n').replace('\\t', '\t').replace('\\r', '\r')
    return formatted_output

def special_character_remove(input_text):
    ret = replace_all(input_text,  "&rdquo;", "\"")
    ret = replace_all(ret, "&ldquo;", "\"")
    ret = replace_all(ret, "&reg;", "")
    ret = replace_all(ret, "&nbsp;", " ")
    ret = replace_all(ret, "&ndash;", "-")
    ret = replace_all(ret, "&frac12;", "1/2")
    return ret


def parse_exercise(idx):
    OUTPUT = requestHTML("/resources/everyone/exercise-library/" + str(idx) + "/")
    linkIndexes = [i for i in range(len(OUTPUT)) if OUTPUT.startswith('"', i)] #Find wherever the quotes are
    if len(linkIndexes) > 1: 
        newLink = OUTPUT[linkIndexes[0] + 1:linkIndexes[1]]
        exerciseHTML = requestHTML(newLink)
        
        exerciseTitle = find_between(exerciseHTML,'exercise-hero__title">', '<' )
        exerciseTitle = special_character_remove(exerciseTitle)



        exerciseBodyPart = find_between(exerciseHTML, '<dd>', '<')
        exerciseBodyPart = special_character_remove(exerciseBodyPart)


        
        exerciseEquipment = find_between(exerciseHTML, 'Equipment:</dt>\r\n\t\t<dd>', '</dd>')
        exerciseEquipment = special_character_remove(exerciseEquipment)


        
        exerciseImage = find_between(exerciseHTML, "<div class=\"exercise-hero__image\" style=\"background-image: url(\\'", "\\'")
        steps = []

        if exerciseTitle and exerciseBodyPart and exerciseEquipment:
            stepNumber = 1

            while ("<h2>Step " + str(stepNumber)) in exerciseHTML:
                currentStep = find_between(exerciseHTML, "<h2>Step " + str(stepNumber) + "</h2>\r\n<p>", "<")
                if not currentStep:
                    currentStep = find_between(exerciseHTML, "<h2>Step " + str(stepNumber) + "&gt;</h2>\r\n<p>", "<") #alternate step format, has >  character after Step #
                currentStep = special_character_remove(currentStep)

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

def main():
    exercises = []
    for idx in range(400):
        exercise = parse_exercise(idx)
        if exercise:
            exercises.append(exercise)
    with open("exercises.json", "w") as outfile:
        json.dump({"exercises": exercises}, outfile, indent=4)
    
if __name__ == "__main__":
    main()