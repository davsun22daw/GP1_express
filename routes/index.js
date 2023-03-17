var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/formulari', function(req, res,  next) {
  res.render('formulari', { titol: 'Formulari de Activitats' });
});

router.get('/calendari', function(req, res,  next) {
  res.render('calendari', { titol: 'Calendari' });
});

module.exports = router;
