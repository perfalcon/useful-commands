**NodeJs**

Package json

author,
description,
keywords,
version

version : Major.Minor.Patch

~ --> update to latest patch
^ --> update to latest functionalities with patches(if any)
Patch --> bug fixes with backward compatability
Minor --> new functionalities with backward compatability
Major --> New Functionalites without backward compatability(breaking changes)

==
Node Js:
a javascript runtime to write backend programs in js.

some of the main modules it has:
    HTTP: a module that acts as a server
    File System: a module that reads and modifies files
    Path: a module for working with directory and file paths
    Assertion Testing: a module that checks code against prescribed constraints

Express - another module runs between nodejs and front web application.
handles application routing, directs users to the correct page based on their interaction with application.
--
var app = express();
app.get('/',function(req, res){
  res.send('Hello Express');
});

Serve an HTML File
to send a file 
use: res.sendFile(absolute-Path)
__dirname : gives path of the application.

Serve Static Assests
middleware .. how to use the files from one of a project directory
app.use(path, middlewareFunction)
middleware-function ==> express.static(path)
app.use(express.static(__dirname+"/public"));



