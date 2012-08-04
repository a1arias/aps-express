var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	hash = require('../lib/pass').hash;

var ns = hash('foobar', function(err, salt, hash){
	if(err) err;
	UserSchema.salt = salt;
	UserSchema.hash = hash
});

var UserSchema = new Schema({
	name: { type: String, index: true, lowercase: true },
	salt: { type: String },
	hash: { type: String }
});

var UserModel = mongoose.model('User', UserSchema);

exports.User = UserModel;