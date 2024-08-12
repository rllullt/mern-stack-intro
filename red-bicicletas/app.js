const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tokensRouter = require('./routes/tokens');
const bicicletasRouter = require('./routes/bicicletas');
const bicicletasAPIRouter = require('./routes/api/bicicletas');
const usuariosAPIRouter = require('./routes/api/usuarios');

const store = new session.MemoryStore;

const app = express();
app.use(session({
  cookie: { maxAge: 240 * 60 * 60 * 1000 },  // 240 hrs
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_bicis_!!!***!",!",!",!",123123',  // cualquier string
}));

/**
 * Get database from environment and store in Express
 */
const mongoDB = process.env.DATABASE_URL || 'mongodb://localhost/red_bicicletas';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Login steps
app.get('/login', function(req, res) {
  res.render('session/login');
});

app.post('/login', function(req, res, next) {
  // passport
});

app.get('/logout', function(req, res) {
  res.redirect('/');
});

app.get('/forgotPassword', function(req, res) {
  // nada
});

app.post('/forgotPassword', function(req, res) {
  // nada
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/token', tokensRouter);
app.use('/bicicletas', bicicletasRouter);
app.use('/api/bicicletas', bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
