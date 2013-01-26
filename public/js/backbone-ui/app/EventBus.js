define('EventBus', [
	'underscore',
	'backbone'
], function(_, Backbone){
	
	var EventBus,
		Channel = {};

	function create(){
		Channel = _.extend({}, Backbone.Events);
		return Channel;
	};

	function destroy(){
		Channel.off();
	};

	EventBus = {
		create: create,
		destroy: destroy
	}

	return EventBus;
});