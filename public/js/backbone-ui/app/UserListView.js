define('UserListView', [
	'jquery',
	'underscore',
	'backbone',
	'text!../../../users',
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
				this.collection.fetch({
					success: function(collection){
						callback(collection);
					},
					error: function(coll, res){
						if(res === 404){
							// TODO: Handle 404
						} else if (res.status === 500){
							// TODO: Handle 500
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