define('UserListView', [
	'jquery',
	'underscore',
	'backbone',
	'text!../tpl/users/list.html',
	'UserCollection'
	], function($, _, BackBone, tpl, UserCollection){
		var UserListView;

		UserListView = BackBone.View.extend({

			initialize: function(){
				var userList;

				this.template = _.template(tpl);
				this.collection = new UserCollection();
			},

			getData: function(callback){
				var that = this;
				this.collection.fetch({
					success: function(collection){
						callback(collection);
					},
					error: function(coll, res){
						switch(res.status){
							case 401:
								debugger;
								App.EventBus.trigger('response:401', {
									hash: window.location.hash
								});
								break;
							case 404:
							case 500:
							default:
								break;
						}
					}
				});
			},

			render: function(callback){
				var that = this, tmpl;

				this.getData(function(collection){
					tmpl = that.template({
						users: collection.toJSON()
					});
					$(that.el).html(tmpl);

					callback();
				});
			}
		});

		return UserListView;
});