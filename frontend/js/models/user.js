define(["backbone"],
function(backbone) {
  return backbone.Model.extend({
  	url: "/api/users",
  	defaults: {
  	  addRoles: ["root"]
  	},
  	validate: function(attrs, options) {
  	  if (!attrs.username) {
  		return "Username can not be empty.";
  	  }
  	  if (!attrs.password) {
  	  	return "Password can not be empty.";
  	  }
  	  if (attrs.password.length < 6) {
  	  	return "Password should contain at least 6 characters.";
  	  }
  	}
  });
});