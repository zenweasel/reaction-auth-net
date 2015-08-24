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
  api.use("less");
  api.use("reactioncommerce:core@0.6.0");

  api.addFiles("server/register.js",["server"]); // register as a reaction package
  api.addFiles("server/authnet.js",["server"]);

  api.addFiles([
    "common/routing.js",
    "common/collections.js",
    "lib/authnet.js"
  ],["client","server"]);

  api.addFiles([
    "client/templates/authnet.html",
    "client/templates/authnet.less",
    "client/templates/authnet.js",
    "client/templates/cart/checkout/payment/methods/authnet/authnet.html",
    "client/templates/cart/checkout/payment/methods/authnet/authnet.js"
  ],
  ["client"]);

});
