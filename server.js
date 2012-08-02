
/**
 * Module dependencies.
 */

var express = require('express')
  //, routes = require('./routes')
  , db = { users: [] }
  , http = require('http');

var app = express();

// resourse route factory method
app.resource = function(path, obj){
  this.get(path, obj.index);
  this.get(path + '/:a..:b.:format?', function(req, res){
    var a = parseInt(req.params.a, 10),
      b = parseInt(req.params.b, 10),
      format = req.params.format;
    obj.range(req, res, a, b, format);
  });
  this.get(path + '/:id', obj.show);
  this.del(path + '/:id', obj.destroy);
};

// fake records
// TODO: setup mongodb and use real records
var users = [
  { name: 'tj' },
  { name: 'ciaran' },
  { name: 'aaron' },
  { name: 'guillermo' },
  { name: 'simon' },
  { name: 'tobi' }
];

// fake controller
// TODO: move this off to routes and setup a loader
var User = {
  index: function(req, res){
    res.send(users);
  },
  show: function(req, res){
    res.send(users[req.params.id] || { error: 'Cannot find user' });
  },
  destroy: function(req, res){
    var id = req.params.id;
    var destroyed = id in users;
    delete users[id];
    res.send(destroyed ? 'destroyed' : 'Cannot find user');
  },
  range: function(req, res, a, b, format){
    var range = users.slice(a, b + 1);
    switch (format) {
      case 'json':
        res.send(range);
        break;
      case 'html':
      default:
        var html = '<ul>' + range.map(function(user){
          return '<li>' + user.name + '</li>';
        }).join('\n') + '</ul>';
        res.send(html);
        break;
    }
  }
};

// resourse route loader
app.resource('/users', User);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.directory(__dirname + '/public'));
});

debugger;
require('./bootloader')(app, db);

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//app.get('/', routes.index);

// last non-error-handling middleware used 
// is assumed to be 404
app.use(function(req, res, next){
  debugger;
  if(req.accepts('html')){
    res.status(404);
    res.render('404', { 
      url: req.url,
      title: 'Not Found'
    });
    return;
  }
  if(req.accepts('json')){
    res.send({error: 'Not found'});
    return;
  }
});

app.use(function(err, req, res, next){
  debugger;
  if(404 == err.status){
    res.statusCode = 404;
    res.send('Cant find the file, sorry!');
  } else {
    next(err);
  }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
