import os
print("Python Program to print list the files in a directory.")
Direc = input(r"Enter the path of the folder: ")
print(f"Files in the directory: {Direc}")
files = os.listdir(Direc)
# Filtering only the files.
files = [f for f in files if os.path.isfile(Direc+'/'+f)]
print(*files, sep="\n")