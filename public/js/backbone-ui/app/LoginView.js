define('LoginView', [
	'jquery',
	'underscore',
	'backbone',
	'text!../../../login',
	'UserModel'
	], function($, _, BackBone, tpl, model){
		var LoginView;
		
		LoginView = BackBone.View.extend({
			initialize: function(){
				this.template = _.template(tpl);
			},

			render: function(){
				$(this.el).html(this.template);
				return this;
			},

			events: {
				'click #loginbtn': 'processLogin', 
			},

			processLogin: function(e){
				e.preventDefault();

				var u = {};

				u.email = $.trim(this.$el.find('#email').val());
				u.password = $.trim(this.$el.find('#password').val());

				debugger;
				this.model.save(u);
			}
		});

		return LoginView;
});