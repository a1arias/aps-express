define('UserModel', [
	'jquery',
	'underscore',
	'backbone'
], function($, _, BackBone){
	var UserModel;

	UserModel = BackBone.Model.extend({
		idAttribute: '_id',
		url: function(){
			var url;

			debugger;
			// if the model is new, post to /users
			if(this.isNew()){
				url = '/users/'
			} else {
				// else get the collection
				url = '/users.json'
			}
			return url
		},
		defaults: {
			first_name: '',
			last_name: '',
			email: '',
			password1: '',
			password2: '',
			dob: new Date()
		},
		validate: function(attrs){
			var fields,
				i,
				len,
				firstNameLen,
				lastNameLen,
				errors = {};

			if(!attrs._silent){
				fields = [
					'first_name', 
					'last_name', 
					'email', 
					'password1', 
					'password2',
					'dob'
				];
				for(i=0, len=fields.length; i<len; i++){
					if(!attrs[fields[i]]){
						errors[fields[i]] = fields[i] + ' required';
					}
				}

				debugger;
				firstNameLen = (attrs.first_name) ? attrs.first_name.length : null;
				if(!firstNameLen || (firstNameLen < 2 || firstNameLen > 100)){
					errors.firstName = 'invalid first name';
				}

				lastNameLen = (attrs.last_name) ? attrs.last_name : null;
				if(lastNameLen < 2 || lastNameLen > 100){
					errors.lastName = 'invalid last name';
				}

				password1Len = (attrs.password1) ? attrs.password1.length : null;
				if(password1Len < 7){
					errors.password1 = 'invalid password';
				}
				if(!attrs.password1 == attrs.password2){
					errors.password2 = 'confirm password does not match'
				}

				if(!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(attrs.email))){
					errors.email = "invalid email";
				}

				if(_.keys(errors).length){
					return {
						errors: errors
					};
				}

			}
		}
	});

	return UserModel;
});