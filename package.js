Package.describe({
  summary: "Reaction Authorize.net - Authorize.net payments for Reaction Commerce",
  name: "reactioncommerce:reaction-auth-net",
  version: "0.5.0",
  git: "https://github.com/reactioncommerce/reaction-auth-net"
});

Npm.depends({'paynode': '0.3.6'});

Package.onUse(function (api, where) {
  api.versionsFrom('METEOR@1.2');

  // meteor base packages
  api.use("standard-minifiers");
  api.use("mobile-experience");
  api.use("meteor-base");
  api.use("mongo");
  api.use("blaze-html-templates");
  api.use("session");
  api.use("jquery");
  api.use("tracker");
  api.use("logging");
  api.use("reload");
  api.use("random");
  api.use("ejson");
  api.use("spacebars");
  api.use("check");

  // meteor add-on packages

  api.use("less");
  api.use("coffeescript");
  api.use("reactioncommerce:core@0.8.0");

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
