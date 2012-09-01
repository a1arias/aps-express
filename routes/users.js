var Users = require('../models/users').User,
	db = require('../db'),
	restrict = require('../lib/auth').restrict;

exports.name = 'users';

exports.restrict = restrict;

exports.before = function(req, res, next){
	// id is not really an id, bootloader:43 causes this
	var id = req.params._id;
	if(!id || id == 'new') return next();

	Users.findOne({_id: id}, function(err, doc){
		debugger;
		if(err){
			return next(new Error(err));
		}
		req.user = doc;
		next();
	});

	// process.nextTick(function(){
	// 	req.user = db.users[id];
	// 	if(!req.user) return next (new Error('User not found'));
	// 	next();
	// });
};

exports.new = function(req, res){
	switch(req.format){
		case 'json':
			// TODO: implement validation and reply with proper resopose
			res.json({});
		case 'html':
		default:
			if(req.xhr){
				res.render('bbui/users/new')
			} else {
				res.render('users/new', {
					title: 'Create user'
				});
			}
	}
};

exports.create = function(req, res){
	debugger;
	// TODO: save to mongodb
	console.log('user %s saved', req.body.first_name);
	
	var newUser = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		dob: req.body.dob,
		password: req.body.password1
	};

	db.users.createUser(newUser, function(err, user){
		if(!err){
			res.render('users/show', {
				user: user,
				title: 'User details'
			});
		} else {
			throw new Error(err);
		}
	});
};

exports.list = function(req, res){
	Users.find({}, function(err, docs){
		if(!err){
			if(req.params.format){
				var format = req.params.format;
				switch(format){
					case 'json':
						res.send(docs);
						break;
					default:
						res.render('users/list', {
							title: 'User List',
							users: docs
						});
						break;
				};
			} else {
				if(req.xhr){
					res.render('bbui/users/list', {
						users: docs,
						title: 'User list'
					});
				} else {
					res.render('users/list', {
						users: docs,
						title: 'User list'
					});
				}
			}
		} else {
			throw new Error(err);
		}
	});
};

exports.show = function(req, res){	
	if(req.params.format){
		if(req.user){
			switch(req.params.format){
				case 'json':
				default:
					res.send(req.user);
			};
		} else {
			throw new Error('no user');
		}
	} else {
		if(req.user){
			res.render('users/show', {
				user: req.user,
				title: 'User details'
			});
		} else {
			throw new Error('no user');
		}
	}
};

exports.edit = function(req, res){
	res.render('users/edit', {
		user: db.users['tj'],
		title: 'Edit user'
	});
};

exports.destroy = function(req, res){
	db.users.destroy(req.params._id, function(err, poo){
		debugger;
		res.status(200);
		res.redirect('/users');
	});
};