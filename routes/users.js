var db = require('../db'),
	restrict = require('../lib/auth').restrict;

exports.name = 'users';

exports.restrict = restrict;

exports.before = function(req, res, next){
	var id = req.params.user_id;
	if(!id) return next();

	// TODO: wire up mongoose here too
	process.nextTick(function(){
		req.user = db.users[id];
		if(!req.user) return next (new Error('User not found'));
		next();
	});
};

exports.list = function(req, res){
	res.render('users/list', {
		users: db.users,
		title: 'User list'
	});
};