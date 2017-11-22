f = open("data.csv", "r")
data = f.read()
f.close()
my_db = data.split('\n')
print(my_db[0])
dic = []
