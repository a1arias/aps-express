var hash = require('./pass').hash,
	users = require('../db').users;

// TODO: WTF? move this to user create
hash('foobar', function(err, salt, hash){
	if(err) throw err;
	users.tj.salt = salt;
	users.tj.hash = hash;
});

exports.restrict = function(req, res, next){
	if(req.session.user){
		next();
	} else {
		req.session.error = 'Access denied!';
		res.redirect('/login');
	}
};

exports.authenticate = function(name, pass, fn){
	debugger;
	if(!module.parent) console.log('authenticating %s:%s', name, pass);
	var user = users[name];
	// query the db for the given username
	if(!user) return fn(new Error('cannot find user'));
	// apply the same algorithm to the POSTed password, applying
	// the hash against the pass/salt, if there is a match we
	// found the user
	hash(pass, user.salt, function(err, hash){
		if(err) return fn(err);
		if(hash == user.hash) return fn(null, user);
		fn(new Error('invalid password'));
	});
};