requirejs.config({
	appDir: '../app',
	baseUrl: 'js/backbone-ui/app',
	dir: '../../backbone-ui-build',

	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'bootstrap': {
			deps: ['jquery'],
			exports: 'bootstrap'
		}
	},

	optimize: 'none',

	paths: {
		'app': '../app',
		'jquery': '../lib/jquery',
		'bootstrap': '../lib/bootstrap',
		'underscore': '../lib/underscore',
		'backbone': '../lib/backbone',
		'text': '../lib/text',
		'moment': '../lib/moment'
	},
	
	config: {
		text: {
			onXhr: function(xhr, url){
				xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			}
		}
	},

	modules: [
		{
			name: 'main',
			exclude: ['jquery']
		}
	]
});

require(['app'], function(app){
	UI = {};
	UI = app;

	UI.initialize();
});