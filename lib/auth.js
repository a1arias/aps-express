var hash = require('./pass').hash,
	users = require('../db').users;


exports.restrict = function(req, res, next){
	if(req.session.user){
		next();
	} else {
		req.session.error = 'Access denied!';
		res.redirect('/login');
	}
};

exports.authenticate = function(email, pass, fn){
	debugger;
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