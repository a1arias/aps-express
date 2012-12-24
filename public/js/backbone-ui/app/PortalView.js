define('PortalView', [
	'jquery',
	'underscore',
	'backbone',
	'text!../../../portal'
	], function($, _, BackBone, tpl){
		var PortalView;

		PortalView = BackBone.View.extend({
			initialize: function(){
				this.template = _.template(tpl);
			},

			render: function(){
				$(this.el).html(this.template);
				return this;
			}
		});

		return PortalView;
});