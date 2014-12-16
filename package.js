Package.describe({
  summary: "Reaction Authorize.net - Authorize.net payments for Reaction Commerce",
  name: "reactioncommerce:reaction-auth-net",
  version: "0.0.1",
  git: "https://github.com/reactioncommerce/reaction-authnet.git"
});

Npm.depends({'auth-net-request': '2.1.0'});

Package.onUse(function (api, where) {
  api.versionsFrom('METEOR@1.0');
  api.use("meteor-platform");
  api.use("coffeescript");
  api.use("less");
  api.use("reactioncommerce:core@0.2.2");

  api.add_files([
    "common/register.coffee",
    "common/collections.coffee",
    "lib/authnet.coffee"
  ],["client","server"]);
  api.add_files("server/authnet.coffee",["server"]);
  api.add_files([
    "client/routing.coffee",
    "client/templates/authnet.html",
    "client/templates/authnet.less",
    "client/templates/authnet.coffee",
    "client/templates/cart/checkout/payment/methods/authnet/authnet.html",
    "client/templates/cart/checkout/payment/methods/authnet/authnet.less",
    "client/templates/cart/checkout/payment/methods/authnet/authnet.coffee"
  ],
  ["client"]);

});
