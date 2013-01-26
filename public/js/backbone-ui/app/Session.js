define('Session', [
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){
	var Session;

	var _isAuthed = false,
		_sessionId = '';

	function getCookies(){
		var cookies = {};
		var all = document.cookie;
		if(all === ""){
			return cookies // return an empty string
		}
		var list = all.split('; ');
		for(var i = 0; i<list.length; i++){
			var cookie = list[i];
			var p = cookie.indexOf('=');
			var name = cookie.substring(0, p);
			var value = cookie.substring(p+1);
			value = decodeURIComponent(value);
			cookies[name] = value;
		}
		return cookies;
	}

	Session = {
		initialize: function(){
			var cookies = getCookies();
			debugger;
			if(ENV.WEBSTORAGE_ENABLED){
				sessionStorage.setItem('sessionId', cookies['sid']);
			} else {
				Session.sessionId = cookies['sid'];
			}
		},
		create: function(){
			return _.extend({}, this)
		},
		isAuthed: function(){ return _isAuthed; },
		getItem: function(item){ 
			if(ENV.WEBSTORAGE_ENABLED){
				return sessionStorage.getItem(item);
			} else {
				return Session[item];
			}
		},
		setItem: function(item, obj){
			if(ENV.WEBSTORAGE_ENABLED){
				sessionStorage.setItem(item,obj);
			} else {
				Session[item] = obj;
			}
		},
		removeItem: function(item){
			if(ENV.WEBSTORAGE_ENABLED){
				sessionStorage.removeItem(item);
			} else {
				delete Session[item];
			}	
		}
	};

	return Session;
});