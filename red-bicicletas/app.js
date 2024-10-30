require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tokensRouter = require('./routes/tokens');
const bicicletasRouter = require('./routes/bicicletas');
const bicicletasAPIRouter = require('./routes/api/bicicletas');
const usuariosAPIRouter = require('./routes/api/usuarios');
const authAPIRouter = require('./routes/api/auth');
const usuario = require('./models/usuario');

const jwt = require('jsonwebtoken');

let store;
if (process.env.NODE_ENV === 'development') {
  store = new session.MemoryStore;
}
else {
  // This cancels memory leaks in production
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });
  store.on('error', error => {
    assert.ifError(error);
    assert.ok(false);
  });
}

const app = express();

app.set('secretKey', 'clave secreta muajajaja');

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
const mongoDB = process.env.MONGO_URI || 'mongodb://localhost/red_bicicletas';
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
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.render('session/login', {info});
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get('/forgotPassword', function(req, res) {
  res.render('session/forgotPassword');
});

app.post('/forgotPassword', function(req, res, next) {
  usuario.findOne({ email: req.body.email }).then(user => {
    if (!user) return res.render('session/forgotPassword', {info: {message: 'Email no existe'}});

    user.resetPassword().then(() => {
      console.log('session/forgotPasswordMessage');
    }).catch(err => {
      return next(err);
    })
  }).catch(err => {
    return next(err);
  })
  res.render('session/forgotPasswordMessage');
});

app.get('/resetPassword/:token', function (req, res, next) {
  Token.findOne({ token: req.params.token }).then(token => {
    if (!token) return res.status(400)
      .send({ type: 'not-verified', msg: 'No existe un usuario con este Token. Verifique que su token no haya expirado' });

    User.findById(token._userId).then(user => {
      if (!user) return res.status(400).send({ msg: 'No existe un usuario asociado al token' });
      res.render('session/resetPassword', { errors: {}, user: user });
    }).catch(err => {
      console.log(err);
    });
  }).catch(err => {
    console.log(err);
  });
});

app.post('/resetPassword', function (req, res) {
  if (req.body.password !== req.body.confirm_password) {
    res.render('session/resetPassword', {
      errors: { confirm_password: { message: 'No coincide con el password ingresado' } },
      user: new User({ email: req.body.email })
    });
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    user.password = req.body.password;
    user.save(function (err) {
      if (err) {
        res.render('session/resetPassword', { errors: err.errors, user: new User({ email: req.body.email }) });
      } else {
        res.redirect('/login');
      }
    });
  });
});

/**
 * Asegura que el usuario esté logueado «cuando pase por acá»
 * Forma práctica de seguizar rutas
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function loggedIn(req, res, next) {
  if (req.user) {
    next();  // todo bien, contnúa a la siguiente capa de middleware
  } else {
    console.log('user not logged');
    res.redirect('/login');
  }
}

function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
    if (err) {
      res.json({ status: 'error', message: err.message, data: null });
    }
    else {
      req.body.userId = decoded.id;
      console.log('jwt verify: ' + decoded);
      next();
    }
  });
  console.log('req.headers["x-access-token"]:', req.headers['x-access-token']);
  console.log("req.app.get('secretKey'):", req.app.get('secretKey'));
}

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/token', tokensRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);  // primero se ejecuta el loggedIn. Usuario logueado -> sig. cód.

app.use('/api/auth', authAPIRouter);
app.use('/api/bicicletas', validateUser, bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});

app.get('/auth/undefined/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});

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
