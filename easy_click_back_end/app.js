/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var settings = require('./settings');
var MongoStore = require('connect-mongo')(express);
var partials = require('express-partials');
var flash = require('connect-flash');
var mongodb = require('./models/db');
var app = express();

// Configuration
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.bodyParser({}));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: settings.cookieSecret,
    store: new MongoStore({
      db: settings.db
    })
  }));
  app.use(express.static(__dirname + '/public'));
  app.use(flash());
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure(function() {
  app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
  });
  app.use(function(req, res, next) {
    var err = req.flash('error');
    if (err.length) res.locals.error = err;
    else res.locals.error = null;
    next();
  });
  app.use(function(req, res, next) {
    var succ = req.flash('success');
    if (succ.length) res.locals.success = succ;
    else res.locals.success = null;
    next();
  });
});

var mDatabase;
mongodb.openDatabase(function(err, db){
  if(err){
    console.log(err);
    process.exit(1);
  }
  mDatabase = db;
});

app.all('*', function(req, res, next) {
  req.database = mDatabase;
  next();
});

routes(app);

app.listen(80);
console.log("Express server started in %s mode", app.settings.env);
