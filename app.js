const express = require('express');
const https = require('https');
const fs = require('fs');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/user');
const ContrasenyaLogin = 'contraseñaSegura';
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

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/crea', (req, res) => {
  res.render('crea');
});

app.post('/crea', async (req, res) => {
  const { nomLogin, ContrasenyaLogin, role } = req.body;

  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/GP1');
    const user = new User({ nomLogin, ContrasenyaLogin, role });
    await user.save();
    mongoose.connection.close(); // cerrar la conexión a la base de datos
    res.status(200).send('Usuari registrat correctament. <a href="/">Inici de sessió</a>');
    
  } catch (error) {
    if (error.name === 'MongoNetworkError') {
      console.error('Error de connexió a la base de dades');
      res.status(500).send('Error de connexió a la base de dades <a href="/">Inici de sessió</a>');
    } else {
      console.error(`Error en registrar usuari: ${error}`);
      res.status(500).send('Error en registrar usuari: <a href="/">Inici de sessió</a>');
    }
  }
});

app.post('/comproba', async (req, res) => {
  const { nomLogin, ContrasenyaLogin, role } = req.body;

  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/GP1');
    const user = await User.findOne({ nomLogin, role });
    if (!user) {
      res.status(404).send('Usuari no existent <a href="/">Inici de sessió</a>');
    } else {
      const validContrasenyaLogin = await bcrypt.compare(ContrasenyaLogin, user.ContrasenyaLogin);
      if (validContrasenyaLogin) {
        res.redirect('/calendari');
      } else {
        res.status(401).send('Contrasenya incorrecta <a href="/">Inici de sessió</a>');
      }
    }
  } catch (error) {
    console.error(`Error en autenticar usuari: ${error}`);
    res.status(500).send('Error en autenticar usuari <a href="/">Inici de sessió</a>');
  }
});

app.use(function(req, res, next) {
  const error = new Error('Pàgina no trobada <a href="/">Inici de sessió</a>');
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
  console.log('Es en HTTPS y el protocolo es 443 por si acaso');
  console.log('https://localhost/calendari');
});

module.exports = app;
