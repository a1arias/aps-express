define('HomeView', [
	'jquery',
	'underscore',
	'backbone',
	'text!../tpl/index.html'
], function($, _, BackBone, tpl){
	var HomeView;

	HomeView = BackBone.View.extend({

		initialize: function(){
			this.template = _.template(tpl);
		},

		render: function(){
			$(this.el).html(this.template());
			return this;
		}
	});

	return HomeView;
});