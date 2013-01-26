define('app', [
	'jquery',
	'underscore',
	'backbone',
	'Router',
	'EventBus',
	'Session',
	'bootstrap'
], function($, _, Backbone, Router, EventBus, Session){

	var app;

	debugger;

	// this creates make the event channel available to all views.
	// not sure whether to use this, or a global object
	//Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

	function initialize(){

		ENV = {};
		App.EventBus = EventBus.create();
		App.Router = new Router();

		// check if HTML 5 storage API is available
		if(typeof(Storage) !== 'undefined'){
			// If so, store the session data in sessionStorage
			ENV.WEBSTORAGE_ENABLED = true;
		} else {
			// If not, store the session data in a global object
			ENV.WEBSTORAGE_ENABLED = false;
		}

		Backbone.history.start();

		Session.initialize();
		
	};

	function uninitialize(){
		App.EventBus.destroy();
	}

	app = {
		initialize: initialize,
		uninitialize: uninitialize
	};

	return app;
});