var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")
const session = require("express-session")
var http = require('http').Server(app);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');
var booksRouter = require('./routes/books');
var bookaboutRouter = require('./routes/bookabout');
var bookstandRouter = require('./routes/bookstand');
var buyerorderRouter = require('./routes/buyerorder');
var sellerorderRouter = require('./routes/sellerorder');
var recordRouter = require('./routes/record');
var recordChart = require('./routes/recordChart');
var payRouter = require('./routes/pay');

var app = express();
var io = require('socket.io')(http);

io.on('connection', function (socket) {
  //接收数据
  socket.on('login', function (obj) {
    console.log(obj.username);
    // 发送数据
    socket.emit('relogin', {
      msg: `你好${obj.username}`,
      code: 200
    });
  });
});

//配置session
app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 4
  },
  // store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/react实战" })
}));

//配置跨域
app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:3000"],
  credentials: true
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/book', booksRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);
app.use('/login', loginRouter);
app.use('/bookabout', bookaboutRouter);
app.use('/bookstand', bookstandRouter);
app.use('/buyerorder', buyerorderRouter);
app.use('/sellerorder', sellerorderRouter);
app.use('/record', recordRouter);
app.use('/chart', recordChart);
app.use('/pay', payRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
