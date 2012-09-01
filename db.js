var hash = require('./lib/pass').hash,
	Users = require('./models/users').User;

// TODO: WTF? move this to user create
// hash('foobar', function(err, salt, hash){
// 	if(err) throw err;
// 	users.tj.salt = salt;
// 	users.tj.hash = hash;
// });

// var users = exports.users = {
// 	tj: {name: 'tj'}
// };

var users = exports.users = {};

users.all = function(){
	Users.find({}, function(err, docs){
		if(!err){
			debugger;
			return docs;
		} else {
			throw new Error(err);
		}
	});
};

users.createUser = function(user, fn){
	var u = new Users();
	u.first_name = user.first_name;
	u.last_name = user.last_name;
	u.email = user.email;
	u.dob = user.dob;
	hash(user.password, function(err, salt, hash){
		if(err) return fn(err);

		u.salt = salt;
		u.hash = hash;
		u.save();

		return fn(null, u);
	});
};

users.destroy = function(id, fn){
	Users.remove({_id: id}, function(err, poo){
		if(err) return fn(err, null);
		return fn(null, poo);
	});
};

users.oneByEmail = function(email, fn){
	Users.findOne({ email: email }, function(err, doc){
		if(err) return fn(err, null);
		return fn(null, doc);
	});
};

exports.users;