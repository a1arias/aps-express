
/**
 * Module dependencies.
 */

var express = require('express')
	//, routes = require('./routes')
	RedisStore = require('connect-redis')(express),
	hash = require('./lib/pass').hash,
	auth = require('./lib/auth'),
	//mongoose = require('mongoose'),
	//db = require('./db'),
	http = require('http');

var app = module.exports = express();

// resource route factory method
// TODO: add PUT and POST methods to Edit and Create resources
// app.resource = function(path, obj){
// 	this.get(path, obj.index);
// 	this.get(path + '/:a..:b.:format?', function(req, res){
// 		var a = parseInt(req.params.a, 10),
// 			b = parseInt(req.params.b, 10),
// 			format = req.params.format;
// 		obj.range(req, res, a, b, format);
// 	});
// 	this.get(path + '/:id', obj.show);
// 	this.del(path + '/:id', obj.destroy);
// };

// res.message() method 
// which stores messages in the session
app.response.message = function(msg){
	var sess = this.req.session;
	sess.messages = sess.messages || [];
	sess.messages.push(msg);
	return this;
};

// fake records
// TODO: setup mongodb and use real records
// var users = [
// 	{ 
// 		tj: { name: 'tj' } 
// 	}, {
// 		ciaran: { name: 'ciaran' }	
// 	}
// 	{ name: 'ciaran' },
// 	{ name: 'aaron' },
// 	{ name: 'guillermo' },
// 	{ name: 'simon' },
// 	{ name: 'tobi' }
// ];
// var users = {
// 	tj: {name: 'tj'}
// };
//var users = db.users;

// fake controller
// TODO: move this off to routes and setup a loader
// var User = {
// 	index: function(req, res){
// 		res.send(users);
// 	},
// 	show: function(req, res){
// 		res.send(users[req.params.id] || { error: 'Cannot find user' });
// 	},
// 	destroy: function(req, res){
// 		var id = req.params.id;
// 		var destroyed = id in users;
// 		delete users[id];
// 		res.send(destroyed ? 'destroyed' : 'Cannot find user');
// 	},
// 	range: function(req, res, a, b, format){
// 		var range = users.slice(a, b + 1);
// 		switch (format) {
// 			case 'json':
// 				res.send(range);
// 				break;
// 			case 'html':
// 			default:
// 				var html = '<ul>' + range.map(function(user){
// 					return '<li>' + user.name + '</li>';
// 				}).join('\n') + '</ul>';
// 				res.send(html);
// 				break;
// 		}
// 	}
// };

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session({ 
		secret: 'test1234', 
		store: new RedisStore({ pass: 'PushStrangeWorld' }) 
	}));
	// session-persisted message middleware
	// app.use(function(req, res, next){
	// 	var err = req.session.error,
	// 			msg = req.session.success;
	// 	delete req.session.error;
	// 	delete req.session.success;
	// 	res.locals.message = '';
	// 	if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
	// 	if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
	// 	next();
	// });

	app.use(function(req, res, next){
		var msgs = req.session.messages || [];
		res.locals.messages = msgs;
		res.locals.hasMessages = !! msgs.length;
		/*
		 * this is the equivalent:
			res.locals({
				messages: msgs,
				hasMessages: !!msgs.length
			});
		 */
		req.session.messages = [];
		next();
	});
	//require('./bootloader')(app, db);
	require('./bootloader')(app, {verbose: !module.parent});
	// All additional routes must be loaded/resourced/defined after app.router
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(__dirname + '/public'));
	app.use(express.directory(__dirname + '/public'));
});


app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	//mongoose.connect('mongodb://localhost/aps-dev');
});

// resourse route loader
//app.resource('/users', User);

// hash('foobar', function(err, salt, hash){
// 	if(err) throw err;
// 	users.tj.salt = salt;
// 	users.tj.hash = hash;
// });

// // TODO: move this to use a real database
// function authenticate(name, pass, fn){
// 	if(!module.parent) console.log('authenticating %s:%s', name, pass);
// 	var user = users[name];
// 	// query the db for the given username
// 	if(!user) return fn(new Error('cannot find user'));
// 	// apply the same algorithm to the POSTed password, applying
// 	// the hash against the pass/salt, if there is a match we
// 	// found the user
// 	hash(pass, user.salt, function(err, hash){
// 		if(err) return fn(err);
// 		if(hash == user.hash) return fn(null, user);
// 		fn(new Error('invalid password'));
// 	});
// };

// // method to restrict access to a given route
// function restrict(req, res, next){
// 	if(req.session.user){
// 		next();
// 	} else {
// 		req.session.error = 'Access denied!';
// 		res.redirect('/login');
// 	}
// };

var restrict = auth.restrict,
	authenticate = auth.authenticate;

// simple test route to check auth middleware
app.get('/restricted', restrict, function(req, res){
	res.send('Wahoo! restricted area');
});

app.get('/logout', function(req, res){
	// destroy the user's session to log them out
	// will be re-created next request
	req.session.destroy(function(){
		res.redirect('/');
	});
});

app.get('/login', function(req, res){
	if(req.session.user){
		req.session.success = 'Authenticated as ' + req.session.user.name
			+ ' click to <a href="/logout">logout</a>.'
			+ ' You may now access <a href="/restricted">/restricted</a>.';
	}
	// if it gets this far, the session is not valid, login
	debugger;
	res.render('login', {
		title: 'Login',
		locals: {
			error: req.session.error,
			message: req.session.success
		}
	});
});

app.post('/login', function(req, res){
	debugger;
	authenticate(req.body.username, req.body.password, function(err, user){
		if(user){
			// Regenerate session when signing in to prevent fixation
			req.session.regenerate(function(){
				// Store the user's primary key
				// in the session store to be retreived,
				// or in this case the entire user object
				req.session.user = user;
				res.redirect('back');
			});
		} else {
			req.session.error = 'Authentication failed, please check your '
				+ ' username and password.'
				+ ' (use "tj" and "foobar")';
			res.redirect('login');
		}
	});
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

// if(!module.parent){
// 	http.createServer(app).listen(app.get('port'), function(){
// 		console.log("Express server listening on port " + app.get('port'));
// 	});
// }

if(!module.parent){
	app.listen(3000);
	console.log('Express started on port 3000');
}
