var hash = require('./pass').hash,
	users = require('../db').users;

/*
 * Restrict middleware is injected into the route 
 * during bootstrap.
 */
exports.restrict = function(req, res, next){
	// supposing a user object means the users already authenticated
	if(req.session.user){
		next();
	} else {
		if(!req.xhr){
			//res.redirect('../login');
			
			// setting this header causes the browser to prompt for user/pass
			res.header('WWW-Authenticate', 'Basic realm="Admin Area"');
			res.send(401, 'Authorization Required');
		} else {
			var format = req.params.format || null;
			switch (format)
			{
				case 'json':
					res.send({ success: false, msg: 'Auth Required' }, 401);
					break;
				default:
					// if we get here we must have asked for a template
					// however this may introduce a security vulnerability
					next();
					break;
					
			}
			//res.redirect('/login');
		}
	}
};

exports.authenticate = function(email, pass, fn){
	
	if(!module.parent) console.log('authenticating %s:%s', email, pass);
	// query the db for the given username
	users.oneByEmail(email, function(err, doc){
		try
		{
			if(!err){
				
				// apply the same algorithm to the POSTed password, applying
				// the hash against the pass/salt, if there is a match we
				// found the user

				// WARNING: the following method returns the entire doc
				// including the hash and salt, to be stored in 
				// the user's redis session store. 
				// This is probably really bad

				hash(pass, doc.salt, function(err, hash){
					if(err) return fn(err);
					if(hash == doc.hash) return fn(null, doc);
					fn(new Error('invalid password'));
				});
			}
		} catch (ex) {
			console.log(ex);
			return fn(new Error('cannot find user'));
		}

	});
};