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
  const { nomLogin, ContrasenyaLogin } = req.body;
  console.log(`User recibida en el backend: ${nomLogin}`);
  console.log(`Contraseña recibida en el backend: ${ContrasenyaLogin}`);

  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/GP1');
    // Crear una nueva instancia del modelo User
    const user = new User({ nomLogin, ContrasenyaLogin });
    
    // Guardar el nuevo usuario en la base de datos
    await user.save();
    
    // Enviar una respuesta al cliente indicando que el usuario ha sido registrado exitosamente
    res.status(200).send('Usuario registrado exitosamente');
    
  } catch (error) {
    // Manejar errores durante el registro del usuario
    console.error(`Error al registrar usuario: ${error}`);
    res.status(500).send('Error al registrar usuario');
  }
});

app.post('/comproba', async (req, res) => {
  const { nomLogin, ContrasenyaLogin } = req.body;

  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/GP1');
    const user = await User.findOne({ nomLogin });
    if (!user) {
      res.status(404).send('El usuario no existe');
    } else {
      const validContrasenyaLogin = await bcrypt.compare(ContrasenyaLogin, user.ContrasenyaLogin);
      if (validContrasenyaLogin) {
        // Redirigir al usuario a la página de inicio si la autenticación es exitosa
        res.redirect('/calendari');
      } else {
        res.status(401).send('Contraseña incorrecta');
      }
    }
  } catch (error) {
    console.error(`Error al autenticar usuario: ${error}`);
    res.status(500).send('Error al autenticar usuario');
  }
});

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
