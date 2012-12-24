define('Router', [
	'jquery',
	'underscore',
	'backbone',
	'HeaderView',
	'HomeView',
	'_404View',
	'LoginView',
	'LoginModel',
	'UserNewView',
	'UserModel',
	'UserListView',
	'PortalView'
], function($, _, BackBone, 
		HeaderView, HomeView, 
		_404View, LoginView, LoginModel, 
		UserNewView, UserModel, UserListView, 
		PortalView
	){
		var AppRouter,
			initialize;

		AppRouter = BackBone.Router.extend({
			routes: {
				'': 'home',
				'!/home': 'home',
				'!/users/new': 'newUser',
				'!/users': 'listUsers',
				'!/users/:id': 'showUser',
				'!/login': 'login',
				'!/portal': 'showPortal',
				'*poo': '_404'
			},

			initialize: function(){
				this.elms = {
					'page-content': $('.page-content')
				};
				
				var that = this, model, view;
				model = new LoginModel();
				this.headerView = view = new HeaderView({model: model});

				view.model.on('loginSuccess', function(){
					delete view; that.navigate('#!/portal', {trigger: true, replace: true});
				});

				$('header').hide()
					.html(this.headerView.render().el)
					.fadeIn('slow');

				$('footer').fadeIn('slow');
			},

			login: function(){
				this.headerView.select();
				if(!this.loginView){
					this.loginView = new LoginView();
				}

				var model, view;
				model = new LoginModel();
				view = new LoginView({model: model});

				this.elms['page-content'].html(view.render().el);
			},

			home: function(){
				this.headerView.select('home-menu');
				if(!this.homeView){
					this.homeView = new HomeView();
				}
				this.elms['page-content'].html(this.homeView.render().el);
			},

			_404: function(){
				this.headerView.deselect('home-menu');
				if(!this._404View){
					this._404View = new _404View();
				}
				this.elms['page-content'].html(this._404View.render().el);
			},

			newUser: function(){
				var that = this, model, view;

				this.headerView.deselect('home-menu');

				model = new UserModel();
				view = new UserNewView({model: model});

				this.elms['page-content'].html(view.render().el);
				
				view.on('back', function(){
					delete view;
					that.navigate('#!/users', {trigger: true});
				});

				view.model.on('save-success', function(id){
					delete view;
					//that.navigate('#!/users/'+id, {trigger: true});
					that.navigate('#!/login', {trigger: true});
				});
			},

			listUsers: function(){
				var that = this;

				this.headerView.select('list-menu');

				if(!this.userListView){
					this.userListView = new UserListView();
				}
				this.userListView.render(function(){
					that.elms['page-content'].html(that.userListView.el);
				});
			},

			showUser: function(){
				// TODO: navigate...
			},

			showPortal: function(){
				var that = this, model, view;

				this.headerView.select('portal-menu');

				//model = new PortalModel();
				//view  = new PortalView({model: model});
				view  = new PortalView();

				this.elms['page-content'].html(view.render().el);
			}
		});
	
	return AppRouter;
});