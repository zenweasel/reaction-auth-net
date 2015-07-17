Package.describe({
  summary: "Reaction Authorize.net - Authorize.net payments for Reaction Commerce",
  name: "reactioncommerce:reaction-auth-net",
  version: "0.4.2",
  git: "https://github.com/reactioncommerce/reaction-auth-net"
});

Npm.depends({'paynode': '0.3.6'});

Package.onUse(function (api, where) {
  api.versionsFrom('METEOR@1.0');
  api.use("meteor-platform");
  api.use("coffeescript");
  api.use("less");
  api.use("reactioncommerce:core@0.6.0");

  api.addFiles("server/register.coffee",["server"]); // register as a reaction package
  api.addFiles("server/authnet.coffee",["server"]);

  api.addFiles([
    "common/routing.coffee",
    "common/collections.coffee",
    "lib/authnet.coffee"
  ],["client","server"]);

  api.addFiles([
    "client/templates/authnet.html",
    "client/templates/authnet.less",
    "client/templates/authnet.coffee",
    "client/templates/cart/checkout/payment/methods/authnet/authnet.html",
    "client/templates/cart/checkout/payment/methods/authnet/authnet.coffee"
  ],
  ["client"]);

});
