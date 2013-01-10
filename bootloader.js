var express = require('express'),
	//vm = require('vm'),
	auth = require('./lib/auth'),
	fs = require('fs');

// module.exports = function(app, db){
// 	var dir = __dirname + '/routes';

// 	// grab the list of routes
// 	fs.readdirSync(dir).forEach(function(file){
// 		var str = fs.readFileSync(dir + '/' + file, 'utf8');
// 		var context = { app: app, db: db };

// 		for(var key in global) context[key] = global[key];

// 		vm.runInNewContext(str, context, file);
// 	});
// };

module.exports = function(parent, options){
	var verbose = options.verbose;
	var dir = __dirname + '/routes';
	fs.readdirSync(dir).forEach(function(name){
		verbose && console.log('\n 	%s/%s:', dir,name);
		var obj = require(dir + '/' + name),
			name = obj.name || name,
			restricted = obj.restricted || null,
			prefix = obj.prefix || '',
			app = express(),
			method,
			path;

		debugger;

		if(obj.engine) app.set('view engine', obj.engine);
		// app.set('views', __dirname + '/views/' + name);
		// console.log(app.set('views'));

		if(obj.before){
			path = '/' + name + '/:_id.:format?';
			app.all(path, obj.before);
			verbose && console.log('		ALL %s -> before', path);
			path = '/' + name + '/:_id/*';
			app.all(path, obj.before);
			verbose && console.log('		ALL %s -> before', path);
		}

		// generate routes based on the exported methods
		for(var key in obj){
			// reserved exports
			if(~['name', 'prefix', 'engine', 'before', 'restricted'].indexOf(key)) continue;

			switch(key){
				case 'index':
					method = 'get';
					path = '/';
					break;
				case 'new':
					method = 'get';
					path = '/' + name + '/new';
					break;
				case 'create':
					method = 'post';
					path = '/' + name;
					break;
				case 'show':
					method = 'get';
					path = '/' + name + '/:_id' + '.:format?';
					break;
				case 'list':
					method = 'get';
					// to pluralize the path append 's'
					path = '/'  + name + '.:format?';
					break;
				case 'edit':
					method = 'get';
					path = '/' + name + '/:_id/edit';
					break;
				case 'update':
					method = 'put';
					path = '/' + name + '/:_id' + '.:format?';
					break;
				case 'destroy':
					method = 'delete';
					path = '/' + name + '/:_id' + '.:format?';
					break;
				default:
					throw new Error('unrecognized route: ' + name + '.' + key);
			}

			path = prefix + path;
			// if(restrict){
			// 	// new users need to be able to create accounts
			// 	// TODO: optimize this
			// 	if(key == 'new' || key == 'create'){
			// 		app[method](path, obj[key]);
			// 	} else {
			// 		app[method](path, restrict, obj[key]);
			// 	}
			// } else {
			// 	app[method](path, obj[key]);
			// }
			if(restricted){
				if(~restricted.routes.indexOf(key)){
					// restricted.route: for some reason that's the name
					// of the middleware method.
					app[method](path, restricted.route, obj[key]);
				} else {
					app[method](path, obj[key]);
				}
			} else {
				app[method](path, obj[key]);
			}

			verbose && console.log('		%s %s -> %s', method.toUpperCase(), path, key);
		}

		// mount the app
		parent.use(app);
	});
};