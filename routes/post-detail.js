var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {
    var postId = req.params.id
  res.render('post-detail', { title: 'Post Detail', idPost: postId});
});

module.exports = router;