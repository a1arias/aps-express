define('app', [
	'jquery',
	'underscore',
	'backbone',
	'Router',
	'bootstrap'
], function($, _, Backbone, Router){
	function initialize(){
		var app = new Router();
		Backbone.history.start();
	}

	return {
		initialize: initialize
	};
});