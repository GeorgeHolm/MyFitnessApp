import http.client

def firstBetween (string, startingString, endingString): #This function return whatever is between the starting string and ending string based off of an original string
    idx = [i for i in range(len(string)) if string.startswith(startingString, i)]
    if len(idx) > 0:
        ret = exerciseHTML[idx[0]+ len(startingString):].split(endingString)[0]
        return ret
    return False

def requestHTML(reqName):
    conn = http.client.HTTPSConnection("www.acefitness.org")
    conn.request("GET", reqName)
    r1 = conn.getresponse()
    print(r1.status, r1.reason)
    data1 = r1.read()  # This will return entire content.
    # The following example demonstrates reading data in chunks.
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

for idx in range(30):
    OUTPUT = requestHTML("/resources/everyone/exercise-library/" + str(idx) + "/")
    linkIndexes = [i for i in range(len(OUTPUT)) if OUTPUT.startswith('"', i)]
    if len(linkIndexes) > 1: 
        print(OUTPUT[linkIndexes[0] + 1:linkIndexes[1]])
        newLink = OUTPUT[linkIndexes[0] + 1:linkIndexes[1]]
        exerciseHTML = requestHTML(newLink)
        #From here all of the information I want on a given exercise is on exerciseHTML
        #Things I can grab, Exercise Title, Body parts, equipment, instructions, relative difficulty
        exerciseTitle = firstBetween(exerciseHTML,'exercise-hero__title">', '<' )
        exerciseBodyPart = firstBetween(exerciseHTML, '<dd>', '<')
        if exerciseTitle and exerciseBodyPart:
            print(exerciseTitle+  " " + exerciseBodyPart)