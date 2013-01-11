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

				var u = {},
					that = this;

				u.email = $.trim(this.$el.find('#email').val());
				u.password = $.trim(this.$el.find('#password').val());

				this.model.save(u,{
					silent: false,
					sync: true,
					success: function(model, res){
						if(res && res.errors){
							that.renderErrMsg(res.errors);
						} else {
							model.trigger('loginSuccess');
						}
					},
					error: function(model, res){
						if(res && res.errors){
							that.renderErrMsg(res.errors);
						} else if(res.status === 404) {
							// TODO: show 404 view
						} else if(res.status === 500) {
							// TODO: show 500 view
						}
					}
				});
			}
		});

		return LoginView;
});