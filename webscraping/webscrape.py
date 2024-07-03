import http.client
conn = http.client.HTTPSConnection("www.python.org")
conn.request("GET", "")
r1 = conn.getresponse()
print(r1.status, r1.reason)
data1 = r1.read()  # This will return entire content.
# The following example demonstrates reading data in chunks.
conn.request("GET", "")
r1 = conn.getresponse()
while chunk := r1.read(200):
    with open('file.txt', 'a') as file:
        file.write(repr(chunk)[2:-1])
        file.close()

with open('file.txt', 'r') as file:
    OUTPUT = file.read()
    formatted_output = OUTPUT.replace('\\n', '\n').replace('\\t', '\t')
    file.close()
with open('file.txt', 'w') as file:
    file.write(formatted_output)