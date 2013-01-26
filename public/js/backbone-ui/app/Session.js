define('Session', [
	'jquery',
	'underscore'
], function($, _){
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
				SessionStore[sessionId] = cookies['sid'];
			}
		},
		create: function(){
			return _.extend({}, this)
		},
		destroy: function(){
			_isAuthed = false;
			_sessionId = '';
			this.clear();
		},
		isAuthed: function(){ return _isAuthed; },
		getItem: function(item){ 
			if(ENV.WEBSTORAGE_ENABLED){
				return sessionStorage.getItem(item);
			} else {
				return SessionStore[item];
			}
		},
		setItem: function(item, obj){
			if(ENV.WEBSTORAGE_ENABLED){
				sessionStorage.setItem(item,obj);
			} else {
				SessionStore[item] = obj;
			}
		},
		removeItem: function(item){
			if(ENV.WEBSTORAGE_ENABLED){
				sessionStorage.removeItem(item);
			} else {
				delete SessionStore[item];
			}
		},
		clear: function(){
			if(ENV.WEBSTORAGE_ENABLED){
				sessionStorage.clear();
			} else {
				delete SessionStore;
			}
		}
	};

	return Session;
});