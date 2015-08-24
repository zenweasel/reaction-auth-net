Meteor.AuthNet = {
  accountOptions: function() {
    var mode, options, ref, ref1, settings;
    settings = ReactionCore.Collections.Packages.findOne({
      "name": "reaction-auth-net"
    }).settings;
    if ((settings != null ? settings.mode : void 0) === true) {
      mode = 'secure.authorize.net';
    } else {
      mode = 'test.authorize.net';
    }
    options = {
      level: mode,
      login: (settings != null ? settings.client_id : void 0) || ((ref = Meteor.settings.authnet) != null ? ref.client_id : void 0),
      tran_key: (settings != null ? settings.client_secret : void 0) || ((ref1 = Meteor.settings.authnet) != null ? ref1.client_secret : void 0)
    };
    if (!options.login) {
      throw new Meteor.Error(403, "Invalid Authnet Credentials");
    }
    return options;
  },
  authorize: function(cardData, paymentData, callback) {
    Meteor.call("authnetSubmit", "authorize", cardData, paymentData, callback);
  },
  capture: function(authCode, amount, callback) {
    var captureDetails;
    captureDetails = {
      x_type: "CAPTURE_ONLY",
      x_amount: amount,
      x_auth_code: authCode
    };
    Meteor.call("authnetCapture", captureDetails, callback);
  },
  config: function(options) {
    this.accountOptions = options;
  },
  paymentObj: function(cardData, paymentData) {
    return {
      x_type: "AUTH_ONLY",
      x_method: "CC",
      x_card_num: cardData.number,
      x_card_code: cardData.cvv2,
      x_exp_date: cardData.expire_date,
      x_amount: paymentData.total,
      x_first_name: cardData.first_name,
      x_last_name: cardData.last_name,
      x_currency_code: paymentData.currency
    };
  }
};
