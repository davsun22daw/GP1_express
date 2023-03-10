var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/Formulari', function(req, res,  next) {
  res.render('formulari', { titol: 'Formulari de Activitats' });
});

module.exports = router;
