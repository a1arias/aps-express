exports.name = 'blog';

exports.list = function(req, res){
  res.render('blog', { title: 'SoFlo Solutions' });
};