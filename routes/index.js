//exports.name = 'home';

exports.index = function(req, res){
	switch(req.format){
		case 'json':
			res.json({});
		default:
			if(req.xhr){
				res.render('bbui/index', {
					title: 'SoFlo Solutions'
				});
			} else {
				res.render('index', {
					title: 'SoFlo Solutions'
				});
			}
	}
};