# mern-stack-intro

The  MERN stack  is a web development framework made up of the stack of MongoDB, Express, React.js, and Node.js. It is one of the several variants of the  MEAN stack.

## To create the Express application

It can be used the `express-generator` package.

`express red-bicicletas --view=pug`

## Virtual environment

A virtual environment can be created with python, following the steps:
```
python3 -m venv env
source ./env/bin/activate
pip3 install nodeenv
nodeenv --python-virtualenv --node=lts
```

## Nodemon

Node package that lets to automatically update the content of the project when changing the files.

## Leaflet

Quick map creator used for adding a map fast.


## Steps taken for creating the MVC Bicicletas

1. Install nodemon with npm.
1. Create an npm script within the package.json, below ''start'', called ''devstart'', and get up the server with nodemon.
1. *Create the bicicleta model (classes were used).
1. *Create the bicicletaContainer model, for containing bicicletas.
1. Add bicicletas to the bicicletaContainer collection, near the center of the map.
1. Create the controller for bicicletas.
1. Create the router for bicicletas.
1. Create methods for listing, creating, eliminating and updating bicicletas by the web.
1. Review the process of the operations created.