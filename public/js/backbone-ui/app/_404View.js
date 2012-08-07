define('_404View', [
	'jquery',
	'underscore',
	'backbone',
	'text!../tpl/poo.html'
], function($, _, BackBone, tpl){
	var _404View;

	_404View = BackBone.View.extend({
		initialize: function(){
			this.template = _.template(tpl);
		},
		render: function(){
			$(this.el).html(this.template());
			return this;
		}
	});

	return _404View;
});