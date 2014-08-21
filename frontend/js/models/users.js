define(["backbone", "models/user"],
function(backbone, model) {
  return backbone.Collection.extend({
  	model: model,
  	comparator: "order",
  	url: "/api/users"
  });
});