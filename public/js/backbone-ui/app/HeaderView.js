define('HeaderView', [
	'jquery',
	'underscore',
	'backbone',
	'text!../tpl/header.html'
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

			var u = {};

			u.email = $.trim(this.$el.find('#email').val());
			u.password = $.trim(this.$el.find('#password').val());

			debugger;
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

	return HeaderView;
});