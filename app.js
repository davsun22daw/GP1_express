const express = require('express');
const https = require('https');
const fs = require('fs');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();


const privateKey = fs.readFileSync('private-key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(function(req, res, next) {
  const error = new Error('Página no encontrada');
  error.status = 404;
  next(error);
});

// middleware para manejar los demás errores
app.use(function(err, req, res, next) {
  // establecer el estado de respuesta y renderizar la página de error
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});


httpsServer.listen(443, () => {
  console.log('Es en HTTPS y el protocolo es 443 porsi acaso');
  console.log('https://localhost/calendari');
});

module.exports = app;
