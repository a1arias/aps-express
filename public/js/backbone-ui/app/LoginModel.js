define('LoginModel', [
		'jquery',
		'underscore',
		'backbone'
	], function($, _, BackBone){
		var LoginModel;

		LoginModel = BackBone.Model.extend({
			url: '/login',
			defaults: {
				username: '',
				password: '',
				remember_me: false,
				login_failed: false,
				login_accepted: false
			}
		});

		return LoginModel;
});