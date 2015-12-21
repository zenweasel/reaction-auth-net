/* eslint camelcase: 0 */

const AuthNet = Npm.require("node-authorize-net");

Meteor.methods({
  authnetSubmit: function (amount, cardData) {
    check(amount, String);
    check(cardData, Object);

    let {
      login,
      tran_key
    } = Meteor.AuthNet.accountOptions();
    let {
      cardNumber,
      expirationYear,
      expirationMonth
    } = cardData;
    const authnetService = new AuthNet(login, tran_key);

    return authnetService.authCaptureTransaction(amount,
      cardNumber,
      expirationYear,
      expirationMonth
    );
  }
});
