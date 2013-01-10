define('HeaderView', [
	'jquery',
	'underscore',
	'backbone',
	'text!../../../header'
], function($, _, Backbone, tpl){
	var HeaderView;

	HeaderView = Backbone.View.extend({
		initialize: function(){
			var ajaxLoader;

			this.template = _.template(tpl);

			$('body').ajaxStart(function(){
				ajaxLoader = ajaxLoader || $('.ajax-loader');
				ajaxLoader.show();
			}).ajaxStop(function(){
				ajaxLoader.fadeOut('fast');
			});

			$('#navbar').scrollspy();
		},
		render: function(){
			$(this.el).html(this.template());
			return this;
		},
		select: function(item){
			$('.nav li').removeClass('active');
			$('.' + item).addClass('active');
		},
		deselect: function(item){
			$('.nav li').removeClass('active');
		},
		events: {
			'click #hloginbtn': 'processLogin'
		},
		processLogin: function(e){
			e.preventDefault();

			var u = {},
				that = this;

			u.email = $.trim(this.$el.find('#email').val());
			u.password = $.trim(this.$el.find('#password').val());

			/* calling model.save POSTs the offered creds to the server
			 * for verification. If an HTTP code other than 2xx is returned,
			 * the error function is executed and the necessary event is
			 * triggered. A response code of 200 doesn't not mean successful 
			 * login. So, we have to check the returned object for errors
			 * in the success callback
			 */ 
			this.model.save(u,{
				silent: false,
				sync: true,
				success: function(model, res){
					// check for an error object
					if(res && res.err){
						that.renderErrMsg(res.err);
					} else {
						$('.dropdown.open .dropdown-toggle').dropdown('toggle');
						model.session = res.session;
						model.trigger('loginSuccess');
					}
				},
				error: function(model, res){
					debugger;
					switch(res.status){
						case 403:
							/* no need to use the event dispatcher. 
							 * Instead, call the renderErrMsg to display
							 * the returned error
							 */
							// UI.eventDispatcher.trigger('API403');
							that.renderErrMsg('Invalid login');
							break;
							// break;
						case 404:
							// UI.eventDispatcher.trigger('API404');
							// break;
						default:
							that.renderErrMsg(res.err);
							break;
					}
					// if(res && res.errors){
					// 	that.renderErrMsg(res.errors);
					// } else if(res.status === 404) {
					// 	// TODO: show 404 view
					// } else if(res.status === 500) {
					// 	// TODO: show 500 view
					// }
				}
			});
		},
		renderErrMsg: function(err){
			alert(err);
		}
	});

	return HeaderView;
});