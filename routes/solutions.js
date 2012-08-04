exports.name = 'solutions';

exports.list = function(req, res){
  res.render('solutions', { title: 'SoFlo Solutions' });
};