var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactRouter = require('./routes/contact');
var postDetailRouter = require('./routes/post-detail');
var postsListRouter = require('./routes/posts-list')

//routes Admin//
var indexAdminRouter = require('./routes/admin/index');
var addPostAdminRouter = require('./routes/admin/add-post');
var viewEditAdminRouter = require('./routes/admin/view-edit');
var graphsAdminRouter = require('./routes/admin/graphs')

//routes API//
var apiUsersRouter = require('./routes/api/users/index');
var apiPostsRouter = require('./routes/api/posts/index');

var app = express();

//connection db//
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://LeChersan:ljORc9t58Krfv41m@cluster0.dxehy.mongodb.net/blogApp?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
})

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function callback(){
    console.log('Connected to db')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contact', contactRouter);
app.use('/post-detail', postDetailRouter);
app.use('/posts-list', postsListRouter);
app.use('/admin/', indexAdminRouter);
app.use('/admin/add-post', addPostAdminRouter);
app.use('/admin/view-edit', viewEditAdminRouter);
app.use('/admin/graphs', graphsAdminRouter);
app.use('/api/users/', apiUsersRouter);
app.use('/api/posts/', apiPostsRouter);

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
