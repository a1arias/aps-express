var hash = require('./lib/pass').hash,
	Users = require('./models/users').User,
	Articles = require('./models/articles').Article;

var users = exports.users = {};
var articles = exports.articles = {};

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

articles.all = function(fn){
	Articles.find({}, function(err, docs){
		if(!err){
			return fn(null, docs);
		} else {
			return fn(err, null);
		}
	});
};

articles.creatOne = function(article, fn){
	var a = new Article();
	a.title = article.title,
	a.content = article.content;
	a.createDate = Date.now;

	a.save();

	return fn(null, a);
};