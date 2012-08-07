define('UserNewView', [
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'text!../../../users/new'
], function($, _, BackBone, moment, tpl){
	var UserNewView;

	UserNewView = BackBone.View.extend({
		initialize: function(){
			this.template = _.template(tpl);

			this.errTmpl = '<div class="span4">';
			this.errTmpl += '<div class="alert alert-error">';
			this.errTmpl += '<button type="button" class="close" data-dismiss="alert">x</button>';
			this.errTmpl += '<%- msg %>';
			this.errTmpl += '</div>';
			this.errTmpl += '</div>';
			this.errTmpl = _.template(this.errTmpl);
		},

		events: {
			'focus .input-prepend input': 'removeErrMsg',
			'click .save-btn': 'saveUser',
			'click .back-btn': 'goBack'
		},

		render: function(){
			$(this.el).html(this.template());
			return this;
		},

		goBack: function(e){
			e.preventDefault();
			this.trigger('back');
		},

		saveUser: function(e){
			var fname, lname, dob, email, that;

			e.preventDefault();

			that = this;
			fname = $.trim($('#fname-input').val());
			lname = $.trim($('#lname-input').val());
			email = $.trim($('#email-input').val());
			password1 = $.trim($('#password1-input').val());
			password2 = $.trim($('#password2-input').val());
			dob = $.trim($('#dob-input'));

			if(dob){
				dob = moment(dob, 'MM/DD/YYYY').valueOf();
			} else {
				dob = null;
			}

			this.model.save({
				first_name: fname,
				last_name: lname,
				password1: password1,
				password2: password2,
				email: email,
				dob: dob
			},{
				silent: false,
				sync: true,
				success: function(model, res){
					if(res && res.errors){
						that.renderErrMsg(res.errors);
					} else {
						model.trigger('save-success', model.get('_id'));
					}
				},
				error: function(model, res){
					if(res && res.errors){
						that.renderErrMsg(res.errors);
					} else if(res.status === 404){
						// TODO: show 404 view
					} else if(res.status === 500){
						// TODO: show 500 view
					}
				}
			});
		},

		renderErrMsg: function(err){
				var msgs = [];

				this.removeErrMsg();

				if(_.isString(err)){
					msgs.push(err);
				} else {
					if (err.general){
						msgs.push(err.general);
						delete err.general;
					}
					if(_.keys(err).length){
						msgs.push(_.keys(err).join(', ') + 'field(s) are invalid');
					}
				}
				msgs = _.map(msgs, function(string){
					return string.charAt(0).toUpperCase() + string.slice(1);
				}).join('.');
				$(this.el).find('form').before(this.errTmpl({ msg: msgs }));
		},
		removeErrMsg: function(){

		}
	});

	return UserNewView;
});