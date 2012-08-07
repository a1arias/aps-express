define('HomeView', [
	'jquery',
	'underscore',
	'backbone',
	'text!../../../'
], function($, _, BackBone, tpl){
	var HomeView;

	Homeview = BackBone.View.extend({

		initialize: function(){
			this.template = _.template(tpl);
		},

		render: function(){
			$(this.el).html(this.template());
			return this;
		}
	});

	return Homeview;
});