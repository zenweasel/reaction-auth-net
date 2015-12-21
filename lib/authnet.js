/* eslint camelcase: 0 */

Meteor.AuthNet = {
  accountOptions() {
    let settings = ReactionCore.Collections.Packages.findOne({
      name: "reaction-auth-net",
      shopId: ReactionCore.getShopId(),
      enabled: true
    }).settings;
    let ref = Meteor.settings.authnet;
    let options;

    options = {
      login: getSettings(settings, ref, "api_id"),
      tran_key: getSettings(settings, ref, "transaction_key")
    };

    if (!options.login) {
      throw new Meteor.Error(403, "Invalid Authnet Credentials");
    }

    return options;
  },

  // authorize submits a payment authorization to AuthNet
  authorize(amount, cardData, callback) {
    Meteor.call("authnetSubmit", amount, cardData, callback);
  }
};

function getSettings(settings, ref, valueName) {
  if (settings !== null) {
    return settings[valueName];
  } else if (ref !== null) {
    return ref[valueName];
  }
}
