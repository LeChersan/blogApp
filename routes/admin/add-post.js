var express = require('express');
var router = express.Router();

/* GET add post. */
router.get('/', function(req, res, next) {
  res.render('admin/add-post', { title: 'Add post' });
});

module.exports = router;