define('Router', [
	'jquery',
	'underscore',
	'backbone',
	'HeaderView',
	'HomeView',
	'_404View',
	'UserNewView',
	'UserModel'
], function($, _, BackBone, 
		HeaderView, HomeView, 
		_404View, 
		UserNewView, UserModel
	){
		var AppRouter,
			initialize;

		AppRouter = BackBone.Router.extend({
			routes: {
				'': 'home',
				'!/home': 'home',
				'!/users/new': 'newUser',
				'*poo': '_404'
			},

			initialize: function(){
				this.elms = {
					'page-content': $('.page-content')
				};
				
				this.headerView = new HeaderView();
				$('header').hide()
					.html(this.headerView.render().el)
					.fadeIn('slow');

				$('footer').fadeIn('slow');
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
					delete view; that.navigate('#!/users/'+id, {trigger: true});
				});
			}
		});
	
	return AppRouter;
});