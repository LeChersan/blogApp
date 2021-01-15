var express = require('express');
var router = express.Router();

/* GET graphs. */
router.get('/', function(req, res, next) {
  res.render('admin/graphs', { title: 'Graphs' });
});

module.exports = router;