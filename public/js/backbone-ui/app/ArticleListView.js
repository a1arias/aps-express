define('ArticleListView', [
	'jquery',
	'underscore',
	'backbone',
	'text!../../../articles'
	], function($, _, BackBone, tpl){
		var ArticleListView;

		ArticleListView = BackBone.View.extend({
			initialize: function(){
				this.template = _.template(tpl);
			},

			render: function(){
				$(this.el).html(this.template);
				return this;
			}
		});

		return ArticleListView;
});