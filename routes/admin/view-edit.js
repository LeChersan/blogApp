var express = require('express');
var router = express.Router();

/* GET viewEdit. */
router.get('/', function(req, res, next) {
  res.render('admin/view-edit', { title: 'ViewEdit' });
});

module.exports = router;