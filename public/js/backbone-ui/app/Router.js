define('Router', [
	'jquery',
	'underscore',
	'backbone',
	'Session',
	'HeaderView',
	'HomeView',
	'_404View',
	'LoginView',
	'LoginModel',
	'UserNewView',
	'UserModel',
	'UserListView',
	'ArticleListView'
], function($, _, BackBone, Session, 
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
				
				var that = this,
					loginModel = new LoginModel();

				// TODO: add secure cookie parser

				this.headerView = new HeaderView({ 
					loginModel: loginModel
				 });

				// this.headerView.model.on('loginSuccess', function(){
				// 	// delete that.headerView;
				// 	// that.headerView = new HeaderView({model: model});
				// 	that.headerView.render(model);
				// 	//that.navigate('#!/portal', {trigger: true, replace: true});
				// 	// TODO: re-render header to display logout link
				// 	that.navigate('#!/home', {trigger: true});
				// });

				App.EventBus.on('response:401', function(obj){
					Session.setItem('lastUrl', obj.hash);
					/* calling navigate doesn't change the view 
					 * unless trigger is true.
					 */
					that.navigate('#!/login', {trigger: true});
					//that.login();
				});

				App.EventBus.on('login:success', function(obj){
					debugger;
					that.headerView.render({user: obj.session});
					that.navigate(Session.getItem('lastUrl'), {trigger: true});
					Session.removeItem('lastUrl');
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

				var model, view, that;
				model = new LoginModel();
				view = new LoginView({model: model});
				that = this;

				this.elms['page-content'].html(view.render().el);

				// view.model.on('loginSuccess', function(id){
				// 	delete view;
				// 	// TODO: navigate to previous url
				// 	//that.navigate('#!/users/'+id, {trigger: true});
				// 	that.navigate('#!/home', {trigger: true});
				// });
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