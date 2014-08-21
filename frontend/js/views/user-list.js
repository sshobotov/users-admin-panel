define(["backbone", "underscore", "jquery"],
function(backbone, _, $) {
  return backbone.View.extend({
  	el: "#data-list",
  	template: _.template($("#itemsTpl").html()),
  	initialize: function() {
  	  this.listenTo(this.collection, "add", this.render);
  	  this.listenTo(this.collection, "reset", this.render);
  	  this.$listContainer = this.$("#data-list-items");
  	},
  	render: function() {
      this.$listContainer.html(
      	this.template({ items: this.collection.toJSON() })
      );
  	}
  });
});

