// Please, add into nginx configuration
//   rewrite ^/api/(.*)$ /$1 break;
//   proxy_redirect off;
// and proxy_pass to 9999 port for location /api to work properly with backend

require.config({
  paths: {
  	"underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min",
  	"jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min",
  	"backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min",
    "bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min"
  },
  shim: {
    "bootstrap": {
      deps: ["jquery"],
    }
  }
});

require(["jquery", "underscore", "backbone", "bootstrap"],
function($, _, backbone, bootstrap) {
  require(["models/users", "views/user-list", "views/user-form"],
  function(Users, ListView, FormView) {
  	var list = new Users();
    list.fetch({reset: true});
    var view = new ListView({ collection: list });
    var form = new FormView({ collection: list });
  });
});