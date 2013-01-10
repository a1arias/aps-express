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
	'ArticleListView'
], function($, _, BackBone, 
		HeaderView, HomeView, 
		_404View, LoginView, LoginModel, 
		UserNewView, UserModel, UserListView, 
		ArticleListView
	){
		var AppRouter;

		AppRouter = BackBone.Router.extend({
			routes: {
				'': 'home',
				'!/home': 'home',
				'!/users/new': 'newUser',
				'!/users': 'listUsers',
				'!/users/:id': 'showUser',
				'!/login': 'login',
				'!/articles': 'listArticles',
				'*poo': '_404'
			},

			initialize: function(){
				this.elms = {
					'page-content': $('.page-content')
				};
				
				var that = this, model, view;
				model = new LoginModel();

				// TODO: add secure cookie parser

				this.headerView = view = new HeaderView({model: model});

				view.model.on('loginSuccess', function(){
					//delete view; that.navigate('#!/portal', {trigger: true, replace: true});
					session = model.session;
					debugger;
					// TODO: re-render header to display logout link
					that.navigate('#!/home');
				});

				UI.eventDispatcher.on('API401', function(){
					// calling navigate doesn't change the view.
					//that.navigate('#!/login');
					that.login();
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

				view.model.on('loginSuccess', function(id){
					delete view;
					// TODO: navigate to previous url
					//that.navigate('#!/users/'+id, {trigger: true});
					that.navigate('#!/home', {trigger: true});
				});
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

			listArticles: function(){
				var that = this, model, view;
				//var viewModel = new ArticleModel();

				this.headerView.select('article-menu');

				//view  = new ArticleListView(model: viewModel);
				view  = new ArticleListView();

				this.elms['page-content'].html(view.render().el);
			}
		});
	
	return AppRouter;
});