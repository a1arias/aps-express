
/**
 * Module dependencies.
 */

var express = require('express')
	//, routes = require('./routes')
	RedisStore = require('connect-redis')(express),
	hash = require('./lib/pass').hash,
	auth = require('./lib/auth'),
	restrict = auth.restrict,
	authenticate = auth.authenticate,
	mongoose = require('mongoose'),
	//db = require('./db'),
	http = require('http'),
	jade = require('jade');

var app = module.exports = express();

// res.message() method 
// which stores messages in the session
app.response.message = function(msg){
	var sess = this.req.session;
	sess.messages = sess.messages || [];
	sess.messages.push(msg);
	return this;
};

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('TripToItalyComingSoon'));
	app.use(express.session({
		key: 'sid',
		store: new RedisStore({ pass: 'PushStrangeWorld' }),
		secret: 'TripToItalyComingSoon',
		cookie: {httpOnly: false, maxAge: 900000 }
	}));
	app.use(function(req, res, next){
		var msgs = req.session.messages || [];
		res.locals.messages = msgs;
		res.locals.hasMessages = !! msgs.length;
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
	mongoose.connect('mongodb://localhost/aps-express-dev');
});

app.configure('production', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	mongoose.connect('mongodb://localhost/aps-express-prod');
});



// TODO: wtf are you putting the header template in an xrh request for?
app.get('/header', function(req, res){
	//debugger;
	
	//var isAuthed = (req.session.user) ? true : false;
	if(req.xhr){
		if(req.session.user){}
		res.render('bbui/header', {
			locals: {
				session: req.session
			}
		});
	} else {
		res.render('404', {
			title: '404 - Not Found',
			url: req.url,
			status: 404
		});
	}
});

app.get('/portal', function(req, res){
	if(req.xhr){
		res.render('bbui/portal', {
			title: 'portal',
			locals: {
				data: {}
			}
		});
	} else {
		res.render('404', {
			title: '404 - Not Found',
			url: req.url,
			status: 404
		});
	}
});

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
	
	// TODO: do something better like redirect the user
	if(req.session.user){
		res.redirect('/');
	}

	// if it gets this far, the session is not valid, login
	if(req.xhr){
		res.render('bbui/users/login', {
			title: 'Login',
			error: req.session.error,
			message: req.session.success	
		})
	} else {
		res.render('login', {
			title: 'Login',
			error: req.session.error,
			message: req.session.success
		});
	}
});

app.post('/login', function(req, res){
	authenticate(req.body.email, req.body.password, function(err, user){
		if(user){
			// Regenerate session when signing in to prevent fixation
			req.session.regenerate(function(){
				// Store the user's primary key
				// in the session store to be retreived,
				// or in this case the entire user object
				req.session.user = user;

				// TODO: generate secure auth cookie
				
				if(req.xhr){
					res.json({
						success: true,
						session: req.session.user
					}, 200);
				} else {
					res.redirect('/restricted');
				}
			});
		} else {
			req.session.error = err;
			if(req.xhr){
				res.json({
					success: false,
					err: err.toString()
				}, 200)
			} else {
				res.redirect('login');
			}
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
