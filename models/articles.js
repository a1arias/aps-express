var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var ArticleSchema = new Schema({
	title: { type: String, index: true, lowercase: true },
	content: { type: String, index: true, lowercase: false },
	createDate: { type: Date, default: Date.now }
});

var ArticleModel = mongoose.model('Article', ArticleSchema);

exports.Article = ArticleModel;