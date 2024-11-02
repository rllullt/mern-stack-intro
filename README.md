# mern-stack-intro

The  MERN stack  is a web development framework made up of the stack of MongoDB, Express, React.js, and Node.js. It is one of the several variants of the  MEAN stack.

## Red Bicicletas

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


## Dotenv

The dotenv package is used to load the environment variables from the .env file.


## Authentication

It is implemented an authentication system based on JWT: JASON Web Token, with the jasonwebtoken library and sessions express-session.

Some resources are only accessible via login with email and password.
When a user logs in the application through the API, the app returns a token that the client must preserve and append in every request he does, to verify his authenticity.

Users can also access via Google OAuth and Facebook API OAuth (for example, for mobile applications that use our API, they can log in with Facebook. Google API OAuth and Facebook web app OAuth are not implemented ---yet?---).


## Usage analytics: New Relic

The app uses New Relic for analytics.

The installation of this package is a bit different today than how it is explained in the Coursera course.
Now, it is important to have some environment variables and add the suffix `--experimental-loader=newrelic/esm-loader.mjs` when starting up the application.

Running the app in Heroku involves a special Procfile, because the app is in /red-bicicletas sub folder and also the New Relic metrics.
The Procfile looks like this:
```
web: npm start --prefix red-bicicletas --experimental-loader=newrelic/esm-loader.mjs
```
