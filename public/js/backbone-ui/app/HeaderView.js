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
		}
	});

	return HeaderView;
});