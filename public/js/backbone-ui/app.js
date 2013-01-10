define('app', [
	'jquery',
	'underscore',
	'backbone',
	'Router',
	'EventDispatcher',
	'bootstrap'
], function($, _, Backbone, Router, EventDispatcher){

	var app;

	// this creates make the event channel available to all views.
	// not sure whether to use this, or a global object
	//Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

	function initialize(){

		// for some reason, Instantiating EventDispatcher doesn't
		// produce the desired outcome
		//UI.eventDispatcher = new EventDispatcher();
		
		//UI.eventDispatcher = _.extend({}, Backbone.Events);

		UI.eventDispatcher = EventDispatcher.create();

		UI.router = new Router();

		Backbone.history.start();
	};

	function uninitialize(){
		_ed.destroy();
	}

	app = {
		initialize: initialize,
		uninitialize: uninitialize
	};

	return app;
});