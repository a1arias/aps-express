define('EventDispatcher', [
	'underscore',
	'backbone'
], function(_, Backbone){
	
	var EventDispatcher,
		Channel = {};

	function create(){
		Channel = _.extend({}, Backbone.Events);
		return Channel;
	};

	function destroy(){
		Channel.off();
	};

	EventDispatcher = {
		create: create,
		destroy: destroy
	}

	return EventDispatcher;
});