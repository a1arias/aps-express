var Articles = require('../models/articles').Article,
	db = require('../db'),
	restrict = require('../lib/auth').restrict;

exports.name = 'articles';

exports.restrict = restrict;

exports.before = function(req, res, next){
	var id = req.params._id;

	// TODO: get more fancy with url matching. ie: check for titles
	if(!id || id == 'new') return next();

	Articles.findOne({_id: id}, function(){
		if(err){
			return next(new Error(err));
		}
		req.article = doc;
		next();
	});
};

exports.new = function(req, res){
	switch(req.format){
		case 'json':
			res.json({});
			break;
		case 'html':
		default:
			if(req.xhr){
				res.render('bbui/articles/new');
			} else {
				res.render('articles/new', {
					title: 'Create article'
				});
			}
	}
};

exports.create = function(req, res){
	console.log('article %s saved', req.body.title);

	var newArticle = {
		title: req.body.title,
		content: {}
	};

	db.articles.createArticle(newArticle, function(err, article){
		if(!err){
			res.render('articles/show', {
				article: article,
				title: article.title
			});
		} else {
			throw new Error(err);
		}
	});
};

exports.list = function(req, res){
	db.articles.all(function(err, articles){
		if(req.params.format){
			var format = req.params.format;
			switch(format){
				case 'json':
					res.send(articles);
				break;
				case 

			}
		} else {
			if(err){
				throw new Error(err);
			} else {
				res.render('articles/list', {
					title: 'Articles List',
					articles: articles
				});
			}
		}
	});
};