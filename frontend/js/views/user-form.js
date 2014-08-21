define(["backbone", "jquery"],
function(backbone, $) {
  return backbone.View.extend({
  	el: "#data-form",
    events: {
  	  "click button": "submit"
    },
    initialize: function() {
  	  this.$username = this.$("#inputUsername");
  	  this.$password = this.$("#inputPassword");
  	  this.$error = this.$el.find('.alert');
    },
    submit: function() {
      this.hideError();

  	  var Model = this.collection.model;
  	  var model = new Model();

  	  var isValid = model.save({
  	    username: this.$username.val(),
  	    password: this.$password.val()
  	  }, {
        success: function() {
  	      this.collection.add(model);
  	    }.bind(this),
  	    error: function(model, xhr, options) { console.log(xhr);
  	      var error = xhr.responseJSON || xhr.responseText;
  	  	  this.showError(xhr.status + ': ' + (error.error_description || error));
  	    }.bind(this)
      });
      if (!isValid) {
      	this.showError(model.validationError);
      }
    },
	showError: function(message) {
  	  this.$error.text(message)
  	  	.removeClass('hidden');
	},
	hideError: function() {
	  this.$error.text('')
  	  	.addClass('hidden');	
	}
  });
});