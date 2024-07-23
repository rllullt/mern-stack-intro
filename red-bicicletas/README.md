# Red Bicicletas

Red Bicicletas is created from a Coursera course called «Desarrollo del lado servidor: NodeJS, Express y MongoDB» by the Austral University.

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

## API

The API can be tested via curl. Examples:

Create a Bicicleta:
```
curl -X POST http://localhost:3000/api/bicicletas/create -d code=3 -d color='morado' -d modelo='pista' -d lat=-34.595198 -d lng=-58.379914
```

Create a Usuario:
```
curl -X POST http://localhost:3000/api/usuarios/create -d nombre='Spiderman'
```


## Steps taken for creating the MVC Bicicletas (old, now it uses persistence wwith Mongo and a biciclietaContainer is no longer needed)

1. Install nodemon with npm.
1. Create an npm script within the package.json, below ''start'', called ''devstart'', and get up the server with nodemon.
1. *Create the bicicleta model (classes were used).
1. *Create the bicicletaContainer model, for containing bicicletas.
1. Add bicicletas to the bicicletaContainer collection, near the center of the map.
1. Create the controller for bicicletas.
1. Create the router for bicicletas.
1. Create methods for listing, creating, eliminating and updating bicicletas by the web.
1. Review the process of the operations created.

## Testing

The jasmine package is used.
Tests are contained in the ‘spec’ folder.