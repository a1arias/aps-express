define('UserCollection', [
	'jquery',
	'underscore',
	'backbone',
	'UserModel'
	], function($, _, BackBone, UserModel){
		var UserCollection;

		UserCollection = BackBone.Collection.extend({
			model: UserModel,
			url: '/users.json'
		});

		return UserCollection;
});